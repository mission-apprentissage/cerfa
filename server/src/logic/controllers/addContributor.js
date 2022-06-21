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

module.exports = {
  addContributor,
};
