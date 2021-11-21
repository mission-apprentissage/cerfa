const diplomeSchema = require("./diplome");

const formationSchema = {
  rncp: {
    maxLength: 9,
    type: String,
    description: "Qualification public visée numéro RNCP du diplôme ou titre visé par l'Alternant",
    default: null,
    required: true,
  },
  codeDiplome: {
    maxLength: 8,
    type: String,
    description: "Code du diplôme ou titre visé par l'Alternant, basé sur le référentiel France Compétences",
    default: null,
    required: true,
  },
  typeDiplome: {
    ...diplomeSchema,
  },
  intituleQualification: {
    maxLength: 255,
    type: String,
    description: "Intitulé précis du diplôme ou titre visé par l'Alternant",
    default: null,
    required: true,
  },
  dateDebutFormation: {
    type: Date,
    description: "Date de début du cycle de formation",
    default: null,
    required: true,
  },
  dateFinFormation: {
    type: Date,
    description: "Date de fin du cycle de formation",
    default: null,
    required: true,
  },
  dureeFormation: {
    type: Number,
    description: "Durée de formation (heures)",
    default: null,
    required: true,
  },
  dateObtentionDiplome: {
    type: Date,
    description: "Date d'obtention du diplôme ou titre visé par l'Alternant",
    nullable: true,
  },
};

module.exports = formationSchema;
