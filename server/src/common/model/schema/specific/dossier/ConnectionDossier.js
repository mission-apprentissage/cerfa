const { mongoose } = require("../../../../mongodb");

const connectionDossierSchema = {
  _id: {
    type: String,
    required: true,
    description: "socket id",
  },
  dossierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "dossier",
    required: true,
    index: true,
    description: "dossier id",
  },
  email: {
    type: String,
    required: true,
    index: true,
    description: "user email",
  },
};

module.exports = connectionDossierSchema;
