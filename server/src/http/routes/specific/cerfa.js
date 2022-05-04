const express = require("express");
const Joi = require("joi");
const Boom = require("boom");
const { cloneDeep, mergeWith, find } = require("lodash");
const merge = require("deepmerge");
const { Cerfa, CerfaHistory } = require("../../../common/model/index");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const permissionsDossierMiddleware = require("../../middlewares/permissionsDossierMiddleware");
const cerfaSchema = require("../../../common/model/schema/specific/dossier/cerfa/Cerfa");
const pdfCerfaController = require("../../../logic/controllers/pdfCerfa/pdfCerfaController");
const { getFromStorage } = require("../../../common/utils/ovhUtils");
const { oleoduc, writeData } = require("oleoduc");
const { PassThrough } = require("stream");
const { get } = require("lodash/object");

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
      etablissementFormation: {
        ...mergeWith(
          mergeWith(cloneDeep(cerfaSchema.etablissementFormation), cerfa.etablissementFormation, customizer),
          cerfa.isLockedField.etablissementFormation,
          customizerLock
        ),
        adresse: {
          ...mergeWith(
            mergeWith(
              cloneDeep(cerfaSchema.etablissementFormation.adresse),
              cerfa.etablissementFormation.adresse,
              customizer
            ),
            cerfa.isLockedField.etablissementFormation.adresse,
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
    tryCatch(async ({ body, params, user }, res) => {
      const data = await Joi.object({
        employeur: Joi.object({
          denomination: Joi.string().allow(null),
          siret: Joi.string().allow(null),
          naf: Joi.string().allow(null),
          nombreDeSalaries: Joi.number().allow(null),
          codeIdcc: Joi.string().allow(null),
          libelleIdcc: Joi.string().allow(null),
          telephone: Joi.string().allow(null),
          courriel: Joi.string().allow(null),
          adresse: Joi.object({
            numero: Joi.number().allow(null),
            repetitionVoie: Joi.string().allow(null),
            voie: Joi.string().allow(null),
            complement: Joi.string().allow(null),
            label: Joi.string().allow(null),
            codePostal: Joi.string().allow(null),
            commune: Joi.string().allow(null),
            departement: Joi.string().allow(null),
            region: Joi.number().allow(null),
          }),
          nom: Joi.string().allow(null),
          prenom: Joi.string().allow(null),
          typeEmployeur: Joi.number().allow(null),
          employeurSpecifique: Joi.number().allow(null),
          caisseComplementaire: Joi.string().allow(null),
          regimeSpecifique: Joi.boolean().allow(null),
          attestationEligibilite: Joi.boolean().allow(null),
          attestationPieces: Joi.boolean().allow(null),
          privePublic: Joi.boolean().allow(null),
        }),
        apprenti: Joi.object({
          nom: Joi.string().allow(null),
          prenom: Joi.string().allow(null),
          sexe: Joi.string().allow(null),
          nationalite: Joi.number().allow(null),
          dateNaissance: Joi.date().allow(null),
          age: Joi.number().allow(null),
          departementNaissance: Joi.string().allow(null),
          communeNaissance: Joi.string().allow(null),
          nir: Joi.string().allow(null),
          regimeSocial: Joi.number().allow(null),
          handicap: Joi.boolean().allow(null),
          situationAvantContrat: Joi.number().allow(null),
          diplome: Joi.number().allow(null),
          derniereClasse: Joi.number().allow(null),
          diplomePrepare: Joi.number().allow(null),
          intituleDiplomePrepare: Joi.string().allow(null),
          telephone: Joi.string().allow(null),
          courriel: Joi.string().allow(null),
          adresse: Joi.object({
            numero: Joi.number().allow(null),
            repetitionVoie: Joi.string().allow(null),
            voie: Joi.string().allow(null),
            complement: Joi.string().allow(null),
            label: Joi.string().allow(null),
            codePostal: Joi.string().allow(null),
            commune: Joi.string().allow(null),
            pays: Joi.string().allow(null),
          }),
          apprentiMineur: Joi.boolean().allow(null),
          apprentiMineurNonEmancipe: Joi.boolean().allow(null),
          responsableLegal: Joi.object({
            nom: Joi.string().allow(null),
            prenom: Joi.string().allow(null),
            memeAdresse: Joi.boolean().allow(null),
            adresse: Joi.object({
              numero: Joi.number().allow(null),
              repetitionVoie: Joi.string().allow(null),
              voie: Joi.string().allow(null),
              complement: Joi.string().allow(null).allow(null),
              label: Joi.string().allow(null),
              codePostal: Joi.string().allow(null),
              commune: Joi.string().allow(null),
              pays: Joi.string().allow(null),
            }),
          }),
          inscriptionSportifDeHautNiveau: Joi.boolean().allow(null),
        }),
        maitre1: Joi.object({
          nom: Joi.string().allow(null),
          prenom: Joi.string().allow(null),
          dateNaissance: Joi.date().allow(null),
        }),
        maitre2: Joi.object({
          nom: Joi.string().allow(null),
          prenom: Joi.string().allow(null),
          dateNaissance: Joi.date().allow(null),
        }),
        formation: Joi.object({
          rncp: Joi.string().allow(null),
          codeDiplome: Joi.string().allow(null),
          typeDiplome: Joi.number().allow(null),
          intituleQualification: Joi.string().allow(null),
          dateDebutFormation: Joi.date().allow(null),
          dateFinFormation: Joi.date().allow(null),
          dureeFormationCalc: Joi.number().allow(null),
          dureeFormation: Joi.number().allow(null),
          dateObtentionDiplome: Joi.date().allow(null),
        }),
        contrat: Joi.object({
          modeContractuel: Joi.number().allow(null),
          typeContratApp: Joi.number().allow(null),
          numeroContratPrecedent: Joi.string().allow(null),
          noContrat: Joi.string().allow(null),
          noAvenant: Joi.string().allow(null),
          dateDebutContrat: Joi.date().allow(null),
          dateFinContrat: Joi.date().allow(null),
          dureeContrat: Joi.number().allow(null),
          dateEffetAvenant: Joi.date().allow(null),
          dateConclusion: Joi.date().allow(null),
          dateRupture: Joi.date().allow(null),
          lieuSignatureContrat: Joi.string().allow(null),
          typeDerogation: Joi.number().allow(null),
          dureeTravailHebdoHeures: Joi.number().allow(null),
          dureeTravailHebdoMinutes: Joi.number().allow(null),
          travailRisque: Joi.boolean().allow(null),
          salaireEmbauche: Joi.number().allow(null),
          caisseRetraiteComplementaire: Joi.string().allow("").allow(null),
          avantageNature: Joi.boolean().allow(null),
          avantageNourriture: Joi.number().allow(null),
          avantageLogement: Joi.number().allow(null),
          autreAvantageEnNature: Joi.boolean().allow(null),
          remunerationMajoration: Joi.number().allow(null),
          smic: Joi.object({}).unknown().allow(null),
          remunerationsAnnuelles: Joi.array().items({
            dateDebut: Joi.date().required(),
            dateFin: Joi.date().required(),
            taux: Joi.number().required(),
            tauxMinimal: Joi.number().required(),
            salaireBrut: Joi.number().required(),
            typeSalaire: Joi.string().required(),
            ordre: Joi.string().required(),
          }),
        }),
        organismeFormation: Joi.object({
          denomination: Joi.string().allow("").allow(null),
          formationInterne: Joi.boolean().allow(null),
          siret: Joi.string().allow(null),
          uaiCfa: Joi.string().allow(null),
          visaCfa: Joi.boolean().allow(null),
          adresse: Joi.object({
            numero: Joi.number().allow(null),
            repetitionVoie: Joi.string().allow(null),
            voie: Joi.string().allow("").allow(null),
            complement: Joi.string().allow("").allow(null),
            label: Joi.string().allow("").allow(null),
            codePostal: Joi.string().allow("").allow(null),
            commune: Joi.string().allow("").allow(null),
          }),
        }),
        etablissementFormation: Joi.object({
          memeResponsable: Joi.boolean().allow(null),
          denomination: Joi.string().allow("").allow(null),
          siret: Joi.string().allow("").allow(null),
          uaiCfa: Joi.string().allow(null),
          adresse: Joi.object({
            numero: Joi.number().allow(null),
            repetitionVoie: Joi.string().allow(null),
            voie: Joi.string().allow("").allow(null),
            complement: Joi.string().allow("").allow(null),
            label: Joi.string().allow("").allow(null),
            codePostal: Joi.string().allow("").allow(null),
            commune: Joi.string().allow("").allow(null),
          }),
        }),
        isLockedField: Joi.object({}).unknown(),
        dossierId: Joi.string().required(),
        inputNames: Joi.array().items(Joi.string()).required(),
      }).validateAsync(body, { abortEarly: false });

      let cerfaDb = await Cerfa.findOne({ _id: params.id }, { _id: 0, __v: 0 }).lean();

      if (!cerfaDb.draft) {
        throw Boom.forbidden("Cerfa is locked");
      }

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

      let cerfaHistory = await CerfaHistory.findOne({ cerfaHistory: params.id });
      if (!cerfaHistory) {
        cerfaHistory = await CerfaHistory.create({
          cerfaId: params.id,
          history: {},
        });
      }

      await CerfaHistory.findOneAndUpdate(
        { _id: cerfaHistory._id },
        {
          $set: data.inputNames.reduce(
            (acc, inputName) => ({
              ...acc,
              [`history.${inputName}`]: [
                ...(get(cerfaHistory, `history.${inputName}`) ?? []),
                {
                  from: get(cerfaDb, inputName),
                  to: get(data, inputName),
                  when: new Date(),
                  who: user.username,
                },
              ],
            }),
            {}
          ),
        }
      );

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
