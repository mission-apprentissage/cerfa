const mongoose = require("mongoose");
const { mongooseInstance } = require("../mongodb");
const { sampleSchema, userSchema } = require("../model/schema");

const getMongoostaticModel = (modelName, schema, instanceMongoose = mongooseInstance) => {
  const Schema = new instanceMongoose.Schema(schema);
  Schema.plugin(require("mongoose-paginate"));
  return mongooseInstance.model(modelName, Schema);
};

const getMongooseModel = (modelName, callback = () => ({})) => {
  const modelSchema = new mongoose.Schema(require(`./schema/${modelName}`));
  callback(modelSchema);
  return mongoose.model(modelName, modelSchema, modelName);
};

const getModel = (modelName, schema, instanceMongoose = mongooseInstance) => {
  if (instanceMongoose) return getMongoostaticModel(modelName, schema);
  return getMongooseModel(modelName);
};

let s = null;
if (!s) {
  s = getModel("sample", sampleSchema);
}

let u = null;
if (!u) {
  u = getModel("user", userSchema);
}

let l = null;
if (!l) {
  l = getMongooseModel("log");
}

module.exports = {
  Sample: s,
  User: u,
  Log: l,
};
