const { Dossier } = require("../../../common/model/index");

const run = async () => {
  // On met tous les status_agecap à []
  await Dossier.updateMany(
    {},
    {
      $set: {
        statutAgecap: [],
      },
    }
  );
};

module.exports = run;
