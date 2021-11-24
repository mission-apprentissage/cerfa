const { mongoose } = require("../../../mongodb");

const commentaireSchema = {
  dossierId: {
    type: String,
    description: "Identifiant interne du dossier",
    required: true,
  },
  contexte: {
    type: String,
    required: true,
    description: "contexte du commentaire",
  },
  discussions: {
    type: [
      new mongoose.Schema({
        resolve: {
          type: Boolean,
          default: false,
          required: true,
          description: "Statut du commentaire",
        },
        feed: {
          type: [
            {
              contenu: {
                type: String,
                required: true,
                description: "text du commentaire",
              },
              dateAjout: {
                type: Date,
                default: Date.now,
                required: true,
                description: "Date d'ajout",
              },
              createdBy: {
                type: String,
                default: null,
                required: true,
                description: "Qui a réalisé la derniere mise à jour",
              },
              notify: {
                type: [String],
                default: [],
                description: "Notifié à qui ? Déclenche une/(des) notification(s)",
              },
            },
          ],
        },
      }),
    ],
    default: [],
  },
};

module.exports = commentaireSchema;
