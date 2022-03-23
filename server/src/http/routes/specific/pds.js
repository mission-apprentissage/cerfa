const express = require("express");
const { Issuer, generators } = require("openid-client");
const passport = require("passport");
const { Strategy: JWTStrategy } = require("passport-jwt");
const generator = require("generate-password");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const authMiddleware = require("../../middlewares/authMiddleware");
const config = require("../../../config");
const Boom = require("boom");
const Joi = require("joi");

const { createUserToken, createPdsToken } = require("../../../common/utils/jwtUtils");

const IS_OFFLINE = Boolean(config.isOffline);

const cookieExtractor = (req) => {
  let jwt = null;

  if (req && req.cookies) {
    jwt = req.cookies[`cerfa-${config.env}-pds-code-verifier`];
  }

  return jwt;
};

module.exports = (components) => {
  const router = express.Router();

  const { users, sessions, mailer } = components;

  const getPdsClient = async () => {
    const pdsIssuer = await Issuer.discover(
      config.env === "production"
        ? "https://mesdemarches.emploi.gouv.fr/identification/oidc/"
        : "https://agadir-app.rct01.kleegroup.com/identification/oidc/"
    );

    const client = new pdsIssuer.Client({
      client_id: config.pds.clientId,
      client_secret: config.pds.clientSecret,
      redirect_uris: [`${config.publicUrl}/api/v1/pds/loginOrRegister`],
      response_types: ["code"],
    });
    return client;
  };

  passport.use(
    "pds",
    new JWTStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: config.auth.pds.jwtSecret,
      },
      (jwtPayload, done) => {
        const { exp } = jwtPayload;

        if (Date.now() > exp * 1000) {
          done(new Error("Unauthorized"), false);
        }

        return done(null, jwtPayload);
      }
    )
  );

  router.get(
    "/getUrl",
    tryCatch(async (req, res) => {
      const client = await getPdsClient();

      const code_verifier = generators.codeVerifier();

      const code_challenge = generators.codeChallenge(code_verifier);

      const authorizationUrl = client.authorizationUrl({
        scope: "openid email profile address phone portail",
        code_challenge,
        code_challenge_method: "S256",
      });

      const token = createPdsToken({ payload: { code_verifier } });

      return res
        .cookie(`cerfa-${config.env}-pds-code-verifier`, token, {
          maxAge: 365 * 24 * 3600000,
          httpOnly: !IS_OFFLINE,
          sameSite: "lax",
          secure: !IS_OFFLINE,
        })
        .status(200)
        .json({ authorizationUrl });
    })
  );

  router.get(
    "/loginOrRegister",
    passport.authenticate("pds", { session: false }),
    tryCatch(async (req, res) => {
      const client = await getPdsClient();
      const params = client.callbackParams(req);

      const tokenSet = await client.callback(`${config.publicUrl}`, params, {
        code_verifier: req.user.code_verifier,
      });

      const userinfo = await client.userinfo(tokenSet.access_token);

      const user = await users.getUser(userinfo.sub.toLowerCase());
      if (user) {
        // TODO FIX du 23/03/2022 suite à une erreur de manipulation ABD - A supprimer en Juin/2022
        const updatedUser = await users.updateUser(user._id, {
          orign_register: "PDS",
        });

        // Login
        const payload = await users.structureUser(updatedUser);

        await users.loggedInUser(payload.email);

        const token = createUserToken({ payload });
        await sessions.addJwt(token);
        return res
          .cookie(`cerfa-${config.env}-jwt`, token, {
            maxAge: 365 * 24 * 3600000,
            httpOnly: !IS_OFFLINE,
            sameSite: "lax",
            secure: !IS_OFFLINE,
          })
          .status(200)
          .redirect("/mes-dossiers/mon-espace");
      } else {
        // Register

        const alreadyExists = await users.getUser(userinfo.sub.toLowerCase());
        if (alreadyExists) {
          throw Boom.conflict(`Unable to create`, {
            message: `Ce courriel est déjà utilisé. Merci de vous connecter directement sur la plateforme`,
          });
        }

        const tmpPassword = generator.generate({
          length: 10,
          numbers: true,
          lowercase: true,
          uppercase: true,
          strict: true,
        });
        const user = await users.createUser(userinfo.sub, tmpPassword, {
          siret: userinfo.attributes.siret,
          nom: userinfo.attributes.name,
          prenom: userinfo.attributes.given_name,
          telephone: userinfo.attributes.phone_number ? "+33" + userinfo.attributes.phone_number.substr(1, 9) : null,
          civility: userinfo.attributes.civility,
          account_status: "FORCE_COMPLETE_PROFILE",
          confirmed: true,
          orign_register: "PDS",
        });
        if (!user) {
          throw Boom.badRequest("Something went wrong");
        }
        await mailer.sendEmail(
          user.email,
          `[${config.env} Contrat publique apprentissage] Bienvenue`,
          "simple-grettings",
          {
            username: user.username,
            civility: user.civility,
            publicUrl: config.publicUrl,
          }
        );

        const payload = await users.structureUser(user);

        await users.loggedInUser(payload.email);

        const token = createUserToken({ payload });
        await sessions.addJwt(token);

        return res
          .cookie(`cerfa-${config.env}-jwt`, token, {
            maxAge: 365 * 24 * 3600000,
            httpOnly: !IS_OFFLINE,
            sameSite: "lax",
            secure: !IS_OFFLINE,
          })
          .status(200)
          .redirect("/auth/finalize");
      }
    })
  );

  router.post(
    "/finalize",
    authMiddleware(components),
    tryCatch(async ({ body, user }, res) => {
      const { compte, siret } = await Joi.object({
        compte: Joi.string().required(),
        siret: Joi.string().required(),
      }).validateAsync(body, { abortEarly: false });

      const userDb = await users.getUser(user.email.toLowerCase());
      if (!userDb) {
        throw Boom.conflict(`Unable to retrieve user`);
      }

      if (userDb.orign_register !== "PDS" && userDb.account_status !== "FORCE_COMPLETE_PROFILE") {
        throw Boom.badRequest("Something went wrong");
      }

      // TODO warm user if siret different than the one in PDS

      const updateUser = await users.finalizePdsUser(userDb._id, {
        siret,
        roles: compte === "entreprise" || compte === "cfa" ? [compte] : [],
      });
      if (!updateUser) {
        throw Boom.badRequest("Something went wrong");
      }

      const payload = await users.structureUser(updateUser);

      await users.loggedInUser(payload.email);

      const token = createUserToken({ payload });

      if (await sessions.findJwt(token)) {
        await sessions.removeJwt(token);
      }

      await sessions.addJwt(token);

      return res
        .cookie(`cerfa-${config.env}-jwt`, token, {
          maxAge: 365 * 24 * 3600000,
          httpOnly: !IS_OFFLINE,
          sameSite: "lax",
          secure: !IS_OFFLINE,
        })
        .status(200)
        .json({
          loggedIn: true,
          token,
        });
    })
  );

  return router;
};
