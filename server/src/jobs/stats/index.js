const logger = require("../../common/logger");
const { runScript } = require("../scriptWrapper");
const { Sample } = require("../../common/model");

runScript(async ({ db }) => {
  const nbSampleEntities = await Sample.countDocuments({});
  logger.info(`Db ${db.name} - Sample count : ${nbSampleEntities}`);
});
