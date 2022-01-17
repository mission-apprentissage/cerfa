const express = require("express");
const Joi = require("joi");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const permissionsDossierMiddleware = require("../../middlewares/permissionsDossierMiddleware");
const authMiddleware = require("../../middlewares/authMiddleware");
const { getDataFromSiret } = require("../../../logic/handlers/siretHandler");
const apiReferentiel = require("../../../common/apis/ApiReferentiel");

const lookupUaiCatalogue = (uai_potentiels) => {
  let uai = null;
  for (let i = 0; i < uai_potentiels.length; i++) {
    const uai_potentiel = uai_potentiels[i];
    if (uai_potentiel.sources.includes("catalogue-etablissements")) {
      uai = uai_potentiel.uai;
      break;
    }
  }
  return uai;
};

module.exports = (components) => {
  const router = express.Router();

  router.post(
    "/",
    authMiddleware(components),
    permissionsDossierMiddleware(components, ["dossier/page_formulaire"]),
    tryCatch(async ({ body }, res) => {
      const { siret, organismeFormation } = await Joi.object({
        siret: Joi.string().required(),
        organismeFormation: Joi.boolean(),
      })
        .unknown()
        .validateAsync(body, { abortEarly: false });

      const data = await getDataFromSiret(siret);

      let referentielData = {};

      if (organismeFormation) {
        const refResult = await apiReferentiel.getOrganisme(siret);

        if (refResult) {
          if (!data.result.enseigne && refResult.enseigne) {
            data.result.enseigne = refResult.enseigne;
          }
          if (!data.result.entreprise_raison_sociale && refResult.raison_sociale) {
            data.result.entreprise_raison_sociale = refResult.raison_sociale;
          }
          if (!data.result.entreprise_forme_juridique_code && refResult.forme_juridique) {
            data.result.entreprise_forme_juridique_code = refResult.forme_juridique.code;
          }
          if (!data.result.entreprise_forme_juridique && refResult.forme_juridique) {
            data.result.entreprise_forme_juridique = refResult.forme_juridique.label;
          }
          if (refResult.label) {
            data.result.label = refResult.label;
          }
          if (refResult.uai) {
            referentielData.uai = refResult.uai;
          } else if (refResult.uai_potentiels.length > 0) {
            referentielData.uai = lookupUaiCatalogue(refResult.uai_potentiels);
          }
        }
      }

      let dataResult = data.result;
      if (Object.keys(dataResult).length > 0) {
        dataResult = { ...data.result, ...referentielData };
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
          secretSiret: data.result.secretSiret || false,
        };
      }
      return res.json({ ...data, result: dataResult });
    })
  );

  return router;
};
