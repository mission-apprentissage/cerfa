const remunerationAnnuelleSchema = {
  dateDebut: {
    type: Date,
    description:
      "Date de début d'exécution du contrat d'apprentissage pour l'année considérée ou date de début de la seconde période si l'apprenti change de tranche d'âge au cours de l'année, quelle que soit la date de début du cycle de formation",
    example: "2021-02-01T00:00:00+0000",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dateFin: {
    type: Date,
    description:
      "Date de fin d'exécution du contrat d'apprentissage pour l'année considérée ou date à laquelle l'apprenti change de tranche d'âge et de rémunération, quelle que soit la date de début du cycle de formation",
    example: "2021-02-28T00:00:00+0000",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  taux: {
    type: Number,
    description:
      "Taux du SMIC ou SMC applicable pour définir la rémunération de l'apprenti, en fonction de l'âge de l'apprent et de l'année d'exécution du contrat, voir notice (grille de rémunération minimale)",
    example: 75,
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  tauxMinimal: {
    type: Number,
    description: "Seuil légal en %",
    example: 57,
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  typeSalaire: {
    enum: ["SMIC", "SMC"],
    type: String,
    default: null,
    required: function () {
      return !this.draft;
    },
    description: `**Type de salaire** :\r\n  SMIC = salaire minimum de croissance\r\n  SMC = salaire minimum conventionnel`,
  },
  salaireBrut: {
    type: Number,
    description: "Salaire brut [Calculé]",
    example: 75,
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  ordre: {
    type: String,
    description: "Ordre des rémunérations annuelles",
    example: "1.1, 1.2, 2.1",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
};

module.exports = remunerationAnnuelleSchema;
