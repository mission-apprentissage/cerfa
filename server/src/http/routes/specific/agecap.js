const express = require("express");
const Joi = require("joi");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const permissionsDossierMiddleware = require("../../middlewares/permissionsDossierMiddleware");
const ApiAgecap = require("../../../common/apis/ApiAgecap");
const cryptoLib = require("crypto");

module.exports = (components) => {
  const router = express.Router();
  const { crypto, agecap } = components;

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

  router.post(
    "/verifNumeroContratPrecedent",
    permissionsDossierMiddleware(components, ["dossier/page_formulaire"]),
    tryCatch(async ({ body }, res) => {
      const { numeroContratPrecedent, employeurSiret } = await Joi.object({
        numeroContratPrecedent: Joi.string().required(),
        employeurSiret: Joi.string().required(),
        // dossierId: Joi.string().required(),
      })
        .unknown()
        .validateAsync(body, { abortEarly: false });

      let fakeContratAgecap = {
        employeur: {
          denomination: "Bordeaux MAIRIE",
          typeEmployeur: 22,
          employeurSpecifique: 0,
          siret: employeurSiret,
          naf: "8411Z",
          nombreDeSalaries: 5000,
          caisseComplementaire: "NA",
          regimeSpecifique: false,
          codeIdcc: "9999",
          libelleIdcc: "___Sans convention collective___",
          telephone: "0123344455",
          courriel: "ffrfr@fr.fr",
          adresse: {
            voie: "PL PEY BERLAND",
            complement: "",
            codePostal: "33000",
            commune: "Bordeaux",
          },
          attestationPieces: true,
          attestationEligibilite: true,
        },
        alternant: {
          nom: "Hanry",
          prenom: "Pabloe",
          sexe: 1,
          nationalite: 1,
          dateNaissance: "2004-01-09",
          departementNaissance: "095",
          communeNaissance: "NANTES",
          regimeSocial: 1,
          sportifEntraineurArbitreJugeHautNiveau: false,
          handicap: false,
          situationAvantContrat: 3,
          diplome: 72,
          derniereClasse: "22",
          diplomePrepare: 72,
          intituleDiplomePrepare:
            "Bla ssurev tirree deiploamtn de 2003 genial meilleur de france c' est super genail lorem ",
          apprentiMineurNonEmancipe: false,
          telephone: "0224353535",
          courriel: "pablo@hanry.fr",
          adresse: {
            voie: "rue de paris",
            complement: null,
            codePostal: "75007",
            commune: "Paris 7e Arrondissement",
            pays: "FR",
          },
        },
        maitre1: {
          nom: "ddd",
          prenom: "sdsdsds",
          dateNaissance: "1999-12-31",
        },
        detailsContrat: {
          modeContractuel: 1,
          typeContratApp: 32,
          numeroContratPrecedent: numeroContratPrecedent,
          noContrat: numeroContratPrecedent,
          dateDebutContrat: "2022-01-12",
          dateEffetAvenant: "2022-01-13",
          dateConclusion: "2022-01-24",
          dateFinContrat: "2022-08-27",
          typeDerogation: 99,
          dureeTravailHebdoHeures: 35,
          dureeTravailHebdoMinutes: 0,
          travailRisque: false,
          salaireEmbauche: 689.34,
          autreAvantageEnNature: false,
          remunerationsAnnuellesStructurees: {
            annee1Periode1: {
              dateDebut: "2022-01-12",
              dateFin: "2022-08-27",
              taux: 43,
              typeSalaire: "SMIC",
            },
          },
          lieuSignatureContrat: "Paris",
          numeroEnregistrementContrat: null,
          infoTransmission: {
            organismeDREETS: 75,
            organismeDDETS: "33",
            nomContact: "Admin",
            prenomContact: "test",
            courrielContact: "antoine.bigard+testAdmin@beta.gouv.fr",
            pj: [],
          },
        },
        formation: {
          rncp: "RNCP15516",
          codeDiplome: "32322111",
          typeDiplome: 71,
          intituleQualification: "Analyses agricoles biologiques et biotechnologiques",
          dateDebutFormation: "2022-01-06",
          dateFinFormation: "2022-08-28",
          dureeFormation: 300,
        },
        organismeFormation: {
          denomination: "MIDISUP",
          formationInterne: false,
          siret: "49917930700024",
          uaiCfa: "0312755B",
          adresse: {
            numero: 118,
            voie: "RTE DE NARBONNE",
            complement: "INPT BAT INTER UNIVERSITAIRE",
            codePostal: "31400",
            commune: "Toulouse",
          },
        },
        etablissementFormation: {
          denomination: "MIDISUP",
          adresse: {
            voie: "RTE DE NARBONNE",
            codePostal: "31400",
            commune: "Toulouse",
          },
        },
      };

      const apiAgecap = new ApiAgecap(crypto);
      await apiAgecap.authenticate();

      const checkNumContrat = async (fakeContratAgecap) => {
        const fakeId = cryptoLib.randomBytes(12).toString("hex");
        fakeContratAgecap.detailsContrat.numeroEnregistrementContrat = fakeId;

        try {
          await apiAgecap.sendContrat(fakeContratAgecap);
          return "ok";
        } catch (error) {
          console.log(error.reason.globalErrors, error.reason.objectFieldErrors);
          const globErrors = error.reason && error.reason.globalErrors.length ? error.reason.globalErrors[0] : null;
          if (globErrors && globErrors !== "Le numéro de télétransmission du contrat doit être unique.") {
            return globErrors;
          }
        }
        return await checkNumContrat(fakeContratAgecap);
      };

      let message = await checkNumContrat(fakeContratAgecap);

      return res.json({ message });
    })
  );

  return router;
};
