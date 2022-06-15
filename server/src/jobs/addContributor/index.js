const { runScript } = require("../scriptWrapper");
const { addContributor } = require("../../logic/controllers/addContributor");

runScript(async ({ dossiers, roles }) => {
  const args = process.argv.slice(2);

  if (!args.includes("-e") && !args.includes("-d") && args.length !== 4) {
    return;
  }

  const userEmail = args[args.indexOf("-e") + 1];
  const dossierId = args[args.indexOf("-d") + 1];

  await addContributor({ dossiers, roles, userEmail, dossierId });
});
