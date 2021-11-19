const { runScript } = require("../scriptWrapper");
const { Contrat } = require("../../common/model/index");

runScript(async () => {
  const contrat = new Contrat({
    employeur: {
      denomination: "ENERGIE 3000",
      siret: "98765432400019",
      naf: "1031Z",
      nombreDeSalaries: 123,
      codeIdcc: "0043",
      libelleIdcc:
        "Convention collective nationale des entreprises de commission, de courtage et de commerce intracommunautaire et d'importation-exportation de France métropolitaine",
      telephone: "0908070605",
      courriel: "energie3000.pro@gmail.com",
      adresse: {
        numero: 13,
        voie: "Boulevard de la liberté",
        complement: "Etage 6 - Appartement 654",
        label: "13 Boulevard de la liberté",
        codePostal: "75000",
        commune: "PARIS",
      },
      nom: "LEFEVBRE",
      prenom: "MARTINE",
      typeEmployeur: 11,
      caisseComplementaire: "AGIRC-ARRCO",
      regimeSpecifique: false,
      attestationEligibilite: false,
      attestationPieces: false,
    },
    apprenti: {
      nom: "MARTIN",
      prenom: "Jean-François",
      sexe: "M",
      nationalite: 1,
      dateNaissance: "2001-01-01T00:00:00+0000",
      departementNaissance: "01",
      communeNaissance: "Bourg-en-Bresse",
      nir: "101010100100153",
      regimeSocial: 1,
      handicap: false,
      situationAvantContrat: 1,
      diplome: 26,
      derniereClasse: 12,
      diplomePrepare: 72,
      intituleDiplomePrepare: "Master en sciences de l'éducation",
      telephone: "0102030405",
      courriel: "jf.martin@orange.fr",
      adresse: {
        numero: 20,
        voie: "Boulevard de la liberté",
        complement: "Etage 6 - Appartement 654",
        label: "20 Boulevard de la liberté",
        codePostal: "75000",
        commune: "PARIS",
      },
      inscriptionSportifDeHautNiveau: false,
    },
  });
  await contrat.save();
});
