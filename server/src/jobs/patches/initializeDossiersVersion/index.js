const { Dossier } = require("../../../common/model");

const run = async () => {
  await Dossier.updateMany(
    {},
    {
      $set: {
        version: 1,
      },
    }
  );
};

module.exports = run;
