const adresseSchema = require("./adresse.part");
const idccEnum = require("./idcc.part");
const departementEnum = require("./departements.part");

const employeurCerfaSchema = {
  denomination: {
    path: "employeur.denomination",
    // maxLength: 80,
    type: String,
    description: "La dénomination sociale doit être celle de l'établissement dans lequel le contrat s'exécute.",
    example: "Mairie",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  raison_sociale: {
    path: "employeur.raison_sociale",
    type: String,
    default: null,
    example: "OCTO-TECHNOLOGY",
    description: "Raison sociale de l'employeur",
  },
  siret: {
    path: "employeur.siret",
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
    description: `Vous devez renseigner le siret correspondant à l'établissement du lieu d'exécution du contrat (il ne correspond pas forcément au siège). Le siret comporte 14 chiffres. Il doit être présent et actif dans la base Entreprises de l'INSEE (regroupant employeurs privés et publics).`,
    default: null,
    nullable: function () {
      return this.draft;
    },
    required: function () {
      return !this.draft;
    },
    example: "98765432400019",
    pattern: "^([0-9]{14})$",
  },
  naf: {
    path: "employeur.naf",
    maxLength: 6,
    type: String,
    default: null,
    required: function () {
      return !this.draft;
    },
    description:
      "Le Code NAF est composé de 4 chiffres et 1 lettre. Il est délivré par l'INSEE.[Informations sur le Code NAF.](https://www.economie.gouv.fr/entreprises/activite-entreprise-code-ape-code-naf)",
    example: "1031Z",
    pattern: "^([0-9]){2}\\.?([0-9]){0,2}([a-zA-Z]){0,1}$",
  },
  nombreDeSalaries: {
    path: "employeur.nombreDeSalaries",
    type: Number,
    required: function () {
      return !this.draft;
    },
    default: null,
    description:
      "L'effectif salarié rempli automatiquement correspond à l'estimation de la base Entreprises de l'INSEE. <br/>L'effectif renseigné est celui de l’entreprise dans sa globalité (et non seulement l’effectif de l’établissement d’exécution du contrat).",
    example: 123,
  },
  codeIdcc: {
    path: "employeur.codeIdcc",
    enum: [null, ...idccEnum.map(({ code }) => code)],
    maxLength: 4,
    type: String,
    default: null,
    required: function () {
      return !this.draft;
    },
    description: `Identifiant de la convention collective de branche appliquée par l’établissement.  \n\n Recherchez votre code convention collective sur : [le site du Ministère du travail.](https://www.elections-professionnelles.travail.gouv.fr/web/guest/recherche-idcc)`,
    example: "9999",
    pattern: "^[0-9]{4}$",
  },
  libelleIdcc: {
    path: "employeur.libelleIdcc",
    enum: [null, ...idccEnum.map(({ libelle }) => libelle)],
    maxLength: 500,
    default: null,
    type: String,
    description: "Libellé de la convention collective appliquée",
    nullable: true,
    example:
      "Convention collective nationale des entreprises de commission, de courtage et de commerce intracommunautaire et d'importation-exportation de France métropolitaine",
  },
  telephone: {
    path: "employeur.telephone",
    maxLength: 13,
    minLength: 8,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /([+])?(\d{7,12})/.test(v);
      },
      message: (props) => `${props.value} n'est pas un numéro de télephone valide`,
    },
    default: null,
    required: function () {
      return !this.draft;
    },
    type: String,
    description: `Dans le cas d'un numéro français, il n'est pas 
    nécessaire de saisir le "0" car l'indicateur pays est 
    pré-renseigné.
    Il doit contenir 9 chiffres après l’indicatif.`,
    example: "0908070605",
    // pattern: "^([+])?((d)[.-]?)?[s]?(?(d{3}))?[.-]?[s]?(d{3})[.-]?[s]?(d{4,})$",
  },
  courriel: {
    path: "employeur.courriel",
    maxLength: 80,
    type: String,
    default: null,
    required: function () {
      return !this.draft;
    },
    description: `Ce courriel sera utilisé pour l'envoi des notifications pour le suivi du dossier.
     Il doit être au format courriel@texte.domaine.`,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/.test(v);
      },
      message: (props) => `${props.value} n'est pas un courriel valide`,
    },
    example: "energie3000.pro@gmail.com",
  },
  adresse: {
    ...adresseSchema,
    numero: {
      path: "employeur.adresse.numero",
      ...adresseSchema.numero,
    },
    voie: {
      path: "employeur.adresse.voie",
      ...adresseSchema.voie,
    },
    complement: {
      path: "employeur.adresse.complement",
      ...adresseSchema.complement,
      example: "Hôtel de ville ; Entrée ; Bâtiment ; Etage ; Service ; BP",
    },
    codePostal: {
      path: "employeur.adresse.codePostal",
      ...adresseSchema.codePostal,
    },
    commune: {
      path: "employeur.adresse.commune",
      ...adresseSchema.commune,
    },
    departement: {
      path: "employeur.adresse.departement",
      enum: [null, ...departementEnum.map((d) => d.replace(/^(0){1}/, ""))],
      maxLength: 3,
      minLength: 1,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^([0-9][0-9]|2[AB]|9[012345]|97[1234678]|98[46789])$/.test(v);
        },
        message: (props) => `${props.value} n'est pas un departement valide`,
      },
      type: String,
      description: "Département de l'employeur",
      example: "1 Ain, 99 Étranger",
      pattern: "^([0-9][0-9]|2[AB]|9[012345]|97[1234678]|98[46789])$",
      default: null,
      nullable: true,
      required: function () {
        return !this.draft;
      },
    },
    region: {
      path: "employeur.adresse.region",
      type: Number,
      description: "Région de l'employeur",
      example: "93 Provence-Alpes-Côte d'Azur",
      default: null,
      nullable: true,
      required: function () {
        return !this.draft;
      },
    },
  },
  nom: {
    path: "employeur.nom",
    maxLength: 200,
    type: String,
    default: null,
    description: "Nom de l'employeur",
    nullable: true,
    example: "LEFEVBRE",
  },
  prenom: {
    path: "employeur.prenom",
    maxLength: 50,
    type: String,
    description: "Prénom de l'employeur",
    nullable: true,
    default: null,
    example: "MARTINE",
  },
  typeEmployeur: {
    path: "employeur.typeEmployeur",
    required: function () {
      return !this.draft;
    },
    enum: [11, 12, 13, 14, 15, 16, 21, 22, 23, 24, 25, 26, 27, 28, 29],
    type: Number,
    nullable: true,
    default: null,
    description: "Le type d'employeur doit être en adéquation avec son statut juridique.",
  },
  employeurSpecifique: {
    path: "employeur.employeurSpecifique",
    enum: [0, 1, 2, 3, 4],
    type: Number,
    nullable: true,
    default: 0,
    description:
      "**Employeur spécifique** : \r\n<br />1 : Entreprise de travail temporaire\r\n<br />2 : Groupement d’employeurs\r\n<br />3 : Employeur saisonnier\r\n<br />4 : Apprentissage familial : l’employeur est un ascendant de l’apprenti\r\n<br />0 : Aucun de ces cas",
  },
  caisseComplementaire: {
    path: "employeur.caisseComplementaire",
    maxLength: 80,
    type: String,
    default: null,
    description: "Caisse de retraite complémentaire Alternant",
    example: "AGIRC-ARRCO",
  },
  regimeSpecifique: {
    path: "employeur.regimeSpecifique",
    type: Boolean,
    description: "Adhère au régime spécifique d'assurance-chômage",
    default: null,
    nullable: true,
    example: "Non",
  },
  attestationEligibilite: {
    path: "employeur.attestationEligibilite",
    type: Boolean,
    description:
      "Le maître d'apprentissage doit notamment justifier d'une formation et d'une expérience professionnelle minimales (code du travail, [art. R6223-22](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037813428/)). Le changement de maître d'apprentissage en cours de contrat implique de conclure un avenant au contrat initial, sauf si le contrat initial indique un second maître d'apprentissage.",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  attestationPieces: {
    path: "employeur.attestationPieces",
    type: Boolean,
    description: "Atteste de disposer des pièces justificatives",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  privePublic: {
    path: "employeur.privePublic",
    type: Boolean,
    default: true,
    required: function () {
      return !this.draft;
    },
    description: "Employeur privé ou public",
    example: "Employeur public",
  },
};
module.exports = employeurCerfaSchema;
