const { runScript } = require("../scriptWrapper");

const addContributor = async ({ dossiers, roles, dossierId, userEmail, roleName = "dossier.admin" }) => {
  const newUserRole = (await roles.findRolesByNames([roleName]))[0];
  if (!newUserRole || !newUserRole.name.includes("dossier.")) {
    throw new Error("Something went wrong");
  }

  const dossier = await dossiers.findDossierById(dossierId, { nom: 1, contributeurs: 1, owner: 1, workspaceId: 1 });
  if (!dossier) {
    throw new Error("Doesn't exist");
  }

  await dossiers.addContributeur(dossier._id, userEmail, newUserRole.name);
};

runScript(async ({ dossiers, roles }) => {
  const args = process.argv.slice(2);

  if (!args.includes("-e") && !args.includes("-d") && args.length !== 4) {
    return;
  }

  const userEmail = args[args.indexOf("-e") + 1];
  const dossierId = args[args.indexOf("-d") + 1];

  await addContributor({ dossiers, roles, userEmail, dossierId });
});
