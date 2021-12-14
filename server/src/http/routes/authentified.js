const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");

module.exports = ({ users }) => {
  const router = express.Router();

  router.get(
    "/current",
    tryCatch(async (req, res) => {
      if (req.user) {
        await users.loggedInUser(req.user.email);
        return res.status(200).json({
          ...req.user,
          loggedIn: true,
        });
      }
      const payload = await users.structureUser({ email: "anonymous", roles: [], acl: [] });
      return res.json(payload);
    })
  );

  return router;
};
