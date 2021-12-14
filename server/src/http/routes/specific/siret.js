const express = require("express");
const Joi = require("joi");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const permissionsDossierMiddleware = require("../../middlewares/permissionsDossierMiddleware");
const authMiddleware = require("../../middlewares/authMiddleware");
const { getDataFromSiret } = require("../../../logic/handlers/siretHandler");

module.exports = (components) => {
  const router = express.Router();

  router.post(
    "/",
    authMiddleware(components),
    permissionsDossierMiddleware(components, ["dossier/page_formulaire"]),
    tryCatch(async ({ body }, res) => {
      const { siret } = await Joi.object({
        siret: Joi.string().required(),
      }).validateAsync(body, { abortEarly: false });

      const data = await getDataFromSiret(siret);

      let uai = ""; // TODO  FOR TEST
      if (siret === "30291412200015") {
        uai = "0561910X";
      }
      let dataResult = data.result;
      if (Object.keys(dataResult).length > 0) {
        dataResult = { ...data.result, uai };
      }
      return res.json({ ...data, result: dataResult });
    })
  );

  router.post(
    "/adresse",
    tryCatch(async ({ body }, res) => {
      const { siret } = await Joi.object({
        siret: Joi.string().required(),
      }).validateAsync(body, { abortEarly: false });

      const data = await getDataFromSiret(siret);

      let uai = ""; // TODO  FOR TEST
      if (siret === "30291412200015") {
        uai = "0561910X";
      }

      let dataResult = data.result;
      if (Object.keys(dataResult).length > 0) {
        dataResult = {
          enseigne: data.result.enseigne,
          entreprise_raison_sociale: data.result.entreprise_raison_sociale,
          numero_voie: data.result.numero_voie,
          nom_voie: data.result.nom_voie,
          complement_adresse: data.result.complement_adresse,
          code_postal: data.result.code_postal,
          localite: data.result.localite,
          ferme: data.result.ferme,
          uai,
        };
      }
      return res.json({ ...data, result: dataResult });
    })
  );

  return router;
};
