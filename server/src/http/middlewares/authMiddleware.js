const config = require("config");
const passport = require("passport");
const { Strategy: JWTStrategy } = require("passport-jwt");
const compose = require("compose-middleware").compose;

const cookieExtractor = (req) => {
  let jwt = null;

  if (req && req.cookies) {
    jwt = req.cookies[`cerfa-${config.env}-jwt`];
  }

  return jwt;
};

module.exports = ({ users }) => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: config.auth.user.jwtSecret,
      },
      (jwtPayload, done) => {
        const { expiration } = jwtPayload;

        if (Date.now() > expiration) {
          done("Unauthorized", false);
        }

        return users
          .getUser(jwtPayload.sub)
          .then(async (user) => {
            if (!user) {
              return done("Unauthorized", false);
            }
            if (user.invalided_token) {
              await users.updateUser(user.username, { invalided_token: false });
              return done(null, { invalided_token: true });
            }
            const result = await users.structureUser(user);
            return done(null, result);
          })
          .catch((err) => done(err));
      }
    )
  );

  return compose([
    passport.authenticate("jwt", { session: false }),
    async (req, res, next) => {
      if (req.user.invalided_token) {
        return res.clearCookie(`cerfa-${config.env}-jwt`).status(401).json({
          error: "Invalid jwt",
        });
      }
      next();
    },
  ]);
};
