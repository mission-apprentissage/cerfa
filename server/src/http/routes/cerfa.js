const express = require("express");
const cerfaSchema = require("../../common/model/schema/cerfa/Cerfa");

module.exports = () => {
  const router = express.Router();

  router.get("/schema", async (req, res) => {
    return res.json(cerfaSchema);
  });

  return router;
};
