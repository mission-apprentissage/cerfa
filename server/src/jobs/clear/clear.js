const { User, MaintenanceMessage, Role, Workspace, Dossier, Cerfa } = require("../../common/model/index");

module.exports = async () => {
  await User.deleteMany({});
  await MaintenanceMessage.deleteMany({});
  await Role.deleteMany({});
  await Workspace.deleteMany({});
  await Dossier.deleteMany({});
  await Cerfa.deleteMany({});
};
