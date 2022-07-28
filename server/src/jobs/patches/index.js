const { runScript } = require("../scriptWrapper");
const logger = require("../../common/logger");

const emailsToLowerCase = require("./emailsLowercase");
const forceResetPassword = require("./forceResetPassword");
const migrateUsersToPDS = require("./migrateUsersToPDS");
const cleanStatusAgecap = require("./cleanStatusAgecap");
const initializeDossiersVersion = require("./initializeDossiersVersion");

const patchesList = [
  {
    patch: "Email to lower case",
    date: "16/03/2022",
    descr: "transforme tous les emails en base en minuscule",
    arg: "--emailLowercase",
  },
  {
    patch: "Force all users to reset there password",
    date: "17/03/2022",
    descr: "La politique de mot de passe passe de 8 à 12 caractères",
    arg: "--forceResetPassword",
  },
  {
    patch: "Migrate all non admin user from ORIGIN to PDS",
    date: "19/05/2022",
    descr: "Migration des utilisateurs vers PDS",
    arg: "--migrateUsersToPDS",
  },
  {
    path: "Clean status agecap",
    date: "05/07/2022",
    desc: "Suppression de tous les status_agecap de tous les dossiers",
    arg: "--cleanStatusAgecap",
  },
  {
    path: "Initialize dossiers version to 1",
    date: "27/07/2022",
    desc: "Initialisation de tous les numéros de version des dossiers présents à 1",
    arg: "--initializeDossiersVersion",
  },
];

runScript(async () => {
  const args = process.argv.slice(2);
  logger.info(`Patch`);

  const emailLowercaseArg = args.includes("--emailLowercase");
  const forceResetPasswordArg = args.includes("--forceResetPassword");
  const migrateUsersToPDSArg = args.includes("--migrateUsersToPDS");
  const cleanStatusAgecapArg = args.includes("--cleanStatusAgecap");
  const initializeDossiersVersionArg = args.includes("--initializeDossiersVersion");

  if (emailLowercaseArg) {
    await emailsToLowerCase();
  } else if (forceResetPasswordArg) {
    await forceResetPassword();
  } else if (migrateUsersToPDSArg) {
    await migrateUsersToPDS();
  } else if (cleanStatusAgecapArg) {
    await cleanStatusAgecap();
  } else if (initializeDossiersVersionArg) {
    await initializeDossiersVersion();
  } else {
    console.table(patchesList);
  }
});
