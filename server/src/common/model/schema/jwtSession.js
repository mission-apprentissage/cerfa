const jwtSessionSchema = {
  jwt: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
};
module.exports = jwtSessionSchema;
