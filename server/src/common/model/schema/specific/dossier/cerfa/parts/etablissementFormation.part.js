const adresseSchema = require("./adresse.part");

const etablissementFormationSchema = {
  memeResponsable: {
    type: Boolean,
    description: "Le lieu de formation est le même que l'organisme responsable",
    example: false,
    default: null,
    required: function () {
      return !this.draft;
    },
    label: "Le lieu de formation est le même que l'organisme responsable",
    options: [
      {
        label: "Oui",
        value: true,
      },
      {
        label: "Non",
        value: false,
      },
    ],
  },
  denomination: {
    // maxLength: 80,
    type: String,
    description: "Nom du lieu de formation",
    label: "Dénomination du lieu de formation :",
    requiredMessage: "la dénomination du du lieu de formation est obligatoire",
    example: "CFA",
    default: null,
    required: function () {
      return !this.draft;
    },
    nullable: true,
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^.*$",
      },
    ],
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
    isNotRequiredForm: true,
    example: "98765432400019",
    label: "N° SIRET du lieu de formation :",
    validateMessage: `n'est pas un siret valide`,
    pattern: "^([0-9]{14})$",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^\\d*$",
      },
    ],
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
    isNotRequiredForm: true,
    description: `Le numéro UAI est autocomplété ; il peut être recherché sur [le catalogue des formations en apprentissage.](https://catalogue.apprentissage.beta.gouv.fr/)`,
    example: "0561910X",
    label: "N° UAI du CFA :",
    validateMessage: `n'est pas un uai valide`,
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
