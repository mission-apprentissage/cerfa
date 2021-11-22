const diplomeSchema = require("./diplome");

const formationSchema = {
  rncp: {
    maxLength: 9,
    type: String,
    description: "Qualification public visée numéro RNCP du diplôme ou titre visé par l'Alternant",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  codeDiplome: {
    maxLength: 8,
    type: String,
    description: "Code du diplôme ou titre visé par l'Alternant, basé sur le référentiel France Compétences",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  typeDiplome: {
    ...diplomeSchema,
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  intituleQualification: {
    maxLength: 255,
    type: String,
    description: "Intitulé précis du diplôme ou titre visé par l'Alternant",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dateDebutFormation: {
    type: Date,
    description: "Date de début du cycle de formation",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dateFinFormation: {
    type: Date,
    description: "Date de fin du cycle de formation",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dureeFormation: {
    type: Number,
    description: "Durée de formation (heures)",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dateObtentionDiplome: {
    type: Date,
    description: "Date d'obtention du diplôme ou titre visé par l'Alternant",
    nullable: true,
  },
};

module.exports = formationSchema;
