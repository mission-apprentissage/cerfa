const express = require("express");
const Joi = require("joi");
const Boom = require("boom");
const { Cerfa } = require("../../../common/model/index");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const cerfaSchema = require("../../../common/model/schema/specific/cerfa/Cerfa");

module.exports = ({ cerfas }) => {
  const router = express.Router();

  router.get("/schema", async (req, res) => {
    return res.json(cerfaSchema);
  });

  router.get("/", async (req, res) => {
    let { query } = await Joi.object({
      query: Joi.string().default("{}"),
    }).validateAsync(req.query, { abortEarly: false });

    let json = JSON.parse(query);
    const results = await Cerfa.find(json);

    // TODO HAS RIGHTS

    return res.json(results);
  });

  router.get(
    "/:id",
    tryCatch(async ({ params }, res) => {
      const cerfa = await Cerfa.findById(params.id);
      if (!cerfa) {
        throw Boom.notFound("Doesn't exist");
      }

      // TODO HAS RIGHTS

      res.json(cerfa);
    })
  );

  router.post(
    "/",
    tryCatch(async ({ body, user }, res) => {
      const result = await cerfas.createCerfa(body, user);

      return res.json(result);
    })
  );

  router.put(
    "/:id",
    tryCatch(async ({ body, params }, res) => {
      await Joi.object({
        employeur: Joi.object({
          denomination: Joi.string(),
          siret: Joi.string(),
          naf: Joi.string(),
          nombreDeSalaries: Joi.number(),
          codeIdcc: Joi.string(),
          libelleIdcc: Joi.string(),
          telephone: Joi.string(),
          courriel: Joi.string(),
          adresse: Joi.object({
            numero: Joi.number(),
            voie: Joi.string(),
            complement: Joi.string(),
            label: Joi.string(),
            codePostal: Joi.string(),
            commune: Joi.string(),
          }),
          nom: Joi.string(),
          prenom: Joi.string(),
          typeEmployeur: Joi.number(),
          caisseComplementaire: Joi.string(),
          regimeSpecifique: Joi.boolean(),
          attestationEligibilite: Joi.boolean(),
          attestationPieces: Joi.boolean(),
        }),
        apprenti: Joi.object({
          nom: Joi.string(),
          prenom: Joi.string(),
          sexe: Joi.string(),
          nationalite: Joi.number(),
          dateNaissance: Joi.date(),
          departementNaissance: Joi.string(),
          communeNaissance: Joi.string(),
          nir: Joi.string(),
          regimeSocial: Joi.number(),
          handicap: Joi.boolean(),
          situationAvantContrat: Joi.number(),
          diplome: Joi.number(),
          derniereClasse: Joi.number(),
          diplomePrepare: Joi.number(),
          intituleDiplomePrepare: Joi.string(),
          telephone: Joi.string(),
          courriel: Joi.string(),
          adresse: Joi.object({
            numero: Joi.number(),
            voie: Joi.string(),
            complement: Joi.string(),
            label: Joi.string(),
            codePostal: Joi.string(),
            commune: Joi.string(),
          }),
          responsableLegal: Joi.object({
            nom: Joi.string(),
            prenom: Joi.string(),
            adresse: Joi.object({
              numero: Joi.number(),
              voie: Joi.string(),
              complement: Joi.string(),
              label: Joi.string(),
              codePostal: Joi.string(),
              commune: Joi.string(),
            }),
          }),
          inscriptionSportifDeHautNiveau: Joi.boolean(),
        }),
        maitre1: Joi.object({
          nom: Joi.string(),
          prenom: Joi.string(),
          dateNaissance: Joi.date(),
        }),
        maitre2: Joi.object({
          nom: Joi.string(),
          prenom: Joi.string(),
          dateNaissance: Joi.date(),
        }),
        formation: Joi.object({
          rncp: Joi.string(),
          codeDiplome: Joi.string(),
          typeDiplome: Joi.number(),
          intituleQualification: Joi.string(),
          dateDebutFormation: Joi.date(),
          dateFinFormation: Joi.date(),
          dureeFormation: Joi.number(),
          dateObtentionDiplome: Joi.date(),
        }),
        contrat: Joi.object({
          modeContractuel: Joi.number(),
          typeContratApp: Joi.number(),
          numeroContratPrecedent: Joi.string(),
          noContrat: Joi.string(),
          noAvenant: Joi.string(),
          dateDebutContrat: Joi.date(),
          dateEffetAvenant: Joi.date(),
          dateConclusion: Joi.date(),
          dateFinContrat: Joi.date(),
          dateRupture: Joi.date(),
          lieuSignatureContrat: Joi.string(),
          typeDerogation: Joi.number(),
          dureeTravailHebdoHeures: Joi.number(),
          dureeTravailHebdoMinutes: Joi.number(),
          travailRisque: Joi.boolean(),
          salaireEmbauche: Joi.number(),
          avantageNourriture: Joi.number(),
          avantageLogement: Joi.number(),
          autreAvantageEnNature: Joi.boolean(),
          remunerationsAnnuelles: Joi.array().items({
            dateDebut: Joi.date(),
            dateFin: Joi.date(),
            taux: Joi.number(),
            typeSalaire: Joi.string(),
            ordre: Joi.string(),
          }),
        }),
        organismeFormation: Joi.object({
          denomination: Joi.string(),
          formationInterne: Joi.boolean(),
          siret: Joi.string(),
          uaiCfa: Joi.string(),
          visaCfa: Joi.boolean(),
          adresse: Joi.object({
            numero: Joi.number(),
            voie: Joi.string(),
            complement: Joi.string(),
            label: Joi.string(),
            codePostal: Joi.string(),
            commune: Joi.string(),
          }),
        }),
      }).validateAsync(body, { abortEarly: false });

      // TODO HAS RIGHTS

      const result = await Cerfa.findOneAndUpdate({ _id: params.id }, body, {
        new: true,
      });

      return res.json(result);
    })
  );

  router.put(
    "/:id/publish",
    tryCatch(async ({ params }, res) => {
      // TODO HAS RIGHTS

      await cerfas.publishCerfa(params.id);

      return res.json({ publish: true });
    })
  );

  router.put(
    "/:id/unpublish",
    tryCatch(async ({ params }, res) => {
      // TODO HAS RIGHTS
      await cerfas.unpublishCerfa(params.id);

      return res.json({ publish: false });
    })
  );

  router.delete(
    "/:id",
    tryCatch(async ({ params }, res) => {
      // TODO HAS RIGHTS
      const result = await cerfas.removeCerfa(params.id);
      return res.json(result);
    })
  );

  return router;
};
