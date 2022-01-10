const {
  User,
  JwtSession,
  MaintenanceMessage,
  Role,
  Workspace,
  Dossier,
  Cerfa,
  History,
  Commentaire,
  Permission,
  ConnectionDossier,
  CategoriesJuridique,
} = require("../../common/model/index");

module.exports = async () => {
  await User.deleteMany({});
  await MaintenanceMessage.deleteMany({});
  await History.deleteMany({});
  await Commentaire.deleteMany({});
  await Role.deleteMany({});
  await Permission.deleteMany({});
  await Workspace.deleteMany({});
  await Dossier.deleteMany({});
  await Cerfa.deleteMany({});
  await JwtSession.deleteMany({});
  await ConnectionDossier.deleteMany({});
  await CategoriesJuridique.deleteMany({});
};
