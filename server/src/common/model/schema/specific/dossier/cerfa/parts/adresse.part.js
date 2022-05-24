const adresseSchema = {
  numero: {
    type: Number,
    description: "N° de la voie",
    nullable: true,
    example: 13,
    default: null,
    pattern: "^(?!0{1})[0-9]*$",
  },
  repetitionVoie: {
    type: String,
    description: "Indice de répétition du numéro de voie",
    nullable: true,
    example: "BIS",
    default: null,
    enum: [null, "B", "T", "Q", "C"],
  },
  voie: {
    type: String,
    description: "Nom de voie",
    nullable: true,
    example: "Boulevard de la liberté",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  complement: {
    type: String,
    description: "Complément d'adresse",
    nullable: true,
    default: null,
    example: "Bâtiment ; Résidence ; Entrée ; Appartement ; Escalier ; Etage",
  },
  codePostal: {
    maxLength: 5,
    minLength: 5,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /^[0-9]{5}$/.test(v);
      },
      message: (props) => `${props.value} n'est pas un code postal valide`,
    },
    type: String,
    description: "Code postal",
    pattern: "^[0-9]{5}$",
    example: "75000",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  commune: {
    maxLength: 80,
    type: String,
    description: "Commune",
    example: "PARIS",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
};
module.exports = adresseSchema;
