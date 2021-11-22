const modeContractuelSchema = require("./modeContractuel");
const typeContratSchema = require("./typeContrat");
const typeDerogationSchema = require("./typeDerogation");
const remunerationAnnuelleSchema = require("./remunerationAnnuelle");

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
  },
  numeroContratPrecedent: {
    type: String,
    description: "N° du contrat précédent (suite de contrat)",
    nullable: true,
    example: "11111111111",
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
    example: "2021-02-01T00:00:00+0000",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dateEffetAvenant: {
    type: Date,
    description: "Date d'effet d'avenant",
    nullable: true,
    example: "2021-03-01T00:00:00+0000",
  },
  dateConclusion: {
    type: Date,
    description: "Date de conclusion du contrat",
    example: "2021-01-15T00:00:00+0000",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dateFinContrat: {
    type: Date,
    description: "Date de fin du contrat prévue",
    example: "2021-02-28T00:00:00+0000",
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
    example: "PARIS",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  typeDerogation: {
    ...typeDerogationSchema,
  },
  dureeTravailHebdoHeures: {
    type: Number,
    description: "Durée hebdomadaire du travail (heures)",
    example: 37,
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dureeTravailHebdoMinutes: {
    type: Number,
    description: "Durée hebdomadaire du travail (minutes)",
    example: 30,
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  travailRisque: {
    type: Boolean,
    description: "Travaille sur machines dangereuses ou exposition à des risques particuliers",
    example: true,
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  salaireEmbauche: {
    type: Number,
    description: "Salaire brut à l'embauche",
    example: 1530,
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  avantageNourriture: {
    type: Number,
    description: "Nourriture €/repas",
    nullable: true,
    example: 3,
  },
  avantageLogement: {
    type: Number,
    description: "Logement €/mois",
    nullable: true,
    example: 456,
  },
  autreAvantageEnNature: {
    type: Boolean,
    description: "Autre avantage en nature",
    nullable: true,
    example: true,
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
