const adresseSchema = {
  numero: {
    type: Number,
    description: "N°",
    required: true,
    nullable: true,
    example: 13,
    default: 0,
  },
  voie: {
    type: String,
    description: "Nom de voie",
    nullable: true,
    example: "Boulevard de la liberté",
    default: null,
    required: true,
  },
  complement: {
    type: String,
    description: "Complément d'adresse",
    nullable: true,
    default: null,
    required: true,
    example: "Etage 6 - Appartement 654",
  },
  label: {
    maxLength: 50,
    type: String,
    description: "Libellé complet de l’adresse",
    nullable: true,
    default: null,
    required: true,
    example: "13 Boulevard de la liberté",
  },
  codePostal: {
    maxLength: 5,
    minLength: 5,
    validate: {
      validator: function (v) {
        return /^[0-9]{5}$/.test(v);
      },
      message: (props) => `${props.value} n'est pas un code postal valide`,
    },
    type: String,
    description: "Code postal",
    example: "75000",
    default: null,
    required: true,
  },
  commune: {
    maxLength: 80,
    type: String,
    description: "Commune",
    example: "PARIS",
    default: null,
    required: true,
  },
};
module.exports = adresseSchema;
