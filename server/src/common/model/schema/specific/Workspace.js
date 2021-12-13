const { mongoose } = require("../../../mongodb");

const workspaceSchema = {
  nom: {
    type: String,
    description: "Nom du workspace",
    default: null,
  },
  description: {
    type: String,
    description: "Description du workspace",
    default: null,
  },
  siren: {
    default: null,
    type: String,
    description: "N° Siren",
  },
  contributeurs: {
    type: [String],
    default: [],
    description: "Contributeurs du workspace",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    default: null,
    required: true,
    unique: true,
    description: "Propriétaire du workspace",
  },
};

module.exports = workspaceSchema;
