const { runScript } = require("../scriptWrapper");
const logger = require("../../common/logger");
const { MaintenanceMessage, Role, Cerfa } = require("../../common/model/index");

const defaultRolesAcls = require("./fixtures/defaultRolesAcls");
const cerfaData = require("./fixtures/cerfa.fixture");

const createUsersPenTest = async ({ users }) => {
  await users.createUser("contrat-pentest+admin1@apprentissage.beta.gouv.fr", "password", {
    nom: "admin",
    prenom: "1",
    permissions: { isAdmin: true },
    confirmed: true,
  });
  await users.createUser("contrat-pentest+admin2@apprentissage.beta.gouv.fr", "password", {
    nom: "admin",
    prenom: "2",
    permissions: { isAdmin: true },
    confirmed: true,
  });
  logger.info(`User '1admin' with password 'password' and admin is successfully created `);

  await users.createUser("contrat-pentest+support1@apprentissage.beta.gouv.fr", "password", {
    nom: "support",
    prenom: "1",
    roles: ["support"],
    confirmed: true,
  });
  await users.createUser("contrat-pentest+support2@apprentissage.beta.gouv.fr", "password", {
    nom: "support",
    prenom: "2",
    roles: ["support"],
    confirmed: true,
  });

  await users.createUser("contrat-pentest+entreprise1@apprentissage.beta.gouv.fr", "password", {
    nom: "entreprise",
    prenom: "1",
    roles: ["entreprise"],
    confirmed: true,
  });
  await users.createUser("contrat-pentest+entreprise2@apprentissage.beta.gouv.fr", "password", {
    nom: "entreprise",
    prenom: "2",
    roles: ["entreprise"],
    confirmed: true,
  });
  const userCfa = await users.createUser("contrat-pentest+cfa1@apprentissage.beta.gouv.fr", "password", {
    nom: "cfa",
    prenom: "1",
    roles: ["cfa"],
    confirmed: true,
  });
  await users.createUser("contrat-pentest+cfa2@apprentissage.beta.gouv.fr", "password", {
    nom: "cfa",
    prenom: "2",
    roles: ["cfa"],
    confirmed: true,
  });
  logger.info(`User '1entreprise' with password 'password' is successfully created `);

  return { userWks: userCfa, shareWithEmail: "contrat-pentest+entreprise1@apprentissage.beta.gouv.fr" };
};

const createUsersTest = async ({ users, userEmail }) => {
  const userAdmin = await users.createUser(userEmail, "password", {
    nom: "Admin",
    prenom: "test",
    permissions: { isAdmin: true },
    confirmed: true,
  });
  logger.info(`User ${userEmail} with password 'password' and admin is successfully created `);

  await users.createUser("employeur@test.com", "password", {
    nom: "Damien",
    prenom: "Arthur",
    roles: ["entreprise"],
    confirmed: true,
  });
  logger.info(`User "employeur@test.com" with password 'password' is successfully created `);
  return { userWks: userAdmin, shareWithEmail: "employeur@test.com" };
};

runScript(async ({ users, workspaces, dossiers }) => {
  const args = process.argv.slice(2);
  const seedPentest = args.includes("--pentest");
  const userEmail = args.includes("-e")
    ? args[args.indexOf("-e") + 1].toLowerCase()
    : "antoine.bigard+testadmin@beta.gouv.fr";

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

  let createUsers = null;
  if (seedPentest) {
    createUsers = createUsersPenTest;
  } else {
    createUsers = createUsersTest;
  }

  const { userWks, shareWithEmail } = await createUsers({ users, userEmail });

  const wks = await workspaces.getUserWorkspace(userWks, { _id: 1 });
  await workspaces.addContributeur(wks._id, shareWithEmail, "wks.member");
  logger.info(`Contributor added`);

  const dossier = await dossiers.createDossier({ sub: userWks.email }, { nom: "Dossier Test", saved: true });
  logger.info(`Dossier test created`);

  await Cerfa.create({
    ...cerfaData,
    dossierId: dossier._id,
  });
  logger.info(`Seed cerfa created`);
});
