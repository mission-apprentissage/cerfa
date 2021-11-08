const sampleSchema = {
  id: {
    type: Number,
    default: null,
    description: "Identifiant de l'entité d'exemple",
  },
  nom: {
    type: String,
    default: null,
    description: "Nom de l'entité d'exemple",
  },
  valeur: {
    type: String,
    default: null,
    description: "Valeur de test",
  },
};
module.exports = sampleSchema;
