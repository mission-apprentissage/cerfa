const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");

module.exports = ({ users }) => {
  const router = express.Router(); // eslint-disable-line new-cap

  router.post(
    "/login",
    tryCatch(async (req, res) => {
      const { username, password } = req.body;
      const user = await users.authenticate(username, password);

      if (!user) return res.status(401).json({ message: "Utilisateur non trouvé" });

      const payload = await users.structureUser(user);

      req.logIn(payload, async () => {
        await users.registerUser(payload.email);
        return res.json(payload);
      });
    })
  );

  router.get(
    "/logout",
    tryCatch((req, res) => {
      req.logOut();
      req.session.destroy();
      return res.json({ loggedOut: true });
    })
  );

  router.get(
    "/current-session",
    tryCatch(async (req, res) => {
      if (req.user) {
        let { user } = req.session.passport;
        return res.json(user);
      }
      const payload = await users.structureUser({ username: "anonymous", roles: ["public"], acl: [] });
      return res.json(payload);
    })
  );

  return router;
};
