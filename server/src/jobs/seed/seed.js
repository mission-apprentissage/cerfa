const logger = require("../../common/logger");
const { Sample } = require("../../common/model/index");

module.exports = async (db) => {
  try {
    const sampleToAdd = new Sample({
      id: "1",
      nom: "Test Sample",
      valeur: "Valeur exemple",
    });
    await sampleToAdd.save();
    logger.info(
      `Sample '${sampleToAdd.id}' / '${sampleToAdd.nom}' / '${sampleToAdd.valeur}' successfully added in db ${db.name}`
    );
  } catch (err) {
    logger.info("test");
  }
};
