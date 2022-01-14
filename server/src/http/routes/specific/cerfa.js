const express = require("express");
const Joi = require("joi");
const Boom = require("boom");
const {
  cloneDeep,
  mergeWith,
  // set
} = require("lodash");
const merge = require("deepmerge");
const { Cerfa } = require("../../../common/model/index");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const permissionsDossierMiddleware = require("../../middlewares/permissionsDossierMiddleware");
const cerfaSchema = require("../../../common/model/schema/specific/dossier/cerfa/Cerfa");
const pdfCerfaController = require("../../../logic/controllers/pdfCerfa/pdfCerfaController");

// const checkRequiredField = (cerfa) => {
//   let result = {};
//   const validationObj = new Cerfa(cerfa);
//   const validatedModel = validationObj.validateSync();
//   if (validatedModel) {
//     const keys = Object.keys(validatedModel.errors);
//     for (let i = 0; i < keys.length; i++) {
//       const err = validatedModel.errors[keys[i]];
//       if (err.kind === "required") {
//         set(result, `${err.path}.isNotRequiredForm`, false);
//       }
//     }
//   }
//   return result;
// };

module.exports = (components) => {
  const router = express.Router();

  const { cerfas } = components;

  const buildCerfaResult = (cerfa) => {
    function customizer(objValue, srcValue) {
      if (objValue !== undefined) {
        return { ...objValue, value: srcValue || srcValue === false || srcValue === 0 ? srcValue : "" };
      }
    }

    function customizerLock(objValue, srcValue) {
      if (objValue !== undefined) {
        return { ...objValue, locked: srcValue };
      }
    }

    return {
      employeur: {
        ...mergeWith(
          mergeWith(cloneDeep(cerfaSchema.employeur), cerfa.employeur, customizer),
          cerfa.isLockedField.employeur,
          customizerLock
        ),
        adresse: {
          ...mergeWith(
            mergeWith(cloneDeep(cerfaSchema.employeur.adresse), cerfa.employeur.adresse, customizer),
            cerfa.isLockedField.employeur.adresse,
            customizerLock
          ),
        },
      },
      apprenti: {
        ...mergeWith(cloneDeep(cerfaSchema.apprenti), cerfa.apprenti, customizer),
        adresse: {
          ...mergeWith(cloneDeep(cerfaSchema.apprenti.adresse), cerfa.apprenti.adresse, customizer),
        },
        responsableLegal: {
          ...mergeWith(
            cloneDeep(cerfaSchema.apprenti.responsableLegal.type),
            cerfa.apprenti.responsableLegal,
            customizer
          ),
          adresse: {
            ...mergeWith(
              cloneDeep(cerfaSchema.apprenti.responsableLegal.type.adresse),
              cerfa.apprenti.responsableLegal.adresse,
              customizer
            ),
          },
        },
      },
      maitre1: {
        ...mergeWith(cloneDeep(cerfaSchema.maitre1), cerfa.maitre1, customizer),
      },
      maitre2: {
        ...mergeWith(cloneDeep(cerfaSchema.maitre2), cerfa.maitre2, customizer),
      },
      formation: {
        ...mergeWith(
          mergeWith(cloneDeep(cerfaSchema.formation), cerfa.formation, customizer),
          cerfa.isLockedField.formation,
          customizerLock
        ),
      },
      contrat: {
        ...mergeWith(
          mergeWith(cloneDeep(cerfaSchema.contrat), cerfa.contrat, customizer),
          cerfa.isLockedField.contrat,
          customizerLock
        ),
        remunerationsAnnuelles: [
          ...cerfa.contrat.remunerationsAnnuelles.map((remunerationAnnuelle) => {
            return mergeWith(
              cloneDeep(cerfaSchema.contrat.remunerationsAnnuelles.type[0]),
              remunerationAnnuelle,
              customizer
            );
          }),
        ],
      },
      organismeFormation: {
        ...mergeWith(
          mergeWith(cloneDeep(cerfaSchema.organismeFormation), cerfa.organismeFormation, customizer),
          cerfa.isLockedField.organismeFormation,
          customizerLock
        ),
        adresse: {
          ...mergeWith(
            mergeWith(cloneDeep(cerfaSchema.organismeFormation.adresse), cerfa.organismeFormation.adresse, customizer),
            cerfa.isLockedField.organismeFormation.adresse,
            customizerLock
          ),
        },
      },
      id: cerfa._id.toString(),
    };
  };

  router.get(
    "/",
    permissionsDossierMiddleware(components, ["dossier/page_formulaire"]),
    tryCatch(async (req, res) => {
      let { dossierId } = await Joi.object({
        dossierId: Joi.string().required(),
      })
        .unknown()
        .validateAsync(req.query, { abortEarly: false });

      const cerfa = await Cerfa.findOne({ dossierId }).lean();

      return res.json(buildCerfaResult(cerfa));
    })
  );

  router.get(
    "/:id",
    permissionsDossierMiddleware(components, ["dossier/page_formulaire"]),
    tryCatch(async ({ params }, res) => {
      const cerfa = await Cerfa.findById(params.id);
      if (!cerfa) {
        throw Boom.notFound("Doesn't exist");
      }

      res.json(cerfa);
    })
  );

  router.post(
    "/",
    permissionsDossierMiddleware(components, ["dossier/page_formulaire"]),
    tryCatch(async ({ body }, res) => {
      const result = await cerfas.createCerfa(body);

      return res.json(result);
    })
  );

  router.put(
    "/:id",
    permissionsDossierMiddleware(components, ["dossier/sauvegarder"]),
    tryCatch(async ({ body, params }, res) => {
      const data = await Joi.object({
        employeur: Joi.object({
          denomination: Joi.string().allow(""),
          siret: Joi.string(),
          naf: Joi.string().allow(""),
          nombreDeSalaries: Joi.number(),
          codeIdcc: Joi.string().allow(""),
          libelleIdcc: Joi.string().allow(""),
          telephone: Joi.string(),
          courriel: Joi.string(),
          adresse: Joi.object({
            numero: Joi.number().allow(""),
            voie: Joi.string().allow(""),
            complement: Joi.string().allow(""),
            label: Joi.string().allow(""),
            codePostal: Joi.string().allow(""),
            commune: Joi.string().allow(""),
          }),
          nom: Joi.string(),
          prenom: Joi.string(),
          typeEmployeur: Joi.number(),
          employeurSpecifique: Joi.number(),
          caisseComplementaire: Joi.string().allow(""),
          regimeSpecifique: Joi.boolean(),
          attestationEligibilite: Joi.boolean().allow(null),
          attestationPieces: Joi.boolean(),
          privePublic: Joi.boolean(),
        }),
        apprenti: Joi.object({
          nom: Joi.string(),
          prenom: Joi.string(),
          sexe: Joi.string(),
          nationalite: Joi.number(),
          dateNaissance: Joi.date(),
          age: Joi.number(),
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
            numero: Joi.number().allow(""),
            voie: Joi.string(),
            complement: Joi.string().allow(""),
            label: Joi.string(),
            codePostal: Joi.string(),
            commune: Joi.string(),
          }),
          apprentiMineurNonEmancipe: Joi.boolean(),
          responsableLegal: Joi.object({
            nom: Joi.string(),
            prenom: Joi.string(),
            memeAdresse: Joi.boolean(),
            adresse: Joi.object({
              numero: Joi.number().allow(""),
              voie: Joi.string().allow(null),
              complement: Joi.string().allow(""),
              label: Joi.string().allow(null),
              codePostal: Joi.string().allow(null),
              commune: Joi.string().allow(null),
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
          dureeFormationCalc: Joi.number(),
          dureeFormation: Joi.number(),
          dateObtentionDiplome: Joi.date(),
        }),
        contrat: Joi.object({
          modeContractuel: Joi.number(),
          typeContratApp: Joi.number(),
          numeroContratPrecedent: Joi.string().allow(null),
          noContrat: Joi.string(),
          noAvenant: Joi.string(),
          dateDebutContrat: Joi.date(),
          dateFinContrat: Joi.date(),
          dureeContrat: Joi.number(),
          dateEffetAvenant: Joi.date().allow(null),
          dateConclusion: Joi.date(),
          dateRupture: Joi.date(),
          lieuSignatureContrat: Joi.string(),
          typeDerogation: Joi.number(),
          dureeTravailHebdoHeures: Joi.number(),
          dureeTravailHebdoMinutes: Joi.number(),
          travailRisque: Joi.boolean(),
          salaireEmbauche: Joi.number(),
          caisseRetraiteComplementaire: Joi.string().allow(""),
          avantageNature: Joi.boolean(),
          avantageNourriture: Joi.number().allow(null),
          avantageLogement: Joi.number().allow(null),
          autreAvantageEnNature: Joi.boolean().allow(null),
          remunerationMajoration: Joi.number(),
          remunerationsAnnuelles: Joi.array().items({
            dateDebut: Joi.date(),
            dateFin: Joi.date(),
            taux: Joi.number(),
            salaireBrut: Joi.number(),
            typeSalaire: Joi.string(),
            ordre: Joi.string(),
          }),
        }),
        organismeFormation: Joi.object({
          denomination: Joi.string(),
          formationInterne: Joi.boolean(),
          siret: Joi.string(),
          uaiCfa: Joi.string().allow(null),
          visaCfa: Joi.boolean(),
          adresse: Joi.object({
            numero: Joi.number().allow(""),
            voie: Joi.string(),
            complement: Joi.string().allow(""),
            label: Joi.string(),
            codePostal: Joi.string(),
            commune: Joi.string(),
          }),
        }),
        isLockedField: Joi.object({}).unknown(),
        dossierId: Joi.string().required(),
      }).validateAsync(body, { abortEarly: false });

      let cerfaDb = await Cerfa.findOne({ _id: params.id }, { _id: 0, __v: 0 }).lean();

      let remunerationsAnnuelles = [...(data.contrat?.remunerationsAnnuelles || [])];
      for (let i = 0; i < cerfaDb.contrat.remunerationsAnnuelles.length; i++) {
        const remunerationsAnnuelleDb = cerfaDb.contrat.remunerationsAnnuelles[i];
        for (let j = 0; j < remunerationsAnnuelles.length; j++) {
          let remAnnuelle = remunerationsAnnuelles[j];
          if (remunerationsAnnuelleDb.ordre === remunerationsAnnuelleDb.ordre) {
            remAnnuelle = {
              ...remunerationsAnnuelleDb,
              ...remAnnuelle,
            };
          }
        }
      }
      let mergedData = merge(cerfaDb, data);
      mergedData.contrat.remunerationsAnnuelles =
        cerfaDb.contrat.remunerationsAnnuelles.length > 0 && remunerationsAnnuelles.length === 0
          ? cerfaDb.contrat.remunerationsAnnuelles
          : remunerationsAnnuelles;

      const cerfaUpdated = await Cerfa.findOneAndUpdate({ _id: params.id }, mergedData, {
        new: true,
      }).lean();

      return res.json(buildCerfaResult(cerfaUpdated));
    })
  );

  router.put(
    "/:id/publish",
    permissionsDossierMiddleware(components, ["dossier/publication"]),
    tryCatch(async ({ params }, res) => {
      await cerfas.publishCerfa(params.id);
      return res.json({ publish: true });
    })
  );

  router.put(
    "/:id/unpublish",
    permissionsDossierMiddleware(components, ["dossier/publication"]),
    tryCatch(async ({ params }, res) => {
      await cerfas.unpublishCerfa(params.id);
      return res.json({ publish: false });
    })
  );

  router.delete(
    "/:id",
    permissionsDossierMiddleware(components, ["dossier/supprimer"]),
    tryCatch(async ({ params }, res) => {
      const result = await cerfas.removeCerfa(params.id);
      return res.json(result);
    })
  );

  router.get(
    "/pdf/:id",
    permissionsDossierMiddleware(components, ["dossier/voir_contrat_pdf/telecharger"]),
    tryCatch(async ({ params }, res) => {
      const cerfa = await Cerfa.findOne({ _id: params.id }).lean();

      if (!cerfa) {
        throw Boom.notFound("Doesn't exist");
      }

      const pdfBytes = await pdfCerfaController.createPdfCerfa(cerfa);

      const pdfBuffer = Buffer.from(pdfBytes.buffer, "binary");
      res.header("Content-Type", "application/pdf");
      // res.header("Content-Disposition", `attachment; filename=contrat_${params.id}.pdf`);
      res.header("Content-Length", pdfBuffer.length);
      res.status(200);
      res.type("pdf");

      res.send(pdfBuffer);
    })
  );

  router.post(
    "/pdf/:id",
    permissionsDossierMiddleware(components, ["dossier/voir_contrat_pdf"]),
    tryCatch(async ({ params }, res) => {
      const cerfa = await Cerfa.findOne({ _id: params.id }).lean();

      if (!cerfa) {
        throw Boom.notFound("Doesn't exist");
      }

      const pdfBytes = await pdfCerfaController.createPdfCerfa(cerfa);

      res.json({ pdfBase64: Buffer.from(pdfBytes).toString("base64") });
    })
  );

  return router;
};
