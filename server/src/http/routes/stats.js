const express = require("express");
const { Log } = require("../../common/model");

module.exports = () => {
  const router = express.Router();
  router.get("/", async (req, res) => {
    res.json({
      stats: {
        nbItems: await Log.countDocuments(),
      },
    });
  });

  return router;
};
