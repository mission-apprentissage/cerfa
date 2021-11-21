const adresseSchema = require("./adresse");

const employeurCerfaSchema = {
  denomination: {
    maxLength: 80,
    type: String,
    description: "Dénomination de l'employeur",
    example: "ENERGIE 3000",
    default: null,
    required: true,
  },
  raison_sociale: {
    type: String,
    default: null,
    example: "OCTO-TECHNOLOGY",
    description: "Raison sociale de l'employeur",
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
    description: "N° SIRET de l'employeur",
    default: null,
    example: "98765432400019",
    required: true,
  },
  naf: {
    maxLength: 6,
    type: String,
    default: null,
    required: true,
    description: "Code NAF de l'employeur",
    example: "1031Z",
  },
  nombreDeSalaries: {
    type: Number,
    required: true,
    default: 0,
    description: "Effectif salarié de l'entreprise",
    example: 123,
  },
  codeIdcc: {
    maxLength: 4,
    type: String,
    default: null,
    required: true,
    description: "Code IDCC de la convention collective appliquée",
    example: "0043",
  },
  libelleIdcc: {
    maxLength: 500,
    default: null,
    type: String,
    description: "Libellé de la convention collective appliquée",
    nullable: true,
    example:
      "Convention collective nationale des entreprises de commission, de courtage et de commerce intracommunautaire et d'importation-exportation de France métropolitaine",
  },
  telephone: {
    maxLength: 13,
    minLength: 10,
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: (props) => `${props.value} n'est pas un numéro de télephone valide`,
    },

    default: null,
    required: true,
    type: String,
    description: "Téléphone de l'employeur",
    example: "0908070605",
  },
  courriel: {
    maxLength: 80,
    type: String,
    default: null,
    required: true,
    description: "Courriel de l'employeur",
    validate: {
      validator: function (v) {
        return /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/.test(v);
      },
      message: (props) => `${props.value} n'est pas un courriel valide`,
    },
    example: "energie3000.pro@gmail.com",
  },
  adresse: {
    ...adresseSchema,
  },
  nom: {
    maxLength: 200,
    type: String,
    default: null,
    description: "Nom de l'employeur",
    nullable: true,
    example: "LEFEVBRE",
  },
  prenom: {
    maxLength: 50,
    type: String,
    description: "Prénom de l'employeur",
    nullable: true,
    default: null,
    example: "MARTINE",
  },
  typeEmployeur: {
    required: true,
    enum: [11, 12, 13, 14, 15, 16, 21, 22, 23, 24, 25, 26, 27, 28, 29],
    type: Number,
    nullable: true,
    default: null,
    description:
      "**Type d'mployeur** :\r\n<br /> *Privé*\r\n<br /> 11 : Entreprise inscrite au répertoire des métiers ou au registre des entreprises pour l’Alsace-Moselle\r\n<br /> 12 : Entreprise inscrite uniquement au registre du commerce et des sociétés\r\n<br /> 13 : Entreprises dont les salariés relèvent de la mutualité sociale agricole\r\n<br /> 14 : Profession libérale\r\n<br /> 15 : Association\r\n<br /> 16 : Autre employeur privé\r\n<br /> *Public*\r\n<br /> 21 : Service de l’Etat (administrations centrales et leurs services déconcentrés de la fonction publique d’Etat)\r\n<br /> 22 : Commune\r\n<br /> 23 : Département\r\n<br /> 24 : Région\r\n<br /> 25 : Etablissement public hospitalier\r\n<br /> 26 : Etablissement public local d’enseignement\r\n<br /> 27 : Etablissement public administratif de l’Etat\r\n<br /> 28 : Etablissement public administratif local(y compris établissement public de coopération intercommunale EPCI)\r\n<br /> 29 : Autre employeur public",
  },
  employeurSpecifique: {
    enum: [0, 1, 2, 3, 4],
    type: Number,
    nullable: true,
    default: null,
    description:
      "**Employeur spécifique** : \r\n<br />1 : Entreprise de travail temporaire\r\n<br />2 : Groupement d’employeurs\r\n<br />3 : Employeur saisonnier\r\n<br />4 : Apprentissage familial : l’employeur est un ascendant de l’apprenti\r\n<br />0 : Aucun de ces cas",
  },
  caisseComplementaire: {
    maxLength: 80,
    type: String,
    default: null,
    required: true,
    description: "Caisse de retraite complémentaire Alternant",
    example: "AGIRC-ARRCO",
  },
  regimeSpecifique: {
    type: Boolean,
    description: "Adhère au régime spécifique d'assurance-chômage",
    default: false,
    nullable: true,
    example: false,
  },
  attestationEligibilite: {
    type: Boolean,
    description: "Atteste de l'éligibilité du tuteur / maître d'apprentissage",
    default: false,
    example: false,
    required: true,
  },
  attestationPieces: {
    type: Boolean,
    description: "Atteste de disposer des pièces justificatives",
    default: false,
    example: false,
    required: true,
  },
};
module.exports = employeurCerfaSchema;
