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

  const allDossiers = await Dossier.find({}).lean();
  await asyncForEach(allDossiers, async ({ _id, contributeurs, documents }) => {
    const contributeursLowerCase = contributeurs.map((email) => email.toLowerCase());
    const documentsLowerCase = documents.map((document) => ({
      ...document,
      quiMiseAJour: document.quiMiseAJour.toLowerCase(),
    }));
    console.log(documentsLowerCase);
    await Dossier.findOneAndUpdate(
      { _id },
      { $set: { contributeurs: contributeursLowerCase, documents: documentsLowerCase } }
    );
  });
};

const run = async () => {
  // Lookup for duplicate email
  const allUsers = await User.find({}, { email: 1, username: 1, account_status: 1, orign_register: 1, _id: 0 }).lean();

  let mergeLookup = {};
  for (let index = 0; index < allUsers.length; index++) {
    const { email, username, account_status, orign_register } = allUsers[index];
    const key = email.toLowerCase();
    mergeLookup[key] = [...(mergeLookup[key] ?? []), { username, account_status, orign_register }];
  }
  let lookup = {};
  for (const userEmail in mergeLookup) {
    if (mergeLookup[userEmail].length > 1) {
      lookup[userEmail] = mergeLookup[userEmail];
    }
  }

  if (Object.keys(lookup).length === 0) {
    // Lower casing all email in db
    await emailsToLowerCase();
  } else {
    console.log("Some duplicate emails exist ! You have too deal with them mmanually");
    console.log(lookup);
  }
};

module.exports = run;
