const maitreApprentissageSchema = {
  nom: {
    maxLength: 80,
    type: String,
    description: "Nom (Nom de naissance/ patronymique) du maître d'apprentissage",
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
    description: "Prénom du maitre d'apprentissage",
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
    description: "Date de naissance  de l'apprenti",
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
