const permissionSchema = {
  cerfaId: {
    type: String,
    description: "Identifiant interne du cerfa",
    required: true,
    index: true,
  },
  dossierId: {
    type: String,
    description: "Identifiant interne du dossier",
    required: true,
    index: true,
  },
  username: {
    type: String,
    required: true,
    index: true,
    description: "Qui a le droit sur le dossier",
  },
  role: {
    type: String,
    enum: ["initiateur_cerfa", "utilisateur", "signataire"],
    required: true,
    index: true,
    description: "Avec quel role",
  },
};
module.exports = permissionSchema;
