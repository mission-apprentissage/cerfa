const logger = require("../../common/logger");
const { User } = require("../../common/model/index");

module.exports = async () => {
  logger.info("test");
  await User.deleteMany({});
  logger.info(`All users deleted`);
};
