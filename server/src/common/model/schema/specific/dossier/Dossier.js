const { mongoose } = require("../../../../mongodb");
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
  dreets: {
    type: Number,
    description: "DREETS destinataire du contrat - code région d'exécution du contrat",
    nullable: true,
    default: null,
  },
  ddets: {
    type: String,
    description: "DDETS destinataire du contrat - code département d'éxécution du contrat",
    nullable: true,
    default: null,
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
    description: `Numéro DECA du dossier\r\n Obsolète : Ce champ est redondant avec le champ contrat.noContrat`,
    nullable: true,
    default: null,
    example: "222222222222",
  },
  statutAgecap: {
    type: [mongoose.Schema.Types.Mixed],
    description: `Historique des statuts agecap`,
    default: [],
  },
  etat: {
    enum: [
      "BROUILLON", // 0

      "DOSSIER_FINALISE_EN_ATTENTE_ACTION", // 1

      "EN_ATTENTE_DECLENCHEMENT_SIGNATURES",
      "EN_ATTENTE_SIGNATURES", // 2
      "SIGNATURES_EN_COURS", // 2
      "DOSSIER_TERMINE_AVEC_SIGNATURE", // 3

      "DOSSIER_TERMINE_SANS_SIGNATURE", // 3

      "TRANSMIS", // 4

      "EN_COURS_INSTRUCTION", // 5

      "INCOMPLET", // 6
      "DEPOSE", // 6
      "REFUSE", // 6

      "ENGAGE", // 7
      "ANNULE", // 7
      "RUTPURE", // 7
      "SOLDE", // 7
      null,
    ],
    type: String,
    default: "BROUILLON",
    nullable: true,
    description: `**Etat du contrat** :\r\n  TRANSMIS\r\n  EN_COURS_INSTRUCTION\r\n  ENGAGE\r\n  ANNULE\r\n  REFUSE\r\n  RUPTURE\r\n  SOLDE`,
  },
  mode: {
    enum: ["NOUVEAU_CONTRAT_SIGNATURE_ELECTRONIQUE", "NOUVEAU_CONTRAT_SIGNATURE_PAPIER", null],
    type: String,
    default: null,
    nullable: true,
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
  signataires: {
    type: {},
    default: null,
    description: "Signataires du dossier",
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
  signatures: {
    type: {},
    default: null,
  },
};
module.exports = dossierSchema;
