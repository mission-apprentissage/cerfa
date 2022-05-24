const adresseSchema = require("./adresse.part");

const organismeFormationSchema = {
  denomination: {
    // maxLength: 80,
    type: String,
    description: "Nom de l'organisme de formation responsable",
    example: "CFA",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  formationInterne: {
    type: Boolean,
    description:
      "Un CFA d'entreprise est interne à l’entreprise ou constitué par plusieurs entreprises partageant des perspectives communes d’évolution des métiers ou qui interviennent dans des secteurs d’activité complémentaires.",
    default: false,
    required: function () {
      return !this.draft;
    },
    example: "Non",
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
    description:
      "Vous devez renseigner le siret du CFA responsable. Le lieu principal de formation sera quant-à lui précisé dans la convention de formation. Le siret comporte 14 chiffres. Il doit être présent et actif dans la base Entreprises de l'INSEE (regroupant employeurs privés et publics).",
    default: null,
    required: function () {
      return !this.draft;
    },
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
