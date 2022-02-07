const adresseSchema = require("./adresse.part");

const organismeFormationSchema = {
  denomination: {
    // maxLength: 80,
    type: String,
    description: "Nom de l'organisme de formation responsable",
    label: "Dénomination du CFA responsable :",
    requiredMessage: "la dénomination du CFA responsable est obligatoire",
    example: "CFA",
    default: null,
    required: function () {
      return !this.draft;
    },
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^.*$",
      },
    ],
  },
  formationInterne: {
    type: Boolean,
    description: "Est un service de formation en interne (CFA d'entreprise)",
    default: false,
    required: function () {
      return !this.draft;
    },
    label: "Le centre de formation est-il un CFA d'entreprise ?",
    requiredMessage: "Merci de préciser s'il sagit d'un CFA d'entreprise",
    example: "Non",
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
  // raison_sociale: {
  //   type: String,
  //   default: null,
  //   example: "CFAA",
  //   description: "Raison sociale de l'organisme de formation responsable",
  // },
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
    description: "N° SIRET de l'organisme de formation responsable",
    default: null,
    required: function () {
      return !this.draft;
    },
    nullable: function () {
      return this.draft;
    },
    example: "98765432400019",
    label: "N° SIRET CFA :",
    requiredMessage: "Le siret est obligatoire",
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
    description: "N° UAI de l'organisme de formation responsable",
    example: "0561910X",
    label: "N° UAI du CFA :",
    requiredMessage: "Le N° UAI de l'organisme est obligatoire",
    validateMessage: `n'est pas un uai valide`,
    pattern: "^[0-9]{7}[a-zA-Z]$",
    default: null,
    nullable: function () {
      return this.draft;
    },
    required: function () {
      return !this.draft;
    },
  },
  visaCfa: {
    type: Boolean,
    description: "Est visé par l'organisme de formation responsable",
    nullable: true,
  },

  adresse: {
    ...adresseSchema,
  },
};
module.exports = organismeFormationSchema;
