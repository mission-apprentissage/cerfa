const mongoose = require("mongoose");

const historySchema = {
  dossierId: {
    type: String,
    description: "Identifiant interne du dossier",
    required: true,
  },
  context: {
    type: String,
    required: true,
    description: "contexte de l'historique",
  },
  history: {
    type: mongoose.Schema.Types.Mixed,
  },
};

module.exports = historySchema;
