const rolesSchema = {
  name: {
    type: String,
    default: null,
    description: "Nom du rôle",
    unique: true,
  },
  acl: {
    type: [String],
    default: [],
    description: "Access control level array",
  },
};
module.exports = rolesSchema;
