require("dotenv").config();
const { DateTime } = require("luxon");
const { closeMongoConnection } = require("../common/mongodb");
const createComponents = require("../common/components/components");
const logger = require("../common/logger");
const config = require("../config");
const { access, mkdir } = require("fs").promises;
const { MaintenanceMessage } = require("../common/model/index");

process.on("unhandledRejection", (e) => console.log(e));
process.on("uncaughtException", (e) => console.log(e));

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const createTimer = () => {
  let launchTime;
  return {
    start: () => {
      launchTime = DateTime.now();
    },
    stop: (results) => {
      const duration = DateTime.now().diff(launchTime).toFormat("hh:mm:ss:SSS");
      const data = results && results.toJSON ? results.toJSON() : results;
      data && logger.info(JSON.stringify(data || {}, null, 2));
      logger.info(`Completed in ${duration}`);
    },
  };
};

const ensureOutputDirExists = async () => {
  const outputDir = config.outputDir;
  try {
    await access(outputDir);
  } catch (e) {
    if (e.code !== "EEXIST") {
      await mkdir(outputDir, { recursive: true });
    }
  }
  return outputDir;
};

const exit = async (rawError) => {
  let error = rawError;
  if (rawError) {
    logger.error(rawError.constructor.name === "EnvVarError" ? rawError.message : rawError);
  }

  //Waiting logger to flush all logs (MongoDB)
  await timeout(250);

  try {
    await closeMongoConnection();
  } catch (closeError) {
    error = closeError;
    console.log(error);
  }

  process.exitCode = error ? 1 : 0;
};

module.exports = {
  runScript: async (job) => {
    try {
      const timer = createTimer();
      timer.start();

      await ensureOutputDirExists();
      const components = await createComponents();
      await MaintenanceMessage.findOneAndUpdate(
        { context: "automatique" },
        { enabled: true },
        {
          new: true,
          upsert: true,
        }
      );
      const results = await job(components);
      timer.stop(results);

      await MaintenanceMessage.findOneAndUpdate(
        { context: "automatique" },
        { enabled: false },
        {
          new: true,
        }
      );
      await exit();
    } catch (e) {
      await MaintenanceMessage.findOneAndUpdate(
        { context: "automatique" },
        { enabled: false },
        {
          new: true,
        }
      );
      await exit(e);
    }
  },
};
