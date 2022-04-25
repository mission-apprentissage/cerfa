const { runScript } = require("./scriptWrapper");
const logger = require("../common/logger");

const lookupAgecapStatusChanged = require("./statutsAgecap/lookupAgecapStatusChanged");

runScript(async (components) => {
  try {
    logger.info(`Start all jobs`);

    await lookupAgecapStatusChanged(components);
  } catch (error) {
    logger.error(error);
  }
});
