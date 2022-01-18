const logger = require("../../common/logger");
const { runScript } = require("../scriptWrapper");
const apiAgecap = require("../../common/apis/ApiAgecap");

const run = async () => {
  logger.info(`[AGECAP API] Tests`);

  logger.info(`[AGECAP API] Try to Auth`);
  try {
    const response = await apiAgecap.authenticate();
    console.log(response);
    logger.error(`[AGECAP API] Auth successed`);
  } catch (error) {
    logger.error(error);
    logger.error(`[AGECAP API] Auth Failed`);
  }
};

runScript(async ({ db }) => {
  await run(db);
});
