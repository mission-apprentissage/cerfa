const diplomeSchema = require("./diplome.part");

const formationSchema = {
  rncp: {
    maxLength: 9,
    type: String,
    description: `Le code RNCP peut être recherché sur [le site France compétences.](https://www.francecompetences.fr/recherche_certificationprofessionnelle/) Le code diplôme peut être déduit du code RNCP et à l'inverse, vous pouvez renseigner un code diplôme pour déduire le code RNCP correspondant.`,
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
    mask: "RNCPX",
    unmask: false,
    maskBlocks: [
      {
        name: "X",
        mask: "Pattern",
        pattern: "^\\d*$",
      },
    ],
  },
  codeDiplome: {
    maxLength: 8,
    type: String,
    default: null,
    description: `Ce code à 8 caractères permet d'identifier un titre ou diplôme préparé par la voie de l'apprentissage, plus d'informations sur [le site du ministère de l'Education Nationale.](https://www.education.gouv.fr/codification-des-formations-et-des-diplomes-11270) Le code diplôme peut être recherché sur [le catalogue des formations en apprentissage.](https://catalogue.apprentissage.beta.gouv.fr/) Le code diplôme peut être déduit du code RNCP et à l'inverse, vous pouvez renseigner un code diplôme pour déduire le code RNCP correspondant.`,
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
    label: "Diplôme ou titre visé par l'apprenti :",
    example: 74,
    requiredMessage: "Le diplôme ou titre visé est obligatoire",
    validateMessage: ` n'est pas un diplôme ou titre valide`,
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  intituleQualification: {
    maxLength: 255,
    type: String,
    description: "Intitulé précis du diplôme ou titre visé par l'Alternant",
    label: "Intitulé précis :",
    example: "PRODUCTION ET SERVICE EN RESTAURATION (RAPIDE, COLLECTIVE, CAFETERIA) (CAP)",
    requiredMessage: "L'intitulé du diplôme ou titre est obligatoire",
    validateMessage: ` n'est pas un intitulé valide`,
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dateDebutFormation: {
    type: Date,
    description: `Il faut renseigner la date effective à laquelle l'apprenti débute sa formation, même si l'apprenti a démarré la formation sous le statut "stagiaire de la formation professionnelle".`,
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
    description:
      "Lorsque la date précise n'est pas connue, il est possible de renseigner une date prévisionnelle avec une marge de 2 mois maximum.",
    label: "Date prévue de fin des épreuves ou examens : ",
    example: "18/11/2021",
    requiredMessage: "la date de fin de cycle est obligatoire",
    validateMessage: ` n'est pas une date valide`,
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
    label: "Durée de la formation en heures :",
    example: "400",
    requiredMessage: "Le nombre d'heures de la formation est obligatoire",
    validateMessage: ` n'est pas un nombre d'heures valide`,
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
