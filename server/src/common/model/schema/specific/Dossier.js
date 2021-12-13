const { mongoose } = require("../../../mongodb");
const documentSchema = require("./document.part");

const dossierSchema = {
  nom: {
    type: String,
    required: true,
    description: "Nom du dossier",
    default: "Nouveau Dossier",
  },
  documents: {
    type: [
      {
        ...documentSchema,
      },
    ],
    default: [],
    required: function () {
      return !this.draft;
    },
  },
  numeroExterne: {
    type: String,
    description: "Identifiant externe ou numéro de dossier (utilisé dans les communications entre le CFA et l'OPCO)",
    nullable: true,
    default: null,
  },
  numeroInterne: {
    type: String,
    description: "Identifiant interne ou technique (utilisé uniquement dans le SI de l'OPCO)",
    nullable: true,
    default: null,
  },
  numeroDeca: {
    type: String,
    description: "Numéro DECA du dossier\r\n<br />Obsolète : Ce champ est redondant avec le champ contrat.noContrat",
    nullable: true,
    default: null,
    example: "222222222222",
  },
  etat: {
    enum: ["TRANSMIS", "EN_COURS_INSTRUCTION", "ENGAGE", "ANNULE", "REFUSE", "RUTPURE", "SOLDE", null],
    type: String,
    default: null,
    nullable: true,
    required: function () {
      return !this.draft;
    },
    description:
      "**Etat du contrat** :\r\n<br />TRANSMIS\r\n<br />EN_COURS_INSTRUCTION\r\n<br />ENGAGE\r\n<br />ANNULE\r\n<br />REFUSE\r\n<br />RUPTURE\r\n<br />SOLDE",
  },
  draft: {
    type: Boolean,
    default: true,
    required: true,
    description: "Statut interne brouillon",
  },
  saved: {
    type: Boolean,
    default: false,
    description: "Sauvegardé",
  },
  lastModified: {
    type: Date,
    default: Date.now,
    description: "Date derniere modification",
  },
  contributeurs: {
    type: [String],
    default: [],
    description: "Contributeurs du dossier",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    default: null,
    required: true,
    description: "Propriétaire du dossier",
  },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "workspace",
    required: true,
    description: "Workspace id",
  },
};
module.exports = dossierSchema;
