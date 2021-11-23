const express = require("express");
const cerfaSchema = require("../../../common/model/schema/specific/cerfa/Cerfa");

module.exports = () => {
  const router = express.Router();

  router.get("/schema", async (req, res) => {
    return res.json(cerfaSchema);
  });

  // router.get("/", async (req, res) => {
  //   let { idDossier } = await Joi.object({
  //     idDossier: Joi.string().required(),
  //   }).validateAsync(req.query, { abortEarly: false });

  //   const result = await History.find({ idDossier });

  //   return res.json(result);
  // });

  return router;
};
