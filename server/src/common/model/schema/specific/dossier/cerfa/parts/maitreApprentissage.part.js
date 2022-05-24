const maitreApprentissageSchema = {
  nom: {
    maxLength: 80,
    type: String,
    description:
      "Le nom et le prénom doivent strictement correspondre à l'identité officielle du salarié (attention aux inversions).",
    example: "Dupont",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  prenom: {
    maxLength: 80,
    type: String,
    description:
      "Le nom et le prénom doivent strictement correspondre à l'identité officielle du salarié (attention aux inversions).",
    example: "Claire",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dateNaissance: {
    type: Date,
    description: "Le maître d'apprentissage doit être majeur à la date d'exécution du contrat.",
    example: "1988-02-02T00:00:00+0000",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
};

module.exports = maitreApprentissageSchema;
