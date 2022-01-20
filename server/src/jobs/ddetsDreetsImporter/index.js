const csvToJson = require("convert-csv-to-json-latin");
const logger = require("../../common/logger");
const { runScript } = require("../scriptWrapper");
const path = require("path");

const cleanUpKeysAndValues = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key.trim()]: `${value}`.trim(),
    };
  }, {});
};

const importer = async (db, assetsDir = path.join(__dirname, "./assets")) => {
  logger.info(`[DDETS DREETS Importer] Starting`);

  // CSV import
  const DDETS_PATH = path.join(assetsDir, "DDETS-latest.csv");
  const ddetsJsonArray = csvToJson.getJsonFromCsv(DDETS_PATH);

  const DREETS_PATH = path.join(assetsDir, "DRIEETS-latest.csv");
  const dreetsJsonArray = csvToJson.getJsonFromCsv(DREETS_PATH);

  logger.info(`[DDETS DREETS Importer] removing previous documents`);
  await db.collection("ddetsdreets").deleteMany({});

  logger.info(`[DDETS DREETS Importer] Importing Starting`);
  try {
    await db
      .collection("ddetsdreets")
      .insertMany(ddetsJsonArray.map((d) => ({ ...cleanUpKeysAndValues(d), type: "DDETS" })));
    await db
      .collection("ddetsdreets")
      .insertMany(dreetsJsonArray.map((d) => ({ ...cleanUpKeysAndValues(d), type: "DREETS" })));
    logger.info(`[DDETS DREETS Importer] Importing Succeed`);
  } catch (error) {
    logger.error(error);
    logger.error(`[DDETS DREETS Importer] Importing Failed`);
  }

  logger.info(`[DDETS DREETS Importer] Ended`);
};

runScript(async ({ db }) => {
  await importer(db);
});
