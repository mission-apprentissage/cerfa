const { mongoose } = require("../../../mongodb");

const historySchema = {
  idDossier: {
    type: String,
    description: "Identifiant interne du dossier",
    required: true,
  },
  contexte: {
    type: String,
    required: true,
    description: "contexte de l'historique",
  },
  history: {
    type: [
      new mongoose.Schema({
        from: {
          type: String,
          default: null,
          description: "valeur historique",
        },
        to: {
          type: String,
          required: true,
          description: "valeur historique",
        },
        when: {
          type: Date,
          default: Date.now,
          required: true,
          description: "Date de modification",
        },
        who: {
          type: String,
          default: null,
          required: true,
          description: "Qui a réalisé la modification",
        },
        how: {
          type: String,
          required: true,
          description: "comment a été modifié la valeur (automatique, manuel ...)",
        },
      }),
    ],
    default: [],
  },
};

module.exports = historySchema;
