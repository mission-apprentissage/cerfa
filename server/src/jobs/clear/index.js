const { runScript } = require("../scriptWrapper");
const {
  User,
  JwtSession,
  MaintenanceMessage,
  Role,
  Workspace,
  CerfaHistory,
  Commentaire,
  Permission,
  ConnectionDossier,
  CategoriesJuridique,
  DdetsDreets,
} = require("../../common/model/index");
const { asyncForEach } = require("../../common/utils/asyncUtils");

const clearDataImported = async () => {
  await DdetsDreets.deleteMany({});
  await CategoriesJuridique.deleteMany({});
};

const clearSessionsRelated = async () => {
  await JwtSession.deleteMany({});
  await ConnectionDossier.deleteMany({});
};

const clearUserRelated = async () => {
  await Role.deleteMany({});
  await User.deleteMany({});
  await Workspace.deleteMany({});
};

const clearDossierRelated = async ({ dossiers }) => {
  const dossiersDb = await dossiers.findDossiers({}, { _id: 1 });

  await asyncForEach(dossiersDb, async ({ _id }) => {
    await dossiers.removeDossier(_id);
  });

  await CerfaHistory.deleteMany({});
  await Commentaire.deleteMany({});
};

runScript(async ({ dossiers }) => {
  const args = process.argv.slice(2);
  const clearAll = args.includes("--all");

  if (clearAll) {
    await clearDossierRelated({ dossiers });

    await MaintenanceMessage.deleteMany({});
    await clearUserRelated();
    await Permission.deleteMany({});
    await clearSessionsRelated();
    await clearDataImported();
  } else {
    await clearDossierRelated({ dossiers });
    await clearSessionsRelated();
    await clearDataImported();
  }
});
