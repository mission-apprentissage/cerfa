const { User } = require("../../../common/model/index");

const run = async () => {
  await User.updateMany({ orign_register: "ORIGIN" }, { $set: { account_status: "FORCE_RESET_PASSWORD" } });
};

module.exports = run;
