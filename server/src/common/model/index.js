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
  Dossier: createModel("cerfa", schema.dossierSchema),
};
