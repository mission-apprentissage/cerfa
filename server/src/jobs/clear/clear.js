const {
  User,
  MaintenanceMessage,
  Role,
  Workspace,
  Dossier,
  Cerfa,
  History,
  Permission,
} = require("../../common/model/index");

module.exports = async () => {
  await User.deleteMany({});
  await MaintenanceMessage.deleteMany({});
  await History.deleteMany({});
  await Role.deleteMany({});
  await Permission.deleteMany({});
  await Workspace.deleteMany({});
  await Dossier.deleteMany({});
  await Cerfa.deleteMany({});
};
