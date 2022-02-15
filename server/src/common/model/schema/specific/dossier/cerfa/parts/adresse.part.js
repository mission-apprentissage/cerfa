const adresseSchema = {
  numero: {
    type: Number,
    description: "N° de la voie",
    label: "N° :",
    isNotRequiredForm: true,
    nullable: true,
    example: 13,
    default: null,
    pattern: "^(?!0{1})[0-9]*$",
    validateMessage: `le numéro de voie ne peut pas commencer par zéro`,
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^\\d*$",
      },
    ],
  },
  voie: {
    type: String,
    description: "Nom de voie",
    label: "Voie :",
    requiredMessage: "le nom de voie est obligatoire",
    nullable: true,
    example: "Boulevard de la liberté",
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
  complement: {
    type: String,
    description: "Complément d'adresse",
    label: "Complément d'adresse (optionnel):",
    requiredMessage: "le complement d'adress est obligatoire",
    nullable: true,
    default: null,
    isNotRequiredForm: true,
    example: "Etage 6 - Appartement 654",
  },
  // label: {
  //   maxLength: 50,
  //   type: String,
  //   description: "Libellé complet de l’adresse",
  //   nullable: true,
  //   default: null,
  //   required: function () {
  //     return !this.draft;
  //   },
  //   example: "13 Boulevard de la liberté",
  // },
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
    label: "Code postal :",
    requiredMessage: "Le code postal est obligatoire",
    validateMessage: `n'est pas un code postal valide`,
    pattern: "^[0-9]{5}$",
    example: "75000",
    default: null,
    required: function () {
      return !this.draft;
    },
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^\\d*$",
      },
    ],
  },
  commune: {
    maxLength: 80,
    type: String,
    description: "Commune",
    label: "Commune: ",
    requiredMessage: "la commune est obligatoire",
    example: "PARIS",
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
};
module.exports = adresseSchema;
