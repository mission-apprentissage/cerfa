const { mongoose } = require("../mongodb");
const schema = require("../model/schema");

const createModel = (modelName, descriptor, options = {}) => {
  const schema = new mongoose.Schema(descriptor);
  schema.plugin(require("mongoose-paginate"));
  if (options.createMongoDBIndexes) {
    options.createMongoDBIndexes(schema);
  }
  return mongoose.model(modelName, schema, options.collectionName);
};

module.exports = {
  User: createModel("user", schema.userSchema),
  Role: createModel("role", schema.roleSchema),
  Log: createModel("log", schema.logSchema),
  MaintenanceMessage: createModel("maintenanceMessage", schema.maintenanceMessageSchema),

  // below Cerfa specific
  Dossier: createModel("dossier", schema.dossierSchema),
  Cerfa: createModel("cerfa", schema.cerfaSchema, {
    createMongoDBIndexes: (schema) => {
      schema.index({ dossierId: 1 }, { unique: true });
    },
  }),
  Commentaire: createModel("commentaire", schema.commentaireSchema),
  History: createModel("history", schema.historySchema, {
    createMongoDBIndexes: (schema) => {
      schema.index({ dossierId: 1, context: 1 }, { unique: true });
    },
  }),
};
