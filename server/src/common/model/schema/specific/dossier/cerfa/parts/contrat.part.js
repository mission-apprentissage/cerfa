const modeContractuelSchema = require("./modeContractuel.part");
const typeContratSchema = require("./typeContrat.part");
const typeDerogationSchema = require("./typeDerogation.part");
const remunerationAnnuelleSchema = require("./remunerationAnnuelle.part");

const numContratChecks = {
  example: "02B202212000000",
  mask: "DEP Y M N 0000",
  maskBlocks: [
    {
      name: "D",
      mask: "MaskedEnum",
      placeholderChar: "_",
      enum: ["0", "9"],
      maxLength: 1,
    },
    {
      name: "E",
      mask: "MaskedRange",
      placeholderChar: "_",
      from: 0,
      to: 9,
      maxLength: 1,
    },
    {
      name: "P",
      mask: "MaskedEnum",
      placeholderChar: "_",
      enum: ["A", "B", "a", "b", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      maxLength: 1,
    },
    {
      name: "Y",
      mask: "MaskedRange",
      placeholderChar: "_",
      from: 1900,
      to: 2999,
      maxLength: 4,
    },
    {
      name: "M",
      mask: "MaskedRange",
      placeholderChar: "_",
      from: 1,
      to: 12,
      maxLength: 2,
    },
    {
      name: "N",
      mask: "MaskedEnum",
      placeholderChar: "_",
      enum: ["NC", "nc", ...new Array(100).fill().map((e, i) => (i < 10 ? `0${i}` : `${i}`))],
      maxLength: 2,
    },
  ],

  validate: {
    validator: function (v) {
      if (!v) return true;
      return /^(0[0-9][0-9]|02[ABab]|9[012345]|97[12346])([0-9]{4})([0-1][0-9])((NC|nc)|[0-9]{2})([0-9]{4})$/.test(v);
    },
    message: (props) => `${props.value} n'est pas un numéro valide`,
  },
  pattern: "^(0[0-9][0-9]|02[ABab]|9[012345]|97[12346])([0-9]{4})([0-1][0-9])((NC|nc)|[0-9]{2})([0-9]{4})$",
  validateMessage: `n'est pas un numéro valide`,
};

const contratSchema = {
  modeContractuel: {
    path: "contrat.modeContractuel",
    ...modeContractuelSchema,
    default: null,
    label: "Mode contratctuel",
    requiredMessage: "le mode de contrat est obligatoire",
  },
  typeContratApp: {
    path: "contrat.typeContratApp",
    ...typeContratSchema,
    default: null,
    required: function () {
      return !this.draft;
    },
    label: "Type de contrat ou d'avenant",
    requiredMessage: "le type de contrat ou d'avenant est obligatoire",
  },
  numeroContratPrecedent: {
    path: "contrat.numeroContratPrecedent",
    type: String,
    description: "N° du contrat précédent (suite de contrat)",
    label: "Numéro du contrat précédent ou du contrat sur lequel porte l'avenant :",
    labelAvenant: "Numéro de contrat sur lequel porte l'avenant :",
    labelSuccession: "Numéro du contrat précédent :",
    requiredMessage: "la numéro du contrat précédent est obligatoire",
    nullable: true,
    default: null,
    ...numContratChecks,
  },
  noContrat: {
    path: "contrat.noContrat",
    type: String,
    description: "Numéro DECA de contrat",
    nullable: true,
    ...numContratChecks,
  },
  noAvenant: {
    path: "contrat.noAvenant",
    type: String,
    description: "Numéro d'Avenant",
    nullable: true,
    ...numContratChecks,
  },
  dateDebutContrat: {
    path: "contrat.dateDebutContrat",
    type: Date,
    description: "Date de début d'éxécution du contrat",
    label: "Date de début d'exécution du contrat :",
    requiredMessage: "la date de début d'exécution de contrat est obligatoire",
    example: "2021-02-01T00:00:00+0000",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dateFinContrat: {
    path: "contrat.dateFinContrat",
    type: Date,
    description: "Date de fin du contrat prévue",
    label: "Date de fin du contrat ou de la période d'apprentissage :",
    requiredMessage: "la date de fin de contrat est obligatoire",
    example: "2021-02-28T00:00:00+0000",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dureeContrat: {
    path: "contrat.dureeContrat",
    type: Number,
    default: null,
    required: function () {
      return !this.draft;
    },
    description: "Durée du contrat en mois [calculé]",
  },
  dateEffetAvenant: {
    path: "contrat.dateEffetAvenant",
    type: Date,
    description: "Date d'effet d'avenant",
    label: "Date d'effet d'avenant :",
    requiredMessage: "S'agissant d'un avenant sa date d'effet est obligatoire ",
    nullable: true,
    default: null,
    example: "2021-03-01T00:00:00+0000",
  },
  dateConclusion: {
    path: "contrat.dateConclusion",
    type: Date,
    description: "Date de conclusion du contrat. (Date de signature du présent contrat)",
    label: "Date de conclusion du contrat :",
    requiredMessage: "La date de conclusion de contrat est obligatoire",
    example: "2021-01-15T00:00:00+0000",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dateRupture: {
    path: "contrat.dateRupture",
    type: Date,
    description: "Date de rupture du contrat",
    nullable: true,
    example: "2021-02-28T00:00:00+0000",
  },
  lieuSignatureContrat: {
    path: "contrat.lieuSignatureContrat",
    type: String,
    description: "Lieu de signature du contrat",
    label: "Lieu de signature du contrat:",
    requiredMessage: "Le lieu de signature est obligatoire",
    example: "PARIS",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  typeDerogation: {
    path: "contrat.typeDerogation",
    ...typeDerogationSchema,
    label: "Type de dérogation (optionnel)",
    isNotRequiredForm: true,
  },
  dureeTravailHebdoHeures: {
    path: "contrat.dureeTravailHebdoHeures",
    type: Number,
    description: "Durée hebdomadaire du travail (heures)",
    requiredMessage: "la durée hebdomadaire de travail est obligatoire",
    label: "Heures:",
    example: 37,
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dureeTravailHebdoMinutes: {
    path: "contrat.dureeTravailHebdoMinutes",
    type: Number,
    description: "Durée hebdomadaire du travail (minutes)",
    label: "Minutes:",
    example: 30,
    default: null,
    isNotRequiredForm: true,
  },
  travailRisque: {
    path: "contrat.travailRisque",
    type: Boolean,
    description: "Travaille sur machines dangereuses ou exposition à des risques particuliers",
    requiredMessage: "Cette déclaration est obligatoire",
    default: null,
    required: function () {
      return !this.draft;
    },
    label: "Travail sur machines dangereuses ou exposition à des risques particuliers: ",
    example: "Oui",
    options: [
      {
        label: "Oui",
        value: true,
      },
      {
        label: "Non",
        value: false,
      },
    ],
  },
  caisseRetraiteComplementaire: {
    path: "contrat.caisseRetraiteComplementaire",
    type: String,
    description: "Caisse de retraite complémentaire",
    label: "Caisse de retraite complémentaire :",
    example: "",
    default: null,
    isNotRequiredForm: true,
  },
  avantageNature: {
    path: "contrat.avantageNature",
    requiredMessage: "Cette déclaration est obligatoire",
    type: Boolean,
    default: null,
    required: function () {
      return !this.draft;
    },
    description: "L'apprenti(e) bénéficie d'avantages en nature",
    label: "L'apprenti(e) bénéficie d'avantages en nature",
    example: "Oui",
    options: [
      {
        label: "Oui",
        value: true,
      },
      {
        label: "Non",
        value: false,
      },
    ],
  },
  avantageNourriture: {
    path: "contrat.avantageNourriture",
    type: Number,
    description: "Nourriture €/repas",
    label: "Nourriture:",
    nullable: true,
    default: null,
    example: 3,
    // required: function () {
    //   return this.contrat.avantageNature && (!this.contrat.avantageLogement || !this.contrat.autreAvantageEnNature);
    // },
    requiredMessage: "Cette déclaration est obligatoire",
    isNotRequiredForm: true,
    mask: "X € / rep\\as",
    maskBlocks: [
      {
        name: "X",
        mask: "Number",
        signed: true, // disallow negative
        normalizeZeros: true, // appends or removes zeros at ends
        max: 10000,
      },
    ],
  },
  avantageLogement: {
    path: "contrat.avantageLogement",
    type: Number,
    description: "Logement €/mois",
    label: "Logement:",
    nullable: true,
    default: null,
    example: 456,
    // required: function () {
    //   return this.contrat.avantageNature;
    // },
    isNotRequiredForm: true,
    mask: "X € / mois",
    maskBlocks: [
      {
        name: "X",
        mask: "Number",
        signed: true, // disallow negative
        normalizeZeros: true, // appends or removes zeros at ends
        max: 10000,
      },
    ],
  },
  autreAvantageEnNature: {
    path: "contrat.autreAvantageEnNature",
    type: Boolean,
    description: "Autre avantage en nature",
    label: "Autres avantages",
    nullable: true,
    default: null,
    example: true,
    // required: function () {
    //   return this.contrat.avantageNature;
    // },
    options: [
      {
        label: "true",
        value: true,
      },
    ],
    isNotRequiredForm: true,
  },
  salaireEmbauche: {
    path: "contrat.salaireEmbauche",
    type: Number,
    description: "Salaire brut à l'embauche",
    label: "Salaire brut mensuel à l'embauche:",
    example: 1530,
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  smic: {
    type: {},
    description: "Smic en vigeur [calculé]",
    default: null,
  },
  remunerationMajoration: {
    path: "contrat.remunerationMajoration",
    enum: [0, 10, 20],
    type: Number,
    default: 0,
    isNotRequiredForm: true,
    description: "**Majoration de la rémunération** :\r\n<br />Aucune\r\n<br />10%\r\n<br />20%",
    label: "L'employeur souhaite appliquer un majoration à la rémunération :",
    options: [
      {
        label: "Aucune",
        value: 0,
      },
      {
        label: "10%",
        value: 10,
      },
      {
        label: "20%",
        value: 20,
      },
    ],
  },
  remunerationsAnnuelles: {
    type: [
      {
        ...remunerationAnnuelleSchema,
      },
    ],
  },
};

module.exports = contratSchema;
