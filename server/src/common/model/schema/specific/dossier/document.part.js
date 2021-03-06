const { mongoose } = require("../../../../mongodb");

const documentSchema = {
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    description: "Identifiant du document",
  },
  typeDocument: {
    enum: [
      "CONVENTION_FORMATION",
      "CONVENTION_REDUCTION_DUREE",
      "CONVENTION_MOBILITE",
      "FACTURE",
      "CERTIFICAT_REALISATION",
      "CONTRAT",
      null,
    ],
    type: String,
    default: null,
    required: true,
    description: "Le type de document",
  },
  typeFichier: {
    enum: ["pdf", "png", "jpg", "jpeg", null], // 10mb
    type: String,
    default: null,
    required: true,
    description: "Le type de fichier extension",
  },
  nomFichier: {
    type: String,
    default: null,
    required: true,
    description: "Le type de fichier extension",
  },
  cheminFichier: {
    type: String,
    default: null,
    required: true,
    description: "Chemin du fichier binaire",
  },
  tailleFichier: {
    type: Number,
    default: 0,
    required: true,
    description: "Taille du fichier en bytes",
  },
  dateAjout: {
    type: Date,
    default: Date.now,
    required: true,
    description: "Date d'ajout",
  },
  dateMiseAJour: {
    type: Date,
    default: Date.now,
    required: true,
    description: "Date de mise à jour",
  },
  quiMiseAJour: {
    type: String,
    default: null,
    required: true,
    description: "Qui a réalisé la derniere mise à jour",
  },
  hash: {
    type: String,
    default: null,
    required: false,
    description: "Checksum fichier",
  },
};

module.exports = documentSchema;
