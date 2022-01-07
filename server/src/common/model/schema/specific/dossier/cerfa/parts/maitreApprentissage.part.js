const maitreApprentissageSchema = {
  nom: {
    maxLength: 80,
    type: String,
    description: "Nom (Nom de naissance/ patronymique) du maitre d'apprentissage",
    label: "Nom de naissance:",
    example: "Dupont",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  prenom: {
    maxLength: 80,
    type: String,
    description: "Prénom du maitre d'apprentissage",
    label: "Prénom:",
    example: "Claire",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dateNaissance: {
    type: Date,
    description: "Date de naissance  de l'apprenti",
    label: "Date de naissance :",
    example: "1988-02-02T00:00:00+0000",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
};

module.exports = maitreApprentissageSchema;
