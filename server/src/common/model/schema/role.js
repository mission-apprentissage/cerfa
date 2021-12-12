const rolesSchema = {
  name: {
    type: String,
    default: null,
    description: "Nom du rôle",
    unique: true,
  },
  type: {
    type: String,
    enum: ["user", "permission"],
    default: null,
    description: "type du rôle",
    required: true,
  },
  title: {
    type: String,
    default: null,
    description: "titre du rôle",
  },
  description: {
    type: String,
    default: null,
    description: "description du rôle",
  },
  acl: {
    type: [String],
    default: [],
    description: "Access control level array",
  },
};
module.exports = rolesSchema;
