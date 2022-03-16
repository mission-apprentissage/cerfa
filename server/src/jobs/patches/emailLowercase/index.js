const { User, Permission, Workspace, Dossier } = require("../../../common/model/index");
const { asyncForEach } = require("../../../common/utils/asyncUtils");

const emailsToLowerCase = async () => {
  const allUsers = await User.find({});
  await asyncForEach(allUsers, async ({ _id, email }) => {
    await User.findOneAndUpdate({ _id }, { $set: { email: email.toLowerCase() } });
  });

  const allPermissions = await Permission.find({});
  await asyncForEach(allPermissions, async ({ _id, userEmail }) => {
    await Permission.findOneAndUpdate({ _id }, { $set: { userEmail: userEmail.toLowerCase() } });
  });

  const allWorkspaces = await Workspace.find({});
  await asyncForEach(allWorkspaces, async ({ _id, contributeurs }) => {
    const contributeursLowerCase = contributeurs.map((email) => email.toLowerCase());
    await Workspace.findOneAndUpdate({ _id }, { $set: { contributeurs: contributeursLowerCase } });
  });

  const allDossiers = await Dossier.find({});
  await asyncForEach(allDossiers, async ({ _id, contributeurs }) => {
    const contributeursLowerCase = contributeurs.map((email) => email.toLowerCase());
    await Dossier.findOneAndUpdate({ _id }, { $set: { contributeurs: contributeursLowerCase } });
  });

  // Lookup duplicate
};

module.exports = emailsToLowerCase;
