const express = require("express");
const config = require("../../config");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { createUserToken } = require("../../common/utils/jwtUtils");

const IS_OFFLINE = Boolean(config.isOffline);

module.exports = ({ users }) => {
  const router = express.Router(); // eslint-disable-line new-cap

  router.post(
    "/login",
    tryCatch(async (req, res) => {
      const { username, password } = req.body;
      const user = await users.authenticate(username, password);

      if (!user) return res.status(401).json({ message: "Utilisateur non trouvé" });

      const payload = await users.structureUser(user);

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

  router.get(
    "/logout",
    tryCatch((req, res) => {
      if (req.cookies[`cerfa-${config.env}-jwt`]) {
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
