const adresseSchema = require("./adresse");

const organismeFormationSchema = {
  denomination: {
    maxLength: 80,
    type: String,
    description: "Nom de l'organisme de formation responsable",
    example: "CFA",
    default: null,
    required: true,
  },
  formationInterne: {
    type: Boolean,
    description: "Est un service de formation en interne (CFA d'entreprise)",
    default: null,
    required: true,
  },
  raison_sociale: {
    type: String,
    default: null,
    example: "CFAA",
    description: "Raison sociale de l'organisme de formation responsable",
  },
  siret: {
    maxLength: 14,
    minLength: 14,
    validate: {
      validator: function (v) {
        return /^([0-9]{14}|[0-9]{9} [0-9]{4})$/.test(v);
      },
      message: (props) => `${props.value} n'est pas un siret valide`,
    },
    type: String,
    description: "N° SIRET de l'organisme de formation responsable",
    default: null,
    example: "98765432400019",
    required: true,
    pattern: "^([0-9]{14}|[0-9]{9} [0-9]{4})$",
  },
  uaiCfa: {
    maxLength: 8,
    minLength: 8,
    validate: {
      validator: function (v) {
        return /^[0-9]{7}[a-zA-Z]$/.test(v);
      },
      message: (props) => `${props.value} n'est pas un UAI valide`,
    },
    type: String,
    description: "N° UAI de l'organisme de formation responsable",
    default: null,
    required: true,
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
