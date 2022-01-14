const modeContractuelSchema = require("./modeContractuel.part");
const typeContratSchema = require("./typeContrat.part");
const typeDerogationSchema = require("./typeDerogation.part");
const remunerationAnnuelleSchema = require("./remunerationAnnuelle.part");

const contratSchema = {
  modeContractuel: {
    ...modeContractuelSchema,
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  typeContratApp: {
    ...typeContratSchema,
    default: null,
    required: function () {
      return !this.draft;
    },
    label: "Type de contrat ou d'avenant",
  },
  numeroContratPrecedent: {
    type: String,
    description: "N° du contrat précédent (suite de contrat)",
    nullable: true,
    default: null,
    example: "11111111111",
    label: "Numéro du contrat précédent ou du contrat sur lequel porte l'avenant :",
  },
  noContrat: {
    type: String,
    description: "Numéro DECA de contrat",
    nullable: true,
    example: "222222222222",
  },
  noAvenant: {
    type: String,
    description: "Numéro d'Avenant",
    nullable: true,
    example: "3333333333",
  },
  dateDebutContrat: {
    type: Date,
    description: "Date de début d'éxécution du contrat",
    label: "Date de début d'exécution du contrat :",
    example: "2021-02-01T00:00:00+0000",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dateFinContrat: {
    type: Date,
    description: "Date de fin du contrat prévue",
    label: "Date de fin du contrat ou de la période d'apprentissage :",
    example: "2021-02-28T00:00:00+0000",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dureeContrat: {
    type: Number,
    default: null,
    required: function () {
      return !this.draft;
    },
    description: "Durée du contrat en mois [calculé]",
  },
  dateEffetAvenant: {
    type: Date,
    description: "Date d'effet d'avenant",
    label: "Date d'effet d'avenant :",
    nullable: true,
    default: null,
    example: "2021-03-01T00:00:00+0000",
  },
  dateConclusion: {
    type: Date,
    description: "Date de conclusion du contrat",
    label: "Date de conclusion du contrat :",
    example: "2021-01-15T00:00:00+0000",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dateRupture: {
    type: Date,
    description: "Date de rupture du contrat",
    nullable: true,
    example: "2021-02-28T00:00:00+0000",
  },
  lieuSignatureContrat: {
    type: String,
    description: "Lieu de signature du contrat",
    label: "Lieu de signature du contrat:",
    example: "PARIS",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  typeDerogation: {
    ...typeDerogationSchema,
    label: "Type de dérogation (optionnel)",
    isNotRequiredForm: true,
  },
  dureeTravailHebdoHeures: {
    type: Number,
    description: "Durée hebdomadaire du travail (heures)",
    label: "Heures:",
    example: 37,
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dureeTravailHebdoMinutes: {
    type: Number,
    description: "Durée hebdomadaire du travail (minutes)",
    label: "Minutes:",
    example: 30,
    default: null,
    isNotRequiredForm: true,
  },
  travailRisque: {
    type: Boolean,
    description: "Travaille sur machines dangereuses ou exposition à des risques particuliers",
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
    type: String,
    description: "Caisse de retraite complémentaire",
    label: "Caisse de retraite complémentaire :",
    example: "",
    default: null,
    isNotRequiredForm: true,
  },
  avantageNature: {
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
    type: Number,
    description: "Nourriture €/repas",
    label: "Nourriture:",
    nullable: true,
    default: null,
    example: 3,
    required: function () {
      return this.contrat.avantageNature;
    },
    isNotRequiredForm: true,
  },
  avantageLogement: {
    type: Number,
    description: "Logement €/mois",
    label: "Logement:",
    nullable: true,
    default: null,
    example: 456,
    required: function () {
      return this.contrat.avantageNature;
    },
    isNotRequiredForm: true,
  },
  autreAvantageEnNature: {
    type: Boolean,
    description: "Autre avantage en nature",
    label: "Autres avantages",
    nullable: true,
    default: null,
    example: true,
    required: function () {
      return this.contrat.avantageNature;
    },
    options: [
      {
        label: "true",
        value: true,
      },
    ],
    isNotRequiredForm: true,
  },
  salaireEmbauche: {
    type: Number,
    description: "Salaire brut à l'embauche",
    label: "Salaire brut mensuel à l'embauche:",
    example: 1530,
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  remunerationMajoration: {
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
