const express = require("express");
const Boom = require("boom");
const Joi = require("joi");
const config = require("config");
const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const validators = require("../utils/validators");
const { createPasswordToken, createUserToken } = require("../../common/utils/jwtUtils");
const path = require("path");

const IS_OFFLINE = Boolean(config.isOffline);

const checkPasswordToken = (users) => {
  passport.use(
    "jwt-password",
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromBodyField("passwordToken"),
        secretOrKey: config.auth.password.jwtSecret,
      },
      (jwt_payload, done) => {
        return users
          .getUser(jwt_payload.sub)
          .then((user) => {
            if (!user) {
              return done(null, false);
            }
            return done(null, user);
          })
          .catch((err) => done(err));
      }
    )
  );

  return passport.authenticate("jwt-password", { session: false, failWithError: true });
};

const getEmailTemplate = (type = "forgotten-password") => {
  return path.join(__dirname, `../../assets/templates/${type}.mjml.ejs`);
};

module.exports = ({ users, mailer }) => {
  const router = express.Router(); // eslint-disable-line new-cap

  router.post(
    "/forgotten-password",
    tryCatch(async (req, res) => {
      const { username } = await Joi.object({
        username: Joi.string().required(),
      }).validateAsync(req.body, { abortEarly: false });

      // try also by email since users tends to do that
      const user = (await users.getUser(username)) ?? (await users.getUserByEmail(username));
      if (!user) {
        throw Boom.badRequest();
      }
      let noEmail = req.query.noEmail;

      const token = createPasswordToken(user.username);
      const url = `${config.publicUrl}/reset-password?passwordToken=${token}`;

      if (noEmail) {
        return res.json({ token });
      } else {
        await mailer.sendEmail(
          user.email,
          `[${config.env} Contrat publique apprentissage] Réinitialiser votre mot de passe`,
          getEmailTemplate("forgotten-password"),
          {
            url,
            username: user.username,
            publicUrl: config.publicUrl,
          }
        );

        return res.json({});
      }
    })
  );

  router.post(
    "/reset-password",
    checkPasswordToken(users),
    tryCatch(async (req, res) => {
      const user = req.user;
      const { newPassword } = await Joi.object({
        passwordToken: Joi.string().required(),
        newPassword: validators.password().required(),
      }).validateAsync(req.body, { abortEarly: false });

      const updatedUser = await users.changePassword(user.username, newPassword);

      const payload = await users.structureUser(updatedUser);

      await users.registerUser(payload.email);

      const token = createUserToken({ payload });

      res
        .cookie(`cerfa-${config.env}-jwt`, token, {
          maxAge: 365 * 24 * 3600000,
          httpOnly: !IS_OFFLINE,
          sameSite: IS_OFFLINE ? "lax" : "none",
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
