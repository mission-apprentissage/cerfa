const express = require("express");
const Joi = require("joi");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const permissionsDossierMiddleware = require("../../middlewares/permissionsDossierMiddleware");
// const apiNaf = require("../../../common/apis/ApiNaf");
const ApiAgecap = require("../../../common/apis/ApiAgecap");
const { find, pick } = require("lodash");

module.exports = (components) => {
  const router = express.Router();
  const { dossiers, cerfas, crypto } = components;
  router.post(
    "/",
    permissionsDossierMiddleware(components, ["dossier/publication"]),
    tryCatch(async ({ body, user }, res) => {
      const { dossierId } = await Joi.object({
        dossierId: Joi.string().required(),
      }).validateAsync(body, { abortEarly: false });

      const dossier = await dossiers.findDossierById(dossierId);
      const cerfa = await cerfas.findCerfaByDossierId(dossierId);

      const toKeep = ["dateDebut", "dateFin", "taux", "typeSalaire"];
      const Annee1Periode1 = pick(find(cerfa.contrat.remunerationsAnnuelles, { ordre: "1.1" }), toKeep);
      const Annee1Periode2 = pick(find(cerfa.contrat.remunerationsAnnuelles, { ordre: "1.2" }), toKeep);
      const Annee2Periode1 = pick(find(cerfa.contrat.remunerationsAnnuelles, { ordre: "2.1" }), toKeep);
      const Annee2Periode2 = pick(find(cerfa.contrat.remunerationsAnnuelles, { ordre: "2.2" }), toKeep);
      const Annee3Periode1 = pick(find(cerfa.contrat.remunerationsAnnuelles, { ordre: "3.1" }), toKeep);
      const Annee3Periode2 = pick(find(cerfa.contrat.remunerationsAnnuelles, { ordre: "3.2" }), toKeep);
      const Annee4Periode1 = pick(find(cerfa.contrat.remunerationsAnnuelles, { ordre: "4.1" }), toKeep);
      const Annee4Periode2 = pick(find(cerfa.contrat.remunerationsAnnuelles, { ordre: "4.2" }), toKeep);

      // dateDebut: Annee1Periode2.dateDebut, // AAAA-MM-JJ
      // dateFin: Annee1Periode2.dateFin, // AAAA-MM-JJ
      const remunerationsAnnuellesStructurees = {
        ...(Object.keys(Annee1Periode1).length > 0 ? { Annee1Periode1 } : {}),
        ...(Object.keys(Annee1Periode2).length > 0 ? { Annee1Periode2 } : {}),
        ...(Object.keys(Annee2Periode1).length > 0 ? { Annee2Periode1 } : {}),
        ...(Object.keys(Annee2Periode2).length > 0 ? { Annee2Periode2 } : {}),
        ...(Object.keys(Annee3Periode1).length > 0 ? { Annee3Periode1 } : {}),
        ...(Object.keys(Annee3Periode2).length > 0 ? { Annee3Periode2 } : {}),
        ...(Object.keys(Annee4Periode1).length > 0 ? { Annee4Periode1 } : {}),
        ...(Object.keys(Annee4Periode2).length > 0 ? { Annee4Periode2 } : {}),
      };
      console.log(remunerationsAnnuellesStructurees);

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
          libelleidcc: cerfa.employeur.libelleIdcc,
          telephone: cerfa.employeur.telephone, // TO CONVERT
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
        },
        alternant: {
          nom: cerfa.apprenti.nom,
          prenom: cerfa.apprenti.prenom,
          sexe: cerfa.apprenti.sexe, // M = 1 F = 2
          nationalite: cerfa.apprenti.nationalite,
          dateNaissance: cerfa.apprenti.dateNaissance, // AAAA-MM-JJ
          departementNaissance: cerfa.apprenti.departementNaissance,
          communeNaissance: cerfa.apprenti.communeNaissance,
          regimeSocial: cerfa.apprenti.regimeSocial,
          sportifEntraineurArbitreJugeHautNiveau: cerfa.apprenti.inscriptionSportifDeHautNiveau,
          handicap: cerfa.apprenti.handicap,
          situationAvantContrat: cerfa.apprenti.situationAvantContrat,
          diplome: cerfa.apprenti.diplome,
          derniereClasse: cerfa.apprenti.derniereClasse,
          diplomePrepare: cerfa.apprenti.diplomePrepare,
          intituleDiplomePrepare: cerfa.apprenti.intituleDiplomePrepare,
          apprentiMineurNonEmancipe: cerfa.apprenti.apprentiMineurNonEmancipe,
          telephone: cerfa.apprenti.telephone, // TO CONVERT
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
                  // CONDITION
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
          dateNaissance: cerfa.maitre1.dateNaissance, // AAAA-MM-JJ
        },
        ...(cerfa.maitre2.nom
          ? {
              maitre2: {
                nom: cerfa.maitre2.nom,
                prenom: cerfa.maitre2.prenom,
                dateNaissance: cerfa.maitre2.dateNaissance, // AAAA-MM-JJ
              },
            }
          : {}),
        detailsContrat: {
          modeContractuel: 1,
          typeContratApp: cerfa.contrat.typeContratApp,
          numeroContratPrecedent: cerfa.contrat.numeroContratPrecedent, //CONDITION / Null
          noContrat: cerfa.contrat.numeroContratPrecedent, //CONDITION / Null
          dateDebutContrat: cerfa.contrat.dateDebutContrat, // AAAA-MM-JJ
          dateEffetAvenant: cerfa.contrat.dateEffetAvenant, // Null
          dateConclusion: cerfa.contrat.dateConclusion, // AAAA-MM-JJ
          dateFinContrat: cerfa.contrat.dateFinContrat, // AAAA-MM-JJ
          typeDerogation: cerfa.contrat.typeDerogation, // Null = 99
          dureeTravailHebdoHeures: cerfa.contrat.dureeTravailHebdoHeures,
          dureeTravailHebdoMinutes: cerfa.contrat.dureeTravailHebdoMinutes, // Null 0
          travailRisque: cerfa.contrat.travailRisque,
          salaireEmbauche: cerfa.contrat.salaireEmbauche,
          avantageNourriture: cerfa.contrat.avantageNourriture || undefined,
          avantageLogement: cerfa.contrat.avantageLogement || undefined,
          autreAvantageEnNature: cerfa.contrat.autreAvantageEnNature || undefined,
          remunerationsAnnuellesStructurees,

          lieuSignatureContrat: cerfa.contrat.lieuSignatureContrat,
          numeroEnregistrementContrat: dossier._id,
          infoTransmission: {
            organismeDREETS: dossier.dreets,
            organismeDDETS: dossier.ddets,
            nomContact: user.nom,
            prenomContact: user.prenom,
            telephoneContact: user.telephone,
            courrielContact: user.email,
            // commentaireTransmission
            // lien: "",
            // pj: [{
            //     identifiant: dossier.documents[0].documentId,
            //     nom: dossier.documents[0].nomFichier,
            //     format: dossier.documents[0].typeFichier,
            //     type: dossier.documents[0].typeDocument,
            //     checksum: dossier.documents[0].hash,
            // }]
          },
        },
        formation: {
          rncp: cerfa.formation.rncp,
          codeDiplome: cerfa.formation.codeDiplome,
          typeDiplome: cerfa.formation.typeDiplome,
          intituleQualification: cerfa.formation.intituleQualification,
          dateDebutFormation: cerfa.formation.dateDebutFormation, // AAAA-MM-JJ
          dateFinFormation: cerfa.formation.dateFinFormation, // AAAA-MM-JJ
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
          denomination: cerfa.organismeFormation.denomination,
          // siret: cerfa.organismeFormation.siret,
          // uaiSite: cerfa.organismeFormation.uaiCfa,
          adresse: {
            // numero: cerfa.organismeFormation.adresse.numero || undefined,
            // repetitionVoie: cerfa.organismeFormation.adresse.
            // typeVoie: cerfa.organismeFormation.adresse.
            voie: cerfa.organismeFormation.adresse.voie,
            // complement: cerfa.organismeFormation.adresse.complement, // ""
            codePostal: cerfa.organismeFormation.adresse.codePostal,
            commune: cerfa.organismeFormation.adresse.commune,
          },
        },
      };

      ///////
      const apiAgecap = new ApiAgecap(crypto);
      await apiAgecap.authenticate();

      // await apiAgecap.sendContrat(contratAgecap)
      // await apiAgecap.sendDocument(dossierId, document)

      return res.json(contratAgecap);
    })
  );

  return router;
};
