const maitreApprentissageSchema = {
  nom: {
    maxLength: 80,
    type: String,
    description:
      "Le nom et le prénom doivent strictement correspondre à l'identité officielle du salarié (attention aux inversions).",
    label: "Nom de naissance:",
    requiredMessage: "le nom du maître d'apprentissage est obligatoire",
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
    label: "Prénom:",
    requiredMessage: "le prénom du maître d'apprentissage est obligatoire",
    example: "Claire",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dateNaissance: {
    type: Date,
    description: "Le maître d'apprentissage doit être majeur à la date d'exécution du contrat.",
    label: "Date de naissance :",
    requiredMessage: "la date de naissance du maître d'apprentissage est obligatoire",
    example: "1988-02-02T00:00:00+0000",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
};

module.exports = maitreApprentissageSchema;
