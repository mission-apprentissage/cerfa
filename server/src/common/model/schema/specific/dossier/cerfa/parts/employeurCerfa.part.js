const adresseSchema = require("./adresse.part");
const idccEnum = require("./idcc.part");
const departementEnum = require("./departements.part");

const employeurCerfaSchema = {
  denomination: {
    // maxLength: 80,
    type: String,
    label: "Dénomination :",
    description: "La dénomination sociale doit être celle de l'établissement dans lequel le contrat s'exécute.",
    requiredMessage: "La dénomination de l'employeur est obligatoire",
    example: "ENERGIE 3000",
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
  raison_sociale: {
    type: String,
    default: null,
    example: "OCTO-TECHNOLOGY",
    description: "Raison sociale de l'employeur",
    label: "Raison sociale de l'employeur :",
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
      "Vous devez renseigner le siret correspondant à l'établissement du lieu d'exécution du contrat (il ne correspond pas forcément au siège). Le siret comporte 14 chiffres. <br/> Il doit être présent et actif dans la base Entreprises de l'INSEE (regroupant employeurs privés et publics).",
    default: null,
    nullable: function () {
      return this.draft;
    },
    required: function () {
      return !this.draft;
    },
    example: "98765432400019",
    label: "N° SIRET de l'employeur :",
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
  naf: {
    maxLength: 6,
    type: String,
    default: null,
    required: function () {
      return !this.draft;
    },
    description: "Code NAF de l'employeur",
    label: "Code NAF de l'employeur :",
    requiredMessage: "le code NAF est obligatoire",
    example: "1031Z",
    pattern: "^([0-9]){2}\\.?([0-9]){0,2}([a-zA-Z]){0,1}$",
    validateMessage: `le code NAF n'est pas au bon format`,
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^([0-9]{1,2})\\.?([0-9A-Za-z]{0,3})$",
      },
    ],
  },
  nombreDeSalaries: {
    type: Number,
    required: function () {
      return !this.draft;
    },
    default: null,
    description:
      "L'effectif salarié rempli automatiquement correspond à l'estimation de la base Entreprises de l'INSEE. <br/>L'effectif renseigné est celui de l’entreprise dans sa globalité (et non seulement l’effectif de l’établissement d’exécution du contrat).",
    label: "Effectif salarié de l'entreprise :",
    requiredMessage: "Effectif salarié de l'entreprise est obligatoire",
    example: 123,
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^\\d*$",
      },
    ],
  },
  codeIdcc: {
    enum: [null, ...idccEnum.map(({ code }) => code)],
    maxLength: 4,
    type: String,
    default: null,
    required: function () {
      return !this.draft;
    },
    description: "Code IDCC de la convention collective appliquée",
    label: "Code IDCC de la convention collective appliquée : ",
    requiredMessage: "le code idcc est obligatoire",
    example: "9999",
    pattern: "^[0-9]{4}$",
    validateMessage: `le code IDCC n'est pas au bon format`,
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^\\d*$",
      },
    ],
  },
  libelleIdcc: {
    enum: [null, ...idccEnum.map(({ libelle }) => libelle)],
    maxLength: 500,
    default: null,
    type: String,
    description: "Libellé de la convention collective appliquée",
    label: "Libellé de la convention collective appliquée:",
    requiredMessage: "Le libellé de la convention collective est obligatoire",
    nullable: true,
    isNotRequiredForm: true,
    example:
      "Convention collective nationale des entreprises de commission, de courtage et de commerce intracommunautaire et d'importation-exportation de France métropolitaine",
  },
  telephone: {
    maxLength: 13,
    minLength: 10,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /([+])?((\d)[.-]?)?[\s]?\(?(\d{3})\)?[.-]?[\s]?(\d{3})[.-]?[\s]?(\d{4,})/.test(v);
      },
      message: (props) => `${props.value} n'est pas un numéro de télephone valide`,
    },
    default: null,
    required: function () {
      return !this.draft;
    },
    type: String,
    description: `Dans le cas d'un numéro français, il n'est pas nécessaire de saisir le "0" car l'indicateur pays est pré-renseigné.`,
    label: "Téléphone de l'employeur :",
    requiredMessage: "Le téléphone de l'employeur est obligatoire",
    example: "0908070605",
    // pattern: "^([+])?((d)[.-]?)?[s]?(?(d{3}))?[.-]?[s]?(d{3})[.-]?[s]?(d{4,})$",
  },
  courriel: {
    maxLength: 80,
    type: String,
    default: null,
    required: function () {
      return !this.draft;
    },
    description: "Ce courriel sera utilisé pour l'envoi des notifications pour le suivi du dossier.",
    label: "Courriel de l'employeur :",
    requiredMessage: "Le courriel de l'employeur est obligatoire",
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/.test(v);
      },
      message: (props) => `${props.value} n'est pas un courriel valide`,
    },
    example: "energie3000.pro@gmail.com",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^.*$",
      },
    ],
  },
  adresse: {
    ...adresseSchema,
    departement: {
      enum: [null, ...departementEnum.map((d) => d.replace(/^(0){1}/, ""))],
      maxLength: 3,
      minLength: 1,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^([0-9][0-9]|2[AB]|9[012345]|97[12346])$/.test(v);
        },
        message: (props) => `${props.value} n'est pas un departement valide`,
      },
      type: String,
      description: "Département de l'employeur",
      label: "Département de l'employeur :",
      example: "1 Ain, 99 Étranger",
      pattern: "^([0-9][0-9]|2[AB]|9[012345]|97[12346])$",
      requiredMessage: "le département de l'employeur est obligatoire",
      validateMessage: ` n'est pas un département valide`,
      default: null,
      nullable: true,
      required: function () {
        return !this.draft;
      },
    },
    region: {
      type: Number,
      description: "Région de l'employeur",
      label: "Région de l'employeur :",
      example: "93 Provence-Alpes-Côte d'Azur",
      requiredMessage: "la région de l'employeur est obligatoire",
      validateMessage: ` n'est pas une région valide`,
      default: null,
      nullable: true,
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
  },
  nom: {
    maxLength: 200,
    type: String,
    default: null,
    description: "Nom de l'employeur",
    label: "Nom de l'employeur :",
    nullable: true,
    example: "LEFEVBRE",
  },
  prenom: {
    maxLength: 50,
    type: String,
    description: "Prénom de l'employeur",
    label: "Prénom de l'employeur :",
    nullable: true,
    default: null,
    example: "MARTINE",
  },
  typeEmployeur: {
    required: function () {
      return !this.draft;
    },
    enum: [11, 12, 13, 14, 15, 16, 21, 22, 23, 24, 25, 26, 27, 28, 29],
    type: Number,
    nullable: true,
    default: null,
    label: "Type d'employeur :",
    requiredMessage: "le type d'employeur est obligatoire",
    description: "Le type d'employeur doit être en adéquation avec son statut juridique.",

    options: [
      // {
      //   name: "Privé",
      //   options: [
      //     {
      //       label:
      //         "11 Entreprise inscrite au répertoire des métiers ou au registre des entreprises pour l'Alsace-Moselle",
      //       value: 11,
      //     },
      //     {
      //       label: "12 Entreprise inscrite uniquement au registre du commerce et des sociétés",
      //       value: 12,
      //     },
      //     {
      //       label: "13 Entreprises dont les salariés relèvent de la mutualité sociale agricole",
      //       value: 13,
      //     },
      //     {
      //       label: "14 Profession libérale",
      //       value: 14,
      //     },
      //     {
      //       label: "15 Association",
      //       value: 15,
      //     },
      //     {
      //       label: "16 Autre employeur privé",
      //       value: 16,
      //     },
      //   ],
      // },
      {
        name: "Public",
        options: [
          {
            label:
              "21 Service de l'Etat (administrations centrales et leurs services déconcentrés de la fonction publique d'Etat)",
            value: 21,
          },

          {
            label: "22 Commune",
            value: 22,
          },
          {
            label: "23 Département",
            value: 23,
          },
          {
            label: "24 Région",
            value: 24,
          },
          {
            label: "25 Etablissement public hospitalier",
            value: 25,
          },
          {
            label: "26 Etablissement public local d'enseignement",
            value: 26,
          },
          {
            label: "27 Etablissement public administratif de l'Etat",
            value: 27,
          },
          {
            label:
              "28 Etablissement public administratif local (y compris établissement public de coopération intercommunale EPCI)",
            value: 28,
          },
          {
            label: "29 Autre employeur public",
            value: 29,
          },
        ],
      },
    ],
  },
  employeurSpecifique: {
    enum: [0, 1, 2, 3, 4],
    type: Number,
    nullable: true,
    default: 0,
    isNotRequiredForm: true,
    label: "Est un employeur spécifique :",
    description:
      "**Employeur spécifique** : \r\n<br />1 : Entreprise de travail temporaire\r\n<br />2 : Groupement d’employeurs\r\n<br />3 : Employeur saisonnier\r\n<br />4 : Apprentissage familial : l’employeur est un ascendant de l’apprenti\r\n<br />0 : Aucun de ces cas",
    options: [
      {
        label: "1 Entreprise de travail temporaire",
        value: 1,
      },
      {
        label: "2 Groupement d'employeurs",
        value: 2,
      },
      {
        label: "3 Employeur saisonnier",
        value: 3,
      },
      {
        label: "4 Apprentissage familial : l'employeur est un ascendant de l'apprenti",
        value: 4,
      },
      {
        label: "0 Aucun de ces cas",
        value: 0,
      },
    ],
  },
  caisseComplementaire: {
    maxLength: 80,
    type: String,
    default: null,
    isNotRequiredForm: true,
    description: "Caisse de retraite complémentaire Alternant",
    label: "Caisse de retraite complémentaire Alternant :",
    example: "AGIRC-ARRCO",
  },
  regimeSpecifique: {
    type: Boolean,
    description: "Adhère au régime spécifique d'assurance-chômage",
    label: "Adhésion de l'apprenti au régime spécifique d'assurance chômage : ",
    default: null,
    nullable: true,
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
  attestationEligibilite: {
    type: Boolean,
    description: "Atteste de l'éligibilité du tuteur / maître d'apprentissage",
    label:
      "L'employeur atteste sur l'honneur que le(s) maître(s) d'apprentissage répond à l'ensemble des critères d'éligibilité à cette fonction.",
    requiredMessage:
      "Il est obligatoire d'attester que le(s) maître(s) d'apprentissage répond à l'ensemble des critères d'éligibilité à cette fonction ",
    default: null,
    required: function () {
      return !this.draft;
    },
    options: [
      {
        label: "true",
        value: true,
      },
    ],
  },
  attestationPieces: {
    type: Boolean,
    description: "Atteste de disposer des pièces justificatives",
    label: "L'employeur atteste de disposer des pièces justificatives",
    requiredMessage: "Il est obligatoire que l'employeur dispose des pièces justificatives",
    default: null,
    required: function () {
      return !this.draft;
    },
    options: [
      {
        label: "true",
        value: true,
      },
    ],
  },
  privePublic: {
    type: Boolean,
    default: true,
    required: function () {
      return !this.draft;
    },
    description: "Employeur privé ou public",
    label: "Je suis : ",
    example: "Employeur public",
    options: [
      {
        label: "Employeur public",
        value: true,
      },
      {
        label: "Employeur privé",
        value: false,
        locked: true,
      },
    ],
  },
};
module.exports = employeurCerfaSchema;
