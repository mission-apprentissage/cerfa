const { runScript } = require("../scriptWrapper");
const logger = require("../../common/logger");

const categJuridiqueImporter = require("./categJuridiqueImporter");
const ddetsDreetsImporter = require("./ddetsDreetsImporter");

runScript(async ({ db }) => {
  const args = process.argv.slice(2);
  const importCategoryJuridique = args.includes("--catJurid");
  const importDdetsDreets = args.includes("--ddetsDreets");

  if (importCategoryJuridique) {
    await categJuridiqueImporter(db);
  } else if (importDdetsDreets) {
    await ddetsDreetsImporter(db);
  } else {
    await categJuridiqueImporter(db);
    await ddetsDreetsImporter(db);
  }

  logger.info(`Importers`);
});
