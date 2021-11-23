const express = require("express");
const cerfaSchema = require("../../common/model/schema/specific/cerfa/Cerfa");

module.exports = () => {
  const router = express.Router();

  router.get("/schema", async (req, res) => {
    return res.json(cerfaSchema);
  });

  return router;
};
