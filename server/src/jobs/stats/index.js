const logger = require("../../common/logger");
const { runScript } = require("../scriptWrapper");
const { Log } = require("../../common/model");

runScript(async ({ db }) => {
  const nbSampleEntities = await Log.countDocuments({});
  logger.info(`Db ${db.name} - Log count : ${nbSampleEntities}`);
});
