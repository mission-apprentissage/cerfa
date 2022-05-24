const diplomeSchema = require("./diplome.part");

const formationSchema = {
  rncp: {
    maxLength: 9,
    type: String,
    description: `Le code RNCP peut être recherché sur [le site France compétences.](https://www.francecompetences.fr/recherche_certificationprofessionnelle/) Le code diplôme peut être déduit du code RNCP et à l'inverse, vous pouvez renseigner un code diplôme pour déduire le code RNCP correspondant.`,
    example: "RNCP15516",
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
    description: `Ce code à 8 caractères permet d'identifier un titre ou diplôme préparé par la voie de l'apprentissage, plus d'informations sur [le site du ministère de l'Education Nationale.](https://www.education.gouv.fr/codification-des-formations-et-des-diplomes-11270) Le code diplôme peut être recherché sur [le catalogue des formations en apprentissage.](https://catalogue.apprentissage.beta.gouv.fr/) Le code diplôme peut être déduit du code RNCP et à l'inverse, vous pouvez renseigner un code diplôme pour déduire le code RNCP correspondant.`,
    example: "32322111",
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
    example: 74,
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  intituleQualification: {
    maxLength: 255,
    type: String,
    description: "Intitulé précis du diplôme ou titre visé par l'Alternant",
    example: "PRODUCTION ET SERVICE EN RESTAURATION (RAPIDE, COLLECTIVE, CAFETERIA) (CAP)",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dateDebutFormation: {
    type: Date,
    description: `Il faut renseigner la date effective à laquelle l'apprenti débute sa formation, même si l'apprenti a démarré la formation sous le statut "stagiaire de la formation professionnelle".`,
    example: "05/11/2021",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dateFinFormation: {
    type: Date,
    description:
      "Lorsque la date précise n'est pas connue, il est possible de renseigner une date prévisionnelle avec une marge de 2 mois maximum.",
    example: "18/11/2021",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dureeFormationCalc: {
    type: Number,
    default: null,
    description: "Durée de formation en mois [calculé]",
  },
  dureeFormation: {
    type: Number,
    description:
      "La quotité de formation théorique du contrat d’apprentissage ne peut pas être inférieure à 25% de la durée globale du contrat (cette quotité de formation est calculée sur la base de la durée légale annuelle de travail, soit 1 607 heures, sauf aménagements spécifiques en cas de pratique du sport à haut niveau ou reconnaissance de handicap).",
    example: "400",
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
