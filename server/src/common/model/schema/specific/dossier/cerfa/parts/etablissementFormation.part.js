const adresseSchema = require("./adresse.part");

const etablissementFormationSchema = {
  memeResponsable: {
    type: Boolean,
    description: "",
    example: false,
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  denomination: {
    // maxLength: 80,
    type: String,
    description: "Nom du lieu de formation",
    example: "CFA",
    default: null,
    required: function () {
      return !this.draft;
    },
    nullable: true,
  },
  siret: {
    maxLength: 14,
    minLength: 14,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /^([0-9]{14})$/.test(v);
      },
      message: (props) => `${props.value} n'est pas un siret valide`,
    },
    type: String,
    description: "N° SIRET du lieu de formation",
    default: null,
    nullable: function () {
      return this.draft;
    },
    example: "98765432400019",
    pattern: "^([0-9]{14})$",
  },
  uaiCfa: {
    maxLength: 8,
    minLength: 8,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /^[0-9]{7}[a-zA-Z]$/.test(v);
      },
      message: (props) => `${props.value} n'est pas un UAI valide`,
    },
    type: String,
    description: `Le numéro UAI est autocomplété ; il peut être recherché sur [le catalogue des formations en apprentissage.](https://catalogue.apprentissage.beta.gouv.fr/)`,
    example: "0561910X",
    pattern: "^[0-9]{7}[a-zA-Z]$",
    default: null,
    nullable: function () {
      return this.draft;
    },
  },

  adresse: {
    ...adresseSchema,
  },
};
module.exports = etablissementFormationSchema;
