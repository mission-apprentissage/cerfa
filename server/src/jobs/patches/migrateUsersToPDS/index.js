const { User } = require("../../../common/model/index");

const run = async () => {
  await User.updateMany({ orign_register: "ORIGIN", isAdmin: false }, { $set: { orign_register: "PDS" } });
};

module.exports = run;
