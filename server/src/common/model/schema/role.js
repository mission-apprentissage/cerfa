const rolesSchema = {
  name: {
    type: String,
    default: null,
    description: "Nom du rôle",
    unique: true,
  },
  acl: {
    type: [String],
    default: null,
    description: "Access control level array",
  },
};
module.exports = rolesSchema;
