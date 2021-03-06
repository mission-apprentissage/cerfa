const assert = require("assert");
const { Cerfa } = require("../../../../src/common/model");
const { mongoose } = require("../../../../src/common/mongodb");

describe("Cerfa", () => {
  it("Doit créer un cerfa NON-DRAFT", async () => {
    await Cerfa.create({
      draft: false,
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
          departement: "75",
          region: "93",
        },
        nom: "LEFEVBRE",
        prenom: "MARTINE",
        typeEmployeur: 11,
        caisseComplementaire: "AGIRC-ARRCO",
        regimeSpecifique: false,
        attestationEligibilite: false,
        attestationPieces: false,
        privePublic: true,
      },
      apprenti: {
        nom: "MARTIN",
        prenom: "Jean-François",
        sexe: "M",
        nationalite: 1,
        dateNaissance: "2001-01-01T00:00:00+0000",
        age: 17,
        departementNaissance: "95",
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
          pays: "FR",
        },
        apprentiMineurNonEmancipe: true,
        apprentiMineur: true,
        responsableLegal: {
          nom: "Honore",
          prenom: "Robert",
          adresse: {
            numero: 20,
            voie: "Boulevard de la liberté",
            complement: "Etage 6 - Appartement 654",
            label: "20 Boulevard de la liberté",
            codePostal: "75000",
            commune: "PARIS",
            pays: "FR",
          },
        },
        inscriptionSportifDeHautNiveau: false,
      },
      maitre1: { nom: "Dupont", prenom: "Claire", dateNaissance: "1988-02-02T00:00:00+00:00" },
      maitre2: { nom: "Dupont", prenom: "Claire", dateNaissance: "1988-02-02T00:00:00+00:00" },
      formation: {
        rncp: "RNCP15516",
        codeDiplome: "32322111",
        typeDiplome: 13,
        intituleQualification: "string",
        dateDebutFormation: "2021-05-04T21:13:43+00:00",
        dateFinFormation: "2021-05-04T21:13:43+00:00",
        dureeFormationCalc: 0,
        dureeFormation: 0,
        dateObtentionDiplome: "2021-05-04T21:13:43+00:00",
      },
      contrat: {
        modeContractuel: 1,
        typeContratApp: 11,
        numeroContratPrecedent: "021202211653456",
        noContrat: "021202211653456",
        noAvenant: "021202211653456",
        dateDebutContrat: "2021-02-01T00:00:00+00:00",
        dureeContrat: 20,
        dateEffetAvenant: "2021-03-01T00:00:00+00:00",
        dateConclusion: "2021-01-15T00:00:00+00:00",
        dateFinContrat: "2021-02-28T00:00:00+00:00",
        dateRupture: "2021-02-28T00:00:00+00:00",
        lieuSignatureContrat: "PARIS",
        typeDerogation: 11,
        dureeTravailHebdoHeures: 37,
        dureeTravailHebdoMinutes: 30,
        travailRisque: true,
        salaireEmbauche: 1530.45,
        avantageNature: true,
        avantageNourriture: 3.55,
        avantageLogement: 456.78,
        autreAvantageEnNature: true,
        caisseRetraiteComplementaire: "null",
        remunerationMajoration: 0,
        remunerationsAnnuelles: [
          {
            dateDebut: "2021-02-01T00:00:00+00:00",
            dateFin: "2021-02-28T00:00:00+00:00",
            taux: 75.5,
            tauxMinimal: 57,
            salaireBrut: 1200,
            typeSalaire: "SMIC",
            ordre: "1.1",
          },
        ],
      },
      organismeFormation: {
        siret: "12345678901234",
        denomination: "string",
        formationInterne: true,
        uaiCfa: "0123456A",
        visaCfa: true,
        adresse: {
          numero: 14,
          voie: "Boulevard de la liberté",
          complement: "Etage 6 - Appartement 654",
          label: "14 Boulevard de la liberté",
          codePostal: "75000",
          commune: "PARIS",
        },
      },
      etablissementFormation: {
        memeResponsable: true,
        siret: "12345678901234",
        denomination: "string",
        uaiCfa: "0123456A",
        adresse: {
          numero: 14,
          voie: "Boulevard de la liberté",
          complement: "Etage 6 - Appartement 654",
          label: "14 Boulevard de la liberté",
          codePostal: "75000",
          commune: "PARIS",
        },
      },
      dossierId: mongoose.Types.ObjectId(),
    });

    const results = await Cerfa.find({ "employeur.denomination": "ENERGIE 3000" });

    assert.equal(results.length === 1, true);
  });
  it("Doit créer un Cerfa DRAFT", async () => {
    await Cerfa.create({
      draft: true,
      dossierId: mongoose.Types.ObjectId(),
    });

    const results = await Cerfa.find({});

    assert.equal(results.length === 1, true);
  });
});
