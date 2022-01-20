const express = require("express");
const Joi = require("joi");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const permissionsDossierMiddleware = require("../../middlewares/permissionsDossierMiddleware");
// const apiNaf = require("../../../common/apis/ApiNaf");

module.exports = (components) => {
  const router = express.Router();
  const { dossiers, cerfas } = components;
  router.post(
    "/",
    permissionsDossierMiddleware(components, ["dossier/publication"]),
    tryCatch(async ({ body }, res) => {
      const { dossierId } = await Joi.object({
        dossierId: Joi.string().required(),
      }).validateAsync(body, { abortEarly: false });

      const dossier = await dossiers.findDossierById(dossierId);
      const cerfa = await cerfas.findCerfaByDossierId(dossierId);

      console.log(dossier, cerfa);
      // const resp = await apiNaf.getFromCode(naf);

      return res.json({});
    })
  );

  return router;
};
