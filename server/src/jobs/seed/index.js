const { runScript } = require("../scriptWrapper");
const logger = require("../../common/logger");
const { MaintenanceMessage, Role, Cerfa } = require("../../common/model/index");

const defaultRolesAcls = require("./defaultRolesAcls");

runScript(async ({ users, workspaces, dossiers }) => {
  await MaintenanceMessage.create({
    context: "automatique",
    type: "alert",
    msg: "Une mise à jour des données est en cours...",
    name: "auto",
    enabled: false,
    time: new Date(),
  });
  logger.info(`MaintenanceMessage default created`);

  for (let index = 0; index < Object.keys(defaultRolesAcls).length; index++) {
    const key = Object.keys(defaultRolesAcls)[index];
    await Role.create(defaultRolesAcls[key]);
    logger.info(`Role ${key} created`);
  }

  const userAdmin = await users.createUser("antoine.bigard@beta.gouv.fr", "password", {
    nom: "Bigard",
    prenom: "Antoine",
    telephone: "+33612647513",
    email: "antoine.bigard@beta.gouv.fr",
    permissions: { isAdmin: true },
  });
  logger.info(`User 'testAdmin' with password 'password' and admin is successfully created `);

  await users.createUser("antoine.bigard+testEntreprise@beta.gouv.fr", "password", {
    nom: "Damien",
    prenom: "Arthur",
    telephone: "+33102030405",
    email: "antoine.bigard+testEntreprise@beta.gouv.fr",
    roles: ["entreprise"],
  });
  logger.info(`User 'testEntreprise' with password 'password' is successfully created `);

  const wks = await workspaces.getUserWorkspace(userAdmin, { _id: 1 });

  await workspaces.addContributeur(wks._id, "antoine.bigard+testEntreprise@beta.gouv.fr", "wks.member");

  const dossier = await dossiers.createDossier({ sub: userAdmin.email }, { nom: "Dossier Test", saved: true });

  logger.info(`Dossier test created`);

  await Cerfa.create({
    draft: true,
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
      intituleQualification: "Analyses agricoles biologiques et biotechnologiques",
      dateDebutFormation: "2021-05-04T21:13:43+00:00",
      dateFinFormation: "2021-05-04T21:13:43+00:00",
      dureeFormation: 0,
      dateObtentionDiplome: "2021-05-04T21:13:43+00:00",
    },
    contrat: {
      modeContractuel: 1,
      typeContratApp: 11,
      numeroContratPrecedent: "11111111111",
      noContrat: "222222222222",
      noAvenant: "3333333333",
      dateDebutContrat: "2021-02-01T00:00:00+00:00",
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
      avantageNourriture: 3.55,
      avantageLogement: 456.78,
      autreAvantageEnNature: true,
      remunerationsAnnuelles: [
        {
          dateDebut: "2021-02-01T00:00:00+00:00",
          dateFin: "2021-02-28T00:00:00+00:00",
          taux: 75.5,
          typeSalaire: "SMIC",
          ordre: "1.1",
        },
        {
          dateDebut: "2021-02-01T00:00:00+00:00",
          dateFin: "2021-02-28T00:00:00+00:00",
          taux: 30.5,
          typeSalaire: "SMC",
          ordre: "2.1",
        },
        {
          dateDebut: "2021-02-01T00:00:00+00:00",
          dateFin: "2021-02-28T00:00:00+00:00",
          taux: 75.5,
          typeSalaire: "SMIC",
          ordre: "3.1",
        },
      ],
    },
    organismeFormation: {
      siret: "30291412200015",
      denomination: "ASS DES MAISONS FAMILIALES",
      formationInterne: false,
      uaiCfa: "0123456A",
      visaCfa: false,
      adresse: {
        numero: 5,
        voie: "PL DU GENERAL DE GAULLE",
        complement: "Etage 6 - Appartement 654",
        label: "5 PL DU GENERAL DE GAULLE",
        codePostal: "60380",
        commune: "SONGEONS",
      },
    },
    dossierId: dossier._id,
  });
  logger.info(`Seed cerfa created`);
});
