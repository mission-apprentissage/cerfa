const { DateTime } = require("luxon");
const { pick, find } = require("lodash");
const Boom = require("boom");
const { asyncForEach } = require("../utils/asyncUtils");
const ApiAgecap = require("../apis/ApiAgecap");
const idccEnum = require("../model/schema/specific/dossier/cerfa/parts/idcc.part");

module.exports = async (dossiers, cerfas, crypto) => {
  return {
    convertAndSendToAgecap: async ({ dossierId, user }) => {
      // On récupère le dossier et le cerfa depuis la BDD
      const dossier = await dossiers.findDossierById(dossierId);
      const cerfa = await cerfas.findCerfaByDossierId(dossierId);

      // On convertir le contrat au format AGECAP
      let contratAgecap = await convertContratToAgecapFormat(dossier, cerfa, user);

      const apiAgecap = new ApiAgecap(crypto);
      await apiAgecap.authenticate();

      let sendContratResponse = null;
      let sendDocumentResponses = [];

      // On télétransmet le contrat à AGECAP (via le WS01)
      try {
        sendContratResponse = await apiAgecap.sendContrat(contratAgecap);
      } catch (error) {
        console.log(error);
        throw Boom.badRequest("Send contrat error", error);
      }

      // Si la télétransmission (WS01 AGECAP) s'est bien déroulée, et qu'on a au moins 1 pièce jointe, on envoie les pièces jointes (WS02 AGECAP)
      if (contratAgecap.detailsContrat.infoTransmission.pj.length > 0 && sendContratResponse.status === 201) {
        let hasError = false;
        await asyncForEach(dossier.documents, async (document) => {
          // On tout, sauf le contrat signé, à AGECAP
          if (document.typeDocument !== "CONTRAT") {
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
          }
        });
        if (hasError) throw Boom.badRequest("Transmission document error", sendDocumentResponses);
      }

      await dossiers.updateEtatDossier(dossierId, "TRANSMIS");

      return { sendContratResponse, sendDocumentResponses };
    },
  };
};

/**
 * Convertir un contrat (dossier) du format PDIGI au format AGECAP
 * @param dossier dossier au terme PDIGI (1 dossier = 1 formulaire)
 * @param cerfa cerfa PDIGI = formulaire AGECAP
 * @param user
 * @returns {Promise<{detailsContrat: {dureeTravailHebdoMinutes: (number|*), lieuSignatureContrat: (string|boolean|*), typeContratApp: (number|boolean|*), travailRisque: (boolean|*), autreAvantageEnNature: (boolean|*), noContrat: (string|*|undefined), typeDerogation: (number|*), dateEffetAvenant: string, avantageNourriture: (number|*|undefined), dateConclusion: string, dateFinContrat: string, avantageLogement: (number|*|undefined), remunerationsAnnuellesStructurees: {annee3Periode1: *|{dateDebut: string, taux: *, typeSalaire: *, dateFin: string}, annee3Periode2: *|{dateDebut: string, taux: *, typeSalaire: *, dateFin: string}, annee2Periode1: *|{dateDebut: string, taux: *, typeSalaire: *, dateFin: string}, annee2Periode2: *|{dateDebut: string, taux: *, typeSalaire: *, dateFin: string}, annee4Periode2: *|{dateDebut: string, taux: *, typeSalaire: *, dateFin: string}, annee1Periode1: *|{dateDebut: string, taux: *, typeSalaire: *, dateFin: string}, annee4Periode1: *|{dateDebut: string, taux: *, typeSalaire: *, dateFin: string}, annee1Periode2: *|{dateDebut: string, taux: *, typeSalaire: *, dateFin: string}}, modeContractuel: number, dateDebutContrat: string, dureeTravailHebdoHeures: (number|boolean|*), numeroEnregistrementContrat, salaireEmbauche: (number|boolean|*), numeroContratPrecedent: (string|*|undefined), infoTransmission: {organismeDREETS: ({default: null, nullable: boolean, description: string, type: Number | NumberConstructor}|*|*), prenomContact, pj: {identifiant: *, format: string, checksum: *, type: string, nom: *}[], organismeDDETS: (string|{default: null, nullable: boolean, description: string, type: String | StringConstructor}|*|*), nomContact, courrielContact, telephoneContact: (*|undefined)}}, maitre1: {dateNaissance: string, nom: (boolean|string|*), prenom: (boolean|string|*)}, organismeFormation: {formationInterne: boolean, adresse: {voie, numero: undefined, commune, codePostal, complement: (string|*), repetitionVoie: (*|undefined)}, siret, denomination: (string|*), uaiCfa: (string|boolean|*)}, maitre2: {dateNaissance: string, nom: *, prenom: *}, formation: {dureeFormation: (boolean|number|*), codeDiplome: (boolean|string|*), dateDebutFormation: string, intituleQualification: (boolean|string|*), rncp: (boolean|string|*), typeDiplome: (boolean|number|*), dateFinFormation: string}, alternant: {nationalite: (number|boolean|*), situationAvantContrat: (number|boolean|*), dateNaissance: string, diplomePrepare: (number|boolean|*), handicap: (boolean|*), responsableLegal: {adresse: {voie: *, numero, commune: *, codePostal: *, complement: string|*, repetitionVoie, pays: *}, nom: *, prenom: *}, communeNaissance: (string|boolean|*), sexe: (number), telephone, regimeSocial: (number|boolean|*), nom, courriel: (string|boolean|*), departementNaissance: string, sportifEntraineurArbitreJugeHautNiveau: (boolean|*), intituleDiplomePrepare: (string|boolean|*), adresse: {voie, numero: undefined, commune, codePostal, complement: (string|*), repetitionVoie: (*|undefined), pays: (string|null|*)}, derniereClasse: string, prenom, apprentiMineurNonEmancipe: (boolean|*), diplome: (number|boolean|*)}, employeur: {libelleIdcc: (*|string|boolean), regimeSpecifique: (boolean|*), nombreDeSalaries: (number|boolean|*), telephone, attestationEligibilite: (boolean|*), siret, courriel: (string|boolean|*), denomination: (string|*), typeEmployeur: (number|boolean|*), naf: string, codeIdcc: (string|boolean|*), adresse: {voie, numero: undefined, commune, codePostal, complement: (string|*), repetitionVoie: (*|undefined)}, employeurSpecifique: (boolean|number|*), attestationPieces: (boolean|*), caisseComplementaire: string}, etablissementFormation: {adresse: {voie: (string|boolean|*), numero: (number|*|undefined), commune: (string|boolean|*), codePostal: (string|boolean|*), complement: (string|*), repetitionVoie: ({default: boolean, type: Boolean | BooleanConstructor}|*|undefined)}, uaiSite: (string|{default: boolean, type: Boolean | BooleanConstructor}|*|undefined), siret: (string|*|undefined), denomination: (string|*)}}>}
 */
async function convertContratToAgecapFormat(dossier, cerfa, user) {
  const convertDate = (value) =>
    value
      ? DateTime.fromMillis(value.valueOf()).setZone("Europe/Paris").setLocale("fr-FR").toFormat("yyyy-MM-dd")
      : undefined;

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

  const removeSpecialCharacters = (value) => {
    if (!value) return "";
    return value.replace(/[\W_]/g, " ");
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

  const pjs = dossier.documents
    .filter((document) => document.typeDocument !== "CONTRAT") // On envoie pas le contrat signé à AGECAP
    .map(({ documentId, nomFichier, typeDocument, hash }) => ({
      identifiant: documentId,
      nom: nomFichier,
      format: "PDF", // typeFichier,
      type: typeDocument === "CONVENTION_FORMATION" ? "1" : "2",
      checksum: hash,
    }));

  const libelleIdcc = find(idccEnum, { code: cerfa.employeur.codeIdcc })?.libelle || cerfa.employeur.libelleIdcc;

  return {
    employeur: {
      denomination: removeSpecialCharacters(cerfa.employeur.denomination),
      typeEmployeur: cerfa.employeur.typeEmployeur,
      employeurSpecifique: cerfa.employeur.employeurSpecifique,
      siret: cerfa.employeur.siret,
      naf: cerfa.employeur.naf.toUpperCase(),
      nombreDeSalaries: cerfa.employeur.nombreDeSalaries,
      caisseComplementaire: "NA",
      regimeSpecifique: cerfa.employeur.regimeSpecifique,
      codeIdcc: cerfa.employeur.codeIdcc,
      libelleIdcc: libelleIdcc,
      telephone: cerfa.employeur.telephone.replace("+", "00"), // TO CONVERT   + => 00
      courriel: cerfa.employeur.courriel,
      adresse: {
        numero: cerfa.employeur.adresse.numero || undefined,
        repetitionVoie: cerfa.employeur.adresse.repetitionVoie ?? undefined,
        // typeVoie: cerfa.employeur.adresse.
        voie: cerfa.employeur.adresse.voie,
        complement: removeSpecialCharacters(cerfa.employeur.adresse.complement),
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
      telephone: cerfa.apprenti.telephone.replace("+", "00"), // TO CONVERT   + => 00
      courriel: cerfa.apprenti.courriel,
      adresse: {
        numero: cerfa.apprenti.adresse.numero || undefined,
        repetitionVoie: cerfa.apprenti.adresse.repetitionVoie ?? undefined,
        // typeVoie: cerfa.apprenti.adresse.
        voie: cerfa.apprenti.adresse.voie,
        complement: removeSpecialCharacters(cerfa.apprenti.adresse.complement),
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
                repetitionVoie: cerfa.apprenti.responsableLegal.adresse.repetitionVoie ?? undefined,
                // typeVoie: cerfa.apprenti.responsableLegal.adresse.
                voie: cerfa.apprenti.responsableLegal.adresse.voie,
                complement: removeSpecialCharacters(cerfa.apprenti.responsableLegal.adresse.complement),
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
      autreAvantageEnNature: cerfa.contrat.autreAvantageEnNature !== null ? cerfa.contrat.autreAvantageEnNature : false,
      remunerationsAnnuellesStructurees,

      lieuSignatureContrat: cerfa.contrat.lieuSignatureContrat,
      numeroEnregistrementContrat: dossier._id,
      infoTransmission: {
        organismeDREETS: dossier.dreets,
        organismeDDETS: dossier.ddets.startsWith("97") ? "99" : dossier.ddets,
        nomContact: user.nom,
        prenomContact: user.prenom,
        telephoneContact: user.telephone ? user.telephone.replace("+", "00") : undefined,
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
      denomination: removeSpecialCharacters(cerfa.organismeFormation.denomination),
      formationInterne: false,
      siret: cerfa.organismeFormation.siret,
      uaiCfa: cerfa.organismeFormation.uaiCfa,
      // noDeclaration: cerfa.organismeFormation.,
      adresse: {
        numero: cerfa.organismeFormation.adresse.numero || undefined,
        repetitionVoie: cerfa.organismeFormation.adresse.repetitionVoie ?? undefined,
        // typeVoie: cerfa.organismeFormation.adresse.
        voie: cerfa.organismeFormation.adresse.voie,
        complement: removeSpecialCharacters(cerfa.organismeFormation.adresse.complement),
        codePostal: cerfa.organismeFormation.adresse.codePostal,
        commune: cerfa.organismeFormation.adresse.commune,
      },
    },
    etablissementFormation: {
      denomination: removeSpecialCharacters(cerfa.etablissementFormation.denomination),
      siret: cerfa.etablissementFormation.siret || undefined,
      uaiSite: cerfa.etablissementFormation.uaiCfa || undefined,
      adresse: {
        numero: cerfa.etablissementFormation.adresse.numero || undefined,
        repetitionVoie: cerfa.etablissementFormation.adresse.repetitionVoie ?? undefined,
        // typeVoie: cerfa.etablissementFormation.adresse.
        voie: cerfa.etablissementFormation.adresse.voie,
        complement: removeSpecialCharacters(cerfa.etablissementFormation.adresse.complement),
        codePostal: cerfa.etablissementFormation.adresse.codePostal,
        commune: cerfa.etablissementFormation.adresse.commune,
      },
    },
  };
}
