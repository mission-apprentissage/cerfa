const { User } = require("../../../common/model/index");

const run = async () => {
  await User.updateMany({}, { $set: { account_status: "FORCE_RESET_PASSWORD", orign_register: "ORIGIN" } });
};

module.exports = run;
