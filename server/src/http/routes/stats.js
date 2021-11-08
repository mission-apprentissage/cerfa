const express = require("express");
const { Sample } = require("../../common/model");

module.exports = () => {
  const router = express.Router();
  router.get("/", async (req, res) => {
    res.json({
      stats: {
        nbItems: await Sample.countDocuments(),
      },
    });
  });

  return router;
};
