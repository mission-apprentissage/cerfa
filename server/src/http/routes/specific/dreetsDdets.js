const express = require("express");
const Joi = require("joi");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const permissionsDossierMiddleware = require("../../middlewares/permissionsDossierMiddleware");

module.exports = (components) => {
  const router = express.Router();

  const { dreetsDdets } = components;

  router.post(
    "/",
    permissionsDossierMiddleware(components, ["dossier/publication"]),
    tryCatch(async ({ body }, res) => {
      const { code_region, code_dpt } = await Joi.object({
        code_region: Joi.number(),
        code_dpt: Joi.string(),
      })
        .unknown()
        .validateAsync(body, { abortEarly: false });

      const dreets = await dreetsDdets.findDreets(code_region);
      const departement_code = code_dpt === "2A" || code_dpt === "2B" ? code_dpt.padStart(3, "0") : code_dpt;
      const ddets = await dreetsDdets.findDdets(departement_code);

      return res.json({ dreets, ddets });
    })
  );

  return router;
};
