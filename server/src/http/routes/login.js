const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { createUserToken } = require("../../common/utils/jwtUtils");
const compose = require("compose-middleware").compose;
const tryCatch = require("../middlewares/tryCatchMiddleware");

module.exports = ({ users }) => {
  const router = express.Router(); // eslint-disable-line new-cap
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      function (username, password, cb) {
        return users
          .authenticate(username, password)
          .then((user) => {
            if (!user) {
              return cb(null, false);
            }
            return cb(null, user);
          })
          .catch((err) => cb(err));
      }
    )
  );

  router.post(
    "/",
    compose([
      passport.authenticate("local", { session: false, failWithError: true }),
      tryCatch(async (req, res) => {
        const user = req.user;
        const token = createUserToken(user);
        return res.json({ token });
      }),
    ])
  );

  return router;
};
