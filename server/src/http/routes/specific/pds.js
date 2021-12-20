const express = require("express");
const { Issuer, generators } = require("openid-client");
const passport = require("passport");
const { Strategy: JWTStrategy } = require("passport-jwt");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const config = require("../../../config");

const { createPdsToken } = require("../../../common/utils/jwtUtils");

const IS_OFFLINE = Boolean(config.isOffline);

const cookieExtractor = (req) => {
  let jwt = null;

  if (req && req.cookies) {
    jwt = req.cookies[`cerfa-${config.env}-pds-code-verifier`];
  }

  return jwt;
};

module.exports = () => {
  const router = express.Router();

  const getPdsClient = async () => {
    const pdsIssuer = await Issuer.discover("https://agadir-app.rct01.kleegroup.com/identification/oidc/");

    const client = new pdsIssuer.Client({
      client_id: config.pds.clientId,
      client_secret: config.pds.clientSecret,
      redirect_uris: [`${config.publicUrl}/api/v1/pds/cb`],
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
        const { expiration } = jwtPayload;

        if (Date.now() > expiration) {
          done(new Error("Unauthorized"), false);
        }

        return done(null, jwtPayload);
      }
    )
  );

  router.get(
    "/discover",
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
      console.log(code_verifier);

      return res
        .cookie(`cerfa-${config.env}-pds-code-verifier`, token, {
          maxAge: 365 * 24 * 3600000,
          httpOnly: !IS_OFFLINE,
          sameSite: IS_OFFLINE ? "lax" : "none",
          secure: !IS_OFFLINE,
        })
        .status(200)
        .json({ authorizationUrl });
      // .redirect(authorizationUrl);
    })
  );

  router.get(
    "/cb",
    passport.authenticate("pds", { session: false }),
    tryCatch(async (req, res) => {
      const client = await getPdsClient();
      const params = client.callbackParams(req);

      const tokenSet = await client.callback(`${config.publicUrl}`, params, {
        code_verifier: req.user.code_verifier,
      });
      console.log("received and validated tokens %j", tokenSet);
      console.log("validated ID Token claims %j", tokenSet.claims());

      console.log(tokenSet.access_token);
      const userinfo = await client.userinfo(tokenSet.access_token);
      console.log("userinfo %j", userinfo);

      return res.redirect("/");
    })
  );

  return router;
};
