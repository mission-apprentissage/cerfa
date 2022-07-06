const express = require("express");
const Joi = require("joi");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const permissionsDossierMiddleware = require("../../middlewares/permissionsDossierMiddleware");
module.exports = (components) => {
  const router = express.Router();
  const { agecap } = components;

  router.post(
    "/",
    permissionsDossierMiddleware(components, ["dossier/publication"]), // send_agecap
    tryCatch(async ({ body, user }, res) => {
      const { dossierId } = await Joi.object({
        dossierId: Joi.string().required(),
      }).validateAsync(body, { abortEarly: false });

      const { sendContratResponse, sendDocumentResponses } = await agecap.convertAndSendToAgecap({
        components,
        dossierId,
        user,
      });

      return res.json({ contrat: sendContratResponse.data, documents: sendDocumentResponses });
    })
  );

  return router;
};
