const csvToJson = require("convert-csv-to-json-latin");
const logger = require("../../common/logger");
const { runScript } = require("../scriptWrapper");
const path = require("path");

const cleanUpKeysAndValues = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key.trim()]: value.trim(),
    };
  }, {});
};

const categJuridiqueImporter = async (db, assetsDir = path.join(__dirname, "./assets")) => {
  logger.info(`[Catégorie juridique importer] Starting`);

  // CSV import
  const CATEG_JURID_PATH = path.join(assetsDir, "CATEG-JURID-v1.csv");
  const jsonArray = csvToJson.getJsonFromCsv(CATEG_JURID_PATH);

  logger.info(`[Catégorie juridique importer] removing categoriesJuridiques documents`);
  await db.collection("categoriesjuridiques").deleteMany({});

  logger.info(`[Catégorie juridique importer] Importing Starting`);
  try {
    await db.collection("categoriesjuridiques").insertMany(jsonArray.map((d) => ({ ...cleanUpKeysAndValues(d) })));
    logger.info(`[Catégorie juridique importer] Importing Succeed`);
  } catch (error) {
    logger.error(error);
    logger.error(`[Catégorie juridique importer] Importing Failed`);
  }

  logger.info(`[Catégorie juridique importer] Ended`);
};

runScript(async ({ db }) => {
  await categJuridiqueImporter(db);
});
