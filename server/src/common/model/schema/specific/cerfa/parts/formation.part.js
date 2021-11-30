const diplomeSchema = require("./diplome.part");

const formationSchema = {
  rncp: {
    maxLength: 9,
    type: String,
    description: "Qualification public visée numéro RNCP du diplôme ou titre visé par l'Alternant",
    label: "Code RNCP : ",
    example: "RNCP15516",
    requiredMessage: "Le code RNCP est obligatoire",
    validateMessage: `n'est pas un code RNCP valide. Le code RNCP doit être définit et au format 5 ou 9 caractères,  RNCP24440 ou 24440`,
    pattern: "^(RNCP)?[0-9]{2,5}$",
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /^(RNCP)?[0-9]{2,5}$/.test(v);
      },
      message: (props) => `${props.value} n'est pas un code RNCP valide`,
    },
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  codeDiplome: {
    maxLength: 8,
    type: String,
    default: null,
    description: "Code du diplôme ou titre visé par l'Alternant, basé sur le référentiel France Compétences",
    label: "Code diplôme (Éducation Nationale) : ",
    example: "32322111",
    requiredMessage: "Le code diplôme est obligatoire",
    validateMessage: `n'est pas un code diplôme valide. Le code formation diplôme doit être au format 8 caractères ou 9 avec la lettre specialité`,
    pattern: "^[0-9A-Z]{8}[A-Z]?$",
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /^[0-9A-Z]{8}[A-Z]?$/.test(v);
      },
      message: (props) => `${props.value} n'est pas un code diplôme valide`,
    },
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
    label: "Date de début du cycle de formation : ",
    example: "05/11/2021",
    requiredMessage: "la date de début de cycle est obligatoire",
    validateMessage: ` n'est pas une date valide`,
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dateFinFormation: {
    type: Date,
    description: "Date de fin du cycle de formation",
    label: "Date prévue de fin des épreuves ou examens : ",
    example: "18/11/2021",
    requiredMessage: "la date de fin de cycle est obligatoire",
    validateMessage: ` n'est pas une date valide`,
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
