const { BatchManagement } = require("../model");

/**
 * Gestion des batchs
 * Permet de connaître notamment la date de dernière exécution d'un certain batch, pour pouvoir
 * utiliser cette date comme date de début de la prochain exécution du même batch.
 */
module.exports = async () => {
  return {
    addBatchExecution: async (data) => {
      let result = null;

      try {
        result = await BatchManagement.create({
          name: data.name,
          dateDebut: data.dateDebut,
          dateFin: data.dateFin,
        });
      } catch (error) {
        throw new Error(error);
      }

      return result;
    },
    getLastBatchExecution: async (batchName) =>
      await BatchManagement.find({ name: batchName }).sort({ dateFin: -1 }).limit(1),
  };
};
