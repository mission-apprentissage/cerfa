const express = require("express");
const Joi = require("joi");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const permissionsDossierMiddleware = require("../../middlewares/permissionsDossierMiddleware");
const { asyncForEach } = require("../../../common/utils/asyncUtils");
const ApiAgecap = require("../../../common/apis/ApiAgecap");
const { find, pick } = require("lodash");
const Boom = require("boom");
const { DateTime } = require("luxon");

module.exports = (components) => {
  const router = express.Router();
  const { dossiers, cerfas, crypto } = components;

  const convertDate = (value) =>
    value
      ? DateTime.fromMillis(value.valueOf()).setZone("Europe/Paris").setLocale("fr-FR").toFormat("yyyy-MM-dd")
      : undefined;

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

      const pjs = dossier.documents.map(({ documentId, nomFichier, typeFichier, typeDocument, hash }) => ({
        identifiant: documentId,
        nom: nomFichier,
        format: typeFichier,
        type: typeDocument,
        checksum: hash,
      }));

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
          libelleIdcc: cerfa.employeur.libelleIdcc,
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
            organismeDDETS: dossier.ddets,
            nomContact: user.nom,
            prenomContact: user.prenom,
            // telephoneContact: user.telephone.replace("+33", "0"),
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
        if (hasError) throw Boom.badRequest("Doesn't exist", sendDocumentResponses);
      }

      return res.json({ contrat: sendContratResponse.data, documents: sendDocumentResponses });
    })
  );

  return router;
};