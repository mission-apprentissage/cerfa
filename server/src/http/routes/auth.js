const express = require("express");
const config = require("../../config");
const Joi = require("joi");
const Boom = require("boom");
const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const tryCatch = require("../middlewares/tryCatchMiddleware");
// eslint-disable-next-line no-unused-vars
const { createUserToken, createActivationToken } = require("../../common/utils/jwtUtils");

const IS_OFFLINE = Boolean(config.isOffline);

const checkActivationToken = (users) => {
  passport.use(
    "jwt-activation",
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromBodyField("activationToken"),
        secretOrKey: config.auth.activation.jwtSecret,
      },
      (jwt_payload, done) => {
        return users
          .getUser(jwt_payload.sub)
          .then((user) => {
            if (!user) {
              return done(null, false);
            }
            return done(null, { ...user, tmpPwd: jwt_payload.tmpPwd });
          })
          .catch((err) => done(err));
      }
    )
  );

  return passport.authenticate("jwt-activation", { session: false, failWithError: true });
};

// eslint-disable-next-line no-unused-vars
module.exports = ({ users, mailer, sessions }) => {
  const router = express.Router(); // eslint-disable-line new-cap

  router.post(
    "/login",
    tryCatch(async (req, res) => {
      const { username, password } = req.body;
      const user = await users.getUser(username.toLowerCase());
      if (!user) {
        return res.status(401).json({ message: "Accès non autorisé" });
      }

      if (user.orign_register === "PDS") {
        throw Boom.conflict(`Wrong connection method`, { message: `pds login` });
      }

      const auth = await users.authenticate(user.email, password);

      if (!auth) return res.status(401).json({ message: "Accès non autorisé" });

      const payload = await users.structureUser(user);

      await users.loggedInUser(payload.email);

      const token = createUserToken({ payload });

      if (await sessions.findJwt(token)) {
        await sessions.removeJwt(token);
      }
      await sessions.addJwt(token);

      res
        .cookie(`cerfa-${config.env}-jwt`, token, {
          maxAge: 30 * 24 * 3600000,
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

  // router.post(
  //   "/register",
  //   tryCatch(async ({ body }, res) => {
  //     const { compte, siret, email, password, nom, prenom, civility } = await Joi.object({
  //       compte: Joi.string().required(),
  //       email: Joi.string().required(),
  //       password: Joi.string().required(),
  //       siret: Joi.string().required(),
  //       nom: Joi.string().required(),
  //       prenom: Joi.string().required(),
  //       civility: Joi.string().required(),
  //     }).validateAsync(body, { abortEarly: false });

  //     const alreadyExists = await users.getUser(email.toLowerCase());
  //     if (alreadyExists) {
  //       throw Boom.conflict(`Unable to create`, { message: `email already in use` });
  //     }

  //     const user = await users.createUser(email, password, {
  //       siret,
  //       nom,
  //       prenom,
  //       civility,
  //       roles: compte === "entreprise" || compte === "cfa" ? [compte] : [],
  //       orign_register: "ORIGIN",
  //     });
  //     if (!user) {
  //       throw Boom.badRequest("Something went wrong");
  //     }

  //     await mailer.sendEmail(user.email, `[${config.env} Contrat publique apprentissage] Bienvenue`, "grettings", {
  //       username: user.username,
  //       civility: user.civility,
  //       tmpPwd: password,
  //       publicUrl: config.publicUrl,
  //       activationToken: createActivationToken(user.email.toLowerCase(), { payload: { tmpPwd: password } }),
  //     });

  //     return res.json({ succeeded: true });
  //   })
  // );

  router.post(
    "/register",
    tryCatch(async (req, res) => {
      return res.json({ closed: true });
    })
  );

  router.post(
    "/activation",
    checkActivationToken(users),
    tryCatch(async ({ body, user }, res) => {
      await Joi.object({
        activationToken: Joi.string().required(),
      }).validateAsync(body, { abortEarly: false });

      const auth = await users.authenticate(user.email.toLowerCase(), user.tmpPwd);

      if (!auth) {
        throw Boom.unauthorized("Accès non autorisé");
      }

      const updatedUser = await users.activate(user.email.toLowerCase());

      const payload = await users.structureUser(updatedUser);

      await users.loggedInUser(payload.email);

      const token = createUserToken({ payload });
      await sessions.addJwt(token);

      return res
        .cookie(`cerfa-${config.env}-jwt`, token, {
          maxAge: 30 * 24 * 3600000,
          httpOnly: !IS_OFFLINE,
          sameSite: "lax",
          secure: !IS_OFFLINE,
        })
        .status(200)
        .json({
          succeeded: true,
          token,
        });
    })
  );

  router.get(
    "/logout",
    tryCatch(async (req, res) => {
      if (req.cookies[`cerfa-${config.env}-jwt`]) {
        await sessions.removeJwt(req.cookies[`cerfa-${config.env}-jwt`]);
        res.clearCookie(`cerfa-${config.env}-jwt`).status(200).json({
          loggedOut: true,
        });
      } else {
        res.status(401).json({
          error: "Invalid jwt",
        });
      }
    })
  );

  return router;
};
