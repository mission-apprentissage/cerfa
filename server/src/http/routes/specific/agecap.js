const express = require("express");
const Joi = require("joi");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const permissionsDossierMiddleware = require("../../middlewares/permissionsDossierMiddleware");
const { asyncForEach } = require("../../../common/utils/asyncUtils");
const ApiAgecap = require("../../../common/apis/ApiAgecap");
const { find, pick } = require("lodash");
const Boom = require("boom");
const { DateTime } = require("luxon");
const idccEnum = require("../../../common/model/schema/specific/dossier/cerfa/parts/idcc.part");
const cryptoLib = require("crypto");

module.exports = (components) => {
  const router = express.Router();
  const { dossiers, cerfas, crypto } = components;

  const convertDate = (value) =>
    value
      ? DateTime.fromMillis(value.valueOf()).setZone("Europe/Paris").setLocale("fr-FR").toFormat("yyyy-MM-dd")
      : undefined;

  router.post(
    "/",
    permissionsDossierMiddleware(components, ["dossier/publication"]), // send_agecap
    tryCatch(async ({ body, user }, res) => {
      const { dossierId } = await Joi.object({
        dossierId: Joi.string().required(),
      }).validateAsync(body, { abortEarly: false });

      console.log("IS HERE");

      const dossier = await dossiers.findDossierById(dossierId);
      const cerfa = await cerfas.findCerfaByDossierId(dossierId);

      const toKeep = ["dateDebut", "dateFin", "taux", "typeSalaire"];

      const convertInside = (remObj) => {
        if (Object.keys(remObj).length === 0) return remObj;
        const { dateDebut, dateFin, taux, typeSalaire } = remObj;
        return {
          dateDebut: convertDate(dateDebut),
          dateFin: convertDate(dateFin),
          taux,
          typeSalaire,
        };
      };
      const annee1Periode1 = convertInside(pick(find(cerfa.contrat.remunerationsAnnuelles, { ordre: "1.1" }), toKeep));
      const annee1Periode2 = convertInside(pick(find(cerfa.contrat.remunerationsAnnuelles, { ordre: "1.2" }), toKeep));
      const annee2Periode1 = convertInside(pick(find(cerfa.contrat.remunerationsAnnuelles, { ordre: "2.1" }), toKeep));
      const annee2Periode2 = convertInside(pick(find(cerfa.contrat.remunerationsAnnuelles, { ordre: "2.2" }), toKeep));
      const annee3Periode1 = convertInside(pick(find(cerfa.contrat.remunerationsAnnuelles, { ordre: "3.1" }), toKeep));
      const annee3Periode2 = convertInside(pick(find(cerfa.contrat.remunerationsAnnuelles, { ordre: "3.2" }), toKeep));
      const annee4Periode1 = convertInside(pick(find(cerfa.contrat.remunerationsAnnuelles, { ordre: "4.1" }), toKeep));
      const annee4Periode2 = convertInside(pick(find(cerfa.contrat.remunerationsAnnuelles, { ordre: "4.2" }), toKeep));

      const remunerationsAnnuellesStructurees = {
        ...(Object.keys(annee1Periode1).length > 0 ? { annee1Periode1 } : {}),
        ...(Object.keys(annee1Periode2).length > 0 ? { annee1Periode2 } : {}),
        ...(Object.keys(annee2Periode1).length > 0 ? { annee2Periode1 } : {}),
        ...(Object.keys(annee2Periode2).length > 0 ? { annee2Periode2 } : {}),
        ...(Object.keys(annee3Periode1).length > 0 ? { annee3Periode1 } : {}),
        ...(Object.keys(annee3Periode2).length > 0 ? { annee3Periode2 } : {}),
        ...(Object.keys(annee4Periode1).length > 0 ? { annee4Periode1 } : {}),
        ...(Object.keys(annee4Periode2).length > 0 ? { annee4Periode2 } : {}),
      };

      const pjs = dossier.documents.map(({ documentId, nomFichier, typeDocument, hash }) => ({
        identifiant: documentId,
        nom: nomFichier,
        format: "PDF", // typeFichier,
        type: typeDocument === "CONVENTION_FORMATION" ? "1" : "2",
        checksum: hash,
      }));

      const libelleIdcc = find(idccEnum, { code: cerfa.employeur.codeIdcc })?.libelle || cerfa.employeur.libelleIdcc;

      const contratAgecap = {
        employeur: {
          denomination: cerfa.employeur.denomination,
          typeEmployeur: cerfa.employeur.typeEmployeur,
          employeurSpecifique: cerfa.employeur.employeurSpecifique,
          siret: cerfa.employeur.siret,
          naf: cerfa.employeur.naf,
          nombreDeSalaries: cerfa.employeur.nombreDeSalaries,
          caisseComplementaire: "NA",
          regimeSpecifique: cerfa.employeur.regimeSpecifique,
          codeIdcc: cerfa.employeur.codeIdcc,
          libelleIdcc: libelleIdcc,
          telephone: cerfa.employeur.telephone.replace("+33", "0"), // TO CONVERT   + => 00
          courriel: cerfa.employeur.courriel,
          adresse: {
            numero: cerfa.employeur.adresse.numero || undefined,
            // repetitionVoie: cerfa.employeur.adresse.
            // typeVoie: cerfa.employeur.adresse.
            voie: cerfa.employeur.adresse.voie,
            complement: cerfa.employeur.adresse.complement, // ""
            codePostal: cerfa.employeur.adresse.codePostal,
            commune: cerfa.employeur.adresse.commune,
          },
          attestationPieces: cerfa.employeur.attestationPieces,
          attestationEligibilite: cerfa.employeur.attestationEligibilite,
        },
        alternant: {
          nom: cerfa.apprenti.nom,
          prenom: cerfa.apprenti.prenom,
          sexe: cerfa.apprenti.sexe === "M" ? 1 : 2,
          nationalite: cerfa.apprenti.nationalite,
          dateNaissance: convertDate(cerfa.apprenti.dateNaissance),
          departementNaissance: cerfa.apprenti.departementNaissance.padStart(3, "0"),
          communeNaissance: cerfa.apprenti.communeNaissance,
          regimeSocial: cerfa.apprenti.regimeSocial,
          sportifEntraineurArbitreJugeHautNiveau: cerfa.apprenti.inscriptionSportifDeHautNiveau,
          handicap: cerfa.apprenti.handicap,
          situationAvantContrat: cerfa.apprenti.situationAvantContrat,
          diplome: cerfa.apprenti.diplome,
          derniereClasse: `${cerfa.apprenti.derniereClasse}`.padStart(2, "0"),
          diplomePrepare: cerfa.apprenti.diplomePrepare,
          intituleDiplomePrepare: cerfa.apprenti.intituleDiplomePrepare,
          apprentiMineurNonEmancipe: cerfa.apprenti.apprentiMineurNonEmancipe,
          telephone: cerfa.apprenti.telephone.replace("+33", "0"), // TO CONVERT   + => 00
          courriel: cerfa.apprenti.courriel,
          adresse: {
            numero: cerfa.apprenti.adresse.numero || undefined,
            // repetitionVoie: cerfa.apprenti.adresse.
            // typeVoie: cerfa.apprenti.adresse.
            voie: cerfa.apprenti.adresse.voie,
            complement: cerfa.apprenti.adresse.complement, // ""
            codePostal: cerfa.apprenti.adresse.codePostal,
            commune: cerfa.apprenti.adresse.commune,
            pays: cerfa.apprenti.adresse.pays,
          },
          ...(cerfa.apprenti.apprentiMineurNonEmancipe
            ? {
                responsableLegal: {
                  nom: cerfa.apprenti.responsableLegal.nom,
                  prenom: cerfa.apprenti.responsableLegal.prenom,
                  adresse: {
                    numero: cerfa.apprenti.responsableLegal.adresse.numero || undefined,
                    // repetitionVoie: cerfa.apprenti.responsableLegal.adresse.
                    // typeVoie: cerfa.apprenti.responsableLegal.adresse.
                    voie: cerfa.apprenti.responsableLegal.adresse.voie,
                    complement: cerfa.apprenti.responsableLegal.adresse.complement, // ""
                    codePostal: cerfa.apprenti.responsableLegal.adresse.codePostal,
                    commune: cerfa.apprenti.responsableLegal.adresse.commune,
                    pays: cerfa.apprenti.responsableLegal.adresse.pays, // TO CHECK
                  },
                },
              }
            : {}),
        },
        maitre1: {
          nom: cerfa.maitre1.nom,
          prenom: cerfa.maitre1.prenom,
          dateNaissance: convertDate(cerfa.maitre1.dateNaissance),
        },
        ...(cerfa.maitre2.nom
          ? {
              maitre2: {
                nom: cerfa.maitre2.nom,
                prenom: cerfa.maitre2.prenom,
                dateNaissance: convertDate(cerfa.maitre2.dateNaissance),
              },
            }
          : {}),
        detailsContrat: {
          modeContractuel: 1,
          typeContratApp: cerfa.contrat.typeContratApp,
          numeroContratPrecedent: cerfa.contrat.numeroContratPrecedent || undefined,
          noContrat: cerfa.contrat.numeroContratPrecedent || undefined,
          dateDebutContrat: convertDate(cerfa.contrat.dateDebutContrat),
          dateEffetAvenant: convertDate(cerfa.contrat.dateEffetAvenant),
          dateConclusion: convertDate(cerfa.contrat.dateConclusion),
          dateFinContrat: convertDate(cerfa.contrat.dateFinContrat),
          typeDerogation: cerfa.contrat.typeDerogation || 99,
          dureeTravailHebdoHeures: cerfa.contrat.dureeTravailHebdoHeures,
          dureeTravailHebdoMinutes: cerfa.contrat.dureeTravailHebdoMinutes || 0,
          travailRisque: cerfa.contrat.travailRisque,
          salaireEmbauche: cerfa.contrat.salaireEmbauche,
          avantageNourriture: cerfa.contrat.avantageNourriture || undefined,
          avantageLogement: cerfa.contrat.avantageLogement || undefined,
          autreAvantageEnNature:
            cerfa.contrat.autreAvantageEnNature !== null ? cerfa.contrat.autreAvantageEnNature : false,
          remunerationsAnnuellesStructurees,

          lieuSignatureContrat: cerfa.contrat.lieuSignatureContrat,
          numeroEnregistrementContrat: dossier._id,
          infoTransmission: {
            organismeDREETS: dossier.dreets,
            organismeDDETS: dossier.ddets.startsWith("97") ? "99" : dossier.ddets,
            nomContact: user.nom,
            prenomContact: user.prenom,
            telephoneContact: user.telephone ? user.telephone.replace("+33", "0") : undefined,
            courrielContact: user.email,
            // commentaireTransmission
            // lien: "",
            pj: pjs,
          },
        },
        formation: {
          rncp: cerfa.formation.rncp,
          codeDiplome: cerfa.formation.codeDiplome,
          typeDiplome: cerfa.formation.typeDiplome,
          intituleQualification: cerfa.formation.intituleQualification,
          dateDebutFormation: convertDate(cerfa.formation.dateDebutFormation), // AAAA-MM-JJ
          dateFinFormation: convertDate(cerfa.formation.dateFinFormation), // AAAA-MM-JJ
          dureeFormation: cerfa.formation.dureeFormation,
        },
        organismeFormation: {
          denomination: cerfa.organismeFormation.denomination,
          formationInterne: false,
          siret: cerfa.organismeFormation.siret,
          uaiCfa: cerfa.organismeFormation.uaiCfa,
          // noDeclaration: cerfa.organismeFormation.,
          adresse: {
            numero: cerfa.organismeFormation.adresse.numero || undefined,
            // repetitionVoie: cerfa.organismeFormation.adresse.
            // typeVoie: cerfa.organismeFormation.adresse.
            voie: cerfa.organismeFormation.adresse.voie,
            complement: cerfa.organismeFormation.adresse.complement, // ""
            codePostal: cerfa.organismeFormation.adresse.codePostal,
            commune: cerfa.organismeFormation.adresse.commune,
          },
        },
        etablissementFormation: {
          denomination: cerfa.etablissementFormation.denomination,
          siret: cerfa.etablissementFormation.siret || undefined,
          uaiSite: cerfa.etablissementFormation.uaiCfa || undefined,
          adresse: {
            numero: cerfa.etablissementFormation.adresse.numero || undefined,
            // repetitionVoie: cerfa.etablissementFormation.adresse.
            // typeVoie: cerfa.etablissementFormation.adresse.
            voie: cerfa.etablissementFormation.adresse.voie,
            complement: cerfa.etablissementFormation.adresse.complement || undefined,
            codePostal: cerfa.etablissementFormation.adresse.codePostal,
            commune: cerfa.etablissementFormation.adresse.commune,
          },
        },
      };

      /* Send to  Agecap */
      const apiAgecap = new ApiAgecap(crypto);
      await apiAgecap.authenticate();

      let sendContratResponse = null;
      let sendDocumentResponses = [];

      try {
        sendContratResponse = await apiAgecap.sendContrat(contratAgecap);
      } catch (error) {
        console.log(error);
        throw Boom.badRequest("Doesn't exist", error);
      }

      if (contratAgecap.detailsContrat.infoTransmission.pj.length > 0 && sendContratResponse.status === 201) {
        let hasError = false;
        await asyncForEach(dossier.documents, async (document) => {
          try {
            const sendDocumentResponse = await apiAgecap.sendDocument(dossierId, document);
            sendDocumentResponses.push({
              documentId: document.documentId,
              data: sendDocumentResponse.data,
            });
          } catch (error) {
            console.log(error);
            hasError = true;
            sendDocumentResponses.push({
              documentId: document.documentId,
              data: error,
            });
          }
        });
        if (hasError) throw Boom.badRequest("Transmission error", sendDocumentResponses);
      }

      await dossiers.updateEtatDossier(dossierId, "TRANSMIS");

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
