const express = require("express");
const Joi = require("joi");
const Boom = require("boom");
const { cloneDeep, mergeWith, find } = require("lodash");
const merge = require("deepmerge");
const { Cerfa } = require("../../../common/model/index");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const permissionsDossierMiddleware = require("../../middlewares/permissionsDossierMiddleware");
const cerfaSchema = require("../../../common/model/schema/specific/dossier/cerfa/Cerfa");
const pdfCerfaController = require("../../../logic/controllers/pdfCerfa/pdfCerfaController");
const { getFromStorage } = require("../../../common/utils/ovhUtils");
const { oleoduc, writeData } = require("oleoduc");
const { PassThrough } = require("stream");

module.exports = (components) => {
  const router = express.Router();

  const { cerfas, dossiers, crypto } = components;

  const buildCerfaResult = (cerfa) => {
    function customizer(objValue, srcValue) {
      if (objValue !== undefined) {
        return {
          ...objValue,
          value:
            srcValue || srcValue === false || srcValue === 0 ? srcValue : typeof objValue.type === "object" ? null : "",
        };
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
        ...mergeWith(
          mergeWith(cloneDeep(cerfaSchema.apprenti), cerfa.apprenti, customizer),
          cerfa.isLockedField.apprenti,
          customizerLock
        ),
        adresse: {
          ...mergeWith(
            mergeWith(cloneDeep(cerfaSchema.apprenti.adresse), cerfa.apprenti.adresse, customizer),
            cerfa.isLockedField.apprenti.adresse,
            customizerLock
          ),
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
        ...mergeWith(
          mergeWith(cloneDeep(cerfaSchema.maitre1), cerfa.maitre1, customizer),
          cerfa.isLockedField.maitre1,
          customizerLock
        ),
      },
      maitre2: {
        ...mergeWith(
          mergeWith(cloneDeep(cerfaSchema.maitre2), cerfa.maitre2, customizer),
          cerfa.isLockedField.maitre2,
          customizerLock
        ),
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
      draft: cerfa.draft,
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
          nombreDeSalaries: Joi.number().allow(null),
          codeIdcc: Joi.string().allow(""),
          libelleIdcc: Joi.string().allow(""),
          telephone: Joi.string().allow(null),
          courriel: Joi.string(),
          adresse: Joi.object({
            numero: Joi.number().allow(null),
            voie: Joi.string().allow(""),
            complement: Joi.string().allow(""),
            label: Joi.string().allow(""),
            codePostal: Joi.string().allow(""),
            commune: Joi.string().allow(""),
            departement: Joi.string().allow(""),
            region: Joi.string().allow(""),
          }),
          nom: Joi.string(),
          prenom: Joi.string(),
          typeEmployeur: Joi.number(),
          employeurSpecifique: Joi.number(),
          caisseComplementaire: Joi.string().allow(""),
          regimeSpecifique: Joi.boolean(),
          attestationEligibilite: Joi.boolean().allow(null),
          attestationPieces: Joi.boolean().allow(null),
          privePublic: Joi.boolean(),
        }),
        apprenti: Joi.object({
          nom: Joi.string(),
          prenom: Joi.string(),
          sexe: Joi.string(),
          nationalite: Joi.number(),
          dateNaissance: Joi.date(),
          age: Joi.number().allow(null),
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
          telephone: Joi.string().allow(null),
          courriel: Joi.string(),
          adresse: Joi.object({
            numero: Joi.number().allow(null),
            voie: Joi.string(),
            complement: Joi.string().allow(""),
            label: Joi.string(),
            codePostal: Joi.string(),
            commune: Joi.string(),
            pays: Joi.string(),
          }),
          apprentiMineurNonEmancipe: Joi.boolean().allow(null),
          responsableLegal: Joi.object({
            nom: Joi.string().allow(null),
            prenom: Joi.string().allow(null),
            memeAdresse: Joi.boolean().allow(null),
            adresse: Joi.object({
              numero: Joi.number().allow(null),
              voie: Joi.string().allow(null),
              complement: Joi.string().allow(null).allow(""),
              label: Joi.string().allow(null),
              codePostal: Joi.string().allow(null),
              commune: Joi.string().allow(null),
              pays: Joi.string().allow(null),
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
          nom: Joi.string().allow(null),
          prenom: Joi.string().allow(null),
          dateNaissance: Joi.date().allow(null),
        }),
        formation: Joi.object({
          rncp: Joi.string().allow(null),
          codeDiplome: Joi.string().allow(null),
          typeDiplome: Joi.number(),
          intituleQualification: Joi.string(),
          dateDebutFormation: Joi.date(),
          dateFinFormation: Joi.date(),
          dureeFormationCalc: Joi.number(),
          dureeFormation: Joi.number().allow(null),
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
          typeDerogation: Joi.number().allow(null),
          dureeTravailHebdoHeures: Joi.number(),
          dureeTravailHebdoMinutes: Joi.number().allow(null),
          travailRisque: Joi.boolean(),
          salaireEmbauche: Joi.number(),
          caisseRetraiteComplementaire: Joi.string().allow(""),
          avantageNature: Joi.boolean(),
          avantageNourriture: Joi.number().allow(null),
          avantageLogement: Joi.number().allow(null),
          autreAvantageEnNature: Joi.boolean().allow(null),
          remunerationMajoration: Joi.number(),
          smic: Joi.object({}).unknown(),
          remunerationsAnnuelles: Joi.array().items({
            dateDebut: Joi.date(),
            dateFin: Joi.date(),
            taux: Joi.number(),
            tauxMinimal: Joi.number(),
            salaireBrut: Joi.number(),
            typeSalaire: Joi.string(),
            ordre: Joi.string(),
          }),
        }),
        organismeFormation: Joi.object({
          denomination: Joi.string().allow(""),
          formationInterne: Joi.boolean(),
          siret: Joi.string(),
          uaiCfa: Joi.string().allow(null),
          visaCfa: Joi.boolean(),
          adresse: Joi.object({
            numero: Joi.number().allow(null),
            voie: Joi.string().allow(""),
            complement: Joi.string().allow(""),
            label: Joi.string().allow(""),
            codePostal: Joi.string().allow(""),
            commune: Joi.string().allow(""),
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
    tryCatch(async ({ params, query }, res) => {
      let { dossierId } = await Joi.object({
        dossierId: Joi.string().required(),
      }).validateAsync(query, { abortEarly: false });

      let pdfBuffer = null;
      const documents = await dossiers.getDocuments(dossierId);
      const contratDocument = find(documents, { typeDocument: "CONTRAT" });
      if (contratDocument) {
        const _buf = [];
        await oleoduc(
          await getFromStorage(contratDocument.cheminFichier),
          crypto.isCipherAvailable() ? crypto.decipher(dossierId) : new PassThrough(),
          writeData((chunk) => _buf.push(chunk))
        );
        pdfBuffer = Buffer.concat(_buf);
      } else {
        const cerfa = await Cerfa.findOne({ _id: params.id }).lean();
        if (!cerfa) {
          throw Boom.notFound("Doesn't exist");
        }
        const pdfBytes = await pdfCerfaController.createPdfCerfa(cerfa);

        pdfBuffer = Buffer.from(pdfBytes.buffer, "binary");
      }

      res.header("Content-Type", "application/pdf");
      res.header("Content-Length", pdfBuffer.length);
      res.status(200);
      res.type("pdf");

      res.send(pdfBuffer);
    })
  );

  router.post(
    "/pdf/:id",
    permissionsDossierMiddleware(components, ["dossier/voir_contrat_pdf"]),
    // eslint-disable-next-line no-unused-vars
    tryCatch(async ({ params, body }, res) => {
      // let { dossierId } = await Joi.object({
      //   dossierId: Joi.string().required(),
      // }).validateAsync(body, { abortEarly: false });

      let finalBuffer = null;
      // const documents = await dossiers.getDocuments(dossierId);
      // const contratDocument = find(documents, { typeDocument: "CONTRAT" });
      // if (contratDocument) {
      //   const _buf = [];
      //   await oleoduc(
      //     await getFromStorage(contratDocument.cheminFichier),
      //     crypto.isCipherAvailable() ? crypto.decipher(dossierId) : new PassThrough(),
      //     writeData((chunk) => _buf.push(chunk))
      //   );
      //   finalBuffer = Buffer.concat(_buf);
      // } else {
      const cerfa = await Cerfa.findOne({ _id: params.id }).lean();
      if (!cerfa) {
        throw Boom.notFound("Doesn't exist");
      }

      const pdfBytes = await pdfCerfaController.createPdfCerfa(cerfa);

      finalBuffer = Buffer.from(pdfBytes);
      // }
      res.json({ pdfBase64: finalBuffer.toString("base64") });
    })
  );

  return router;
};
