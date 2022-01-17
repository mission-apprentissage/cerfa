const adresseSchema = require("./adresse.part");
const diplomeSchema = require("./diplome.part");
const departementEnum = require("./departements.part");
const paysEnum = require("./pays.part");
const { capitalize } = require("lodash");

const apprentiSchema = {
  nom: {
    maxLength: 80,
    type: String,
    description: "Nom (Nom de naissance/ patronymique) de l'apprenti",
    label: "Nom de naissance de l'apprenti(e) :",
    requiredMessage: "Le nom de l'apprenti(e) est obligatoire",
    example: "MARTIN",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  // nomUsage: {
  //   maxLength: 80,
  //   type: String,
  //   description: "Nom d'usage de l'apprenti",
  //   nullable: true,
  //   example: "DUPONT",
  // },
  prenom: {
    maxLength: 80,
    type: String,
    description: "Prénom de l'apprenti",
    label: "Prénom de l'apprenti(e) :",
    requiredMessage: "Le prénom de l'apprenti(e) est obligatoire",
    example: "Jean-François",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  sexe: {
    enum: ["M", "F", null],
    default: null,
    required: function () {
      return !this.draft;
    },
    type: String,
    label: "Sexe :",
    description: "**Sexe de l'apprenti**\r\n<br />M : Homme\r\n<br />F : Femme",
    options: [
      {
        label: "M : Homme",
        value: "M",
      },
      {
        label: "F : Femme",
        value: "F",
      },
    ],
  },
  nationalite: {
    enum: [1, 2, 3],
    type: Number,
    default: null,
    required: function () {
      return !this.draft;
    },
    label: "Nationalité :",
    description:
      "**Nationalité** :\r\n<br />1 : Française\r\n<br />2 : Union Européenne\r\n<br />3 : Etranger hors Union Européenne",
    options: [
      {
        label: "1: Française",
        value: 1,
      },
      {
        label: "2: Union Européenne",
        value: 2,
      },
      {
        label: "3: Etranger hors Union Européenne",
        value: 3,
      },
    ],
  },
  dateNaissance: {
    type: Date,
    description: "Date de naissance de l'apprenti",
    label: "Date de naissance :",
    requiredMessage: "La date de naissance de l'apprenti(e) est obligatoire",
    example: "2001-01-01T00:00:00+0000",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  age: {
    type: Number,
    description: "Âge de l'apprenti(e) [donnée calculée]",
    nullable: true,
    default: null,
    example: 17,
  },
  departementNaissance: {
    enum: [null, ...departementEnum.map((d) => d.replace(/^(0){1,2}/, ""))],

    maxLength: 3,
    minLength: 1,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /^([1-9]|[2][1-9]|2[AB]|[13456789][0-9]|9[012345]|97[12346])$/.test(v);
      },
      message: (props) => `${props.value} n'est pas un departement valide`,
    },
    type: String,
    description: "Département de naissance de l'apprenti",
    label: "Département de naissance :",
    example: "01",
    pattern: "^([1-9]|[2][1-9]|2[AB]|[13456789][0-9]|9[012345]|97[12346])$",
    requiredMessage: "le département de naissance est obligatoire",
    validateMessage: ` n'est pas un département valide`,
    default: null,
    nullable: true,
    required: function () {
      return !this.draft;
    },
  },
  communeNaissance: {
    maxLength: 80,
    type: String,
    description: "Commune de naissance de l'apprenti",
    label: "Commune de naissance :",
    requiredMessage: "la commune de naissance est obligatoire",
    example: "Bourg-en-Bresse",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  nir: {
    maxLength: 15,
    minLength: 13,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /^[0-9]{6}[0-9AB]([0-9]{6}|[0-9]{8})$/.test(v);
      },
      message: (props) => `${props.value} n'est pas un NIR valide`,
    },
    type: String,
    description: "NIR de l'apprenti sur 13 ou 15 caractères",
    label: "NIR de l'apprenti(e)* :",
    example: "101010100100153",
    default: null,
    nullable: function () {
      return this.draft;
    },
    required: function () {
      return !this.draft;
    },
  },
  regimeSocial: {
    enum: [0, 1, 2],
    type: Number,
    default: null,
    required: function () {
      return !this.draft;
    },
    description: "**Régime social** :\r\n<br />1 : MSA\r\n<br />2 : URSSAF",
    label: "Régime social :",
    options: [
      {
        label: "1 MSA",
        value: 1,
      },
      {
        label: "2 URSSAF",
        value: 2,
      },
    ],
  },
  handicap: {
    type: Boolean,
    description: "Est reconnu travailleur handicapé (RQTH)",
    example: false,
    default: null,
    required: function () {
      return !this.draft;
    },
    label: "Déclare bénéficier de la reconnaissance travailleur handicapé :",
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
  situationAvantContrat: {
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    type: Number,
    default: null,
    required: function () {
      return !this.draft;
    },
    label: "Situation avant ce contrat :",
    options: [
      {
        label: "1 Scolaire",
        value: 1,
      },
      {
        label: "2 Prépa apprentissage",
        value: 2,
      },
      {
        label: "3 Etudiant",
        value: 3,
      },
      {
        label: "4 Contrat d'apprentissage",
        value: 4,
      },
      {
        label: "5 Contrat de professionnalisation",
        value: 5,
      },
      {
        label: "6 Contrat aidé",
        value: 6,
      },
      {
        label:
          "7 En formation au CFA sous statut de stagiaire de la formation professionnelle, avant signature d'un contrat d'apprentissage (L6222-12-1 du code du travail)",
        value: 7,
      },
      {
        label:
          "8 En formation, au CFA sans contrat sous statut de stagiaire de la formation professionnelle, suite à rupture (5° de L6231-2 du code du travail)",
        value: 8,
      },
      {
        label: "9 Autres situations sous statut de stagiaire de la formation professionnelle",
        value: 9,
      },
      {
        label: "10 Salarié",
        value: 10,
      },
      {
        label: "11 Personne à la recherche d'un emploi (inscrite ou non à Pôle Emploi)",
        value: 11,
      },
      {
        label: "12 Inactif",
        value: 12,
      },
    ],
    description:
      "**Situation de l'apprenti avant le contrat**\r\n<br />1 : Scolaire\r\n<br />2 : Prépa apprentissage\r\n<br />3 : Etudiant\r\n<br />4 : Contrat d’apprentissage\r\n<br />5 : Contrat de professionnalisation\r\n<br />6 : Contrat aidé\r\n<br />7 : En formation au CFA avant signature d’un contrat d’apprentissage (L6222-12-1 du code du travail)\r\n<br />8 : En formation, au CFA, sans contrat, suite à rupture (5° de L6231-2 du code du travail)\r\n<br />9 : Stagiaire de la formation professionnelle\r\n<br />10 : Salarié\r\n<br />11 : Personne à la recherche d’un emploi (inscrite ou non au Pôle Emploi)\r\n<br />12 : Inactif",
  },
  diplome: {
    ...diplomeSchema,
    label: "Diplôme ou titre le plus élevé obtenu :",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  derniereClasse: {
    enum: [1, 11, 12, 21, 22, 31, 32, 40, 41, 42],
    type: Number,
    default: null,
    required: function () {
      return !this.draft;
    },
    label: "Dernière classe / année suivie :",
    description:
      "**Dernière année ou classe suivie par l'apprenti** :\r\n<br /> 1 : l'apprenti a suivi la dernière année du cycle de formation et a obtenu le diplôme ou titre\r\n<br /> 11 : l’apprenti a suivi la 1ère année du cycle et l’a validée (examens réussis mais année non diplômante)\r\n<br /> 12 : l’apprenti a suivi la 1ère année du cycle mais ne l’a pas validée (échec aux examens, interruption ou abandon de formation)\r\n<br /> 21 : l’apprenti a suivi la 2è année du cycle et l’a validée (examens réussis mais année non diplômante)\r\n<br /> 22 : l’apprenti a suivi la 2è année du cycle mais ne l’a pas validée (échec aux examens, interruption ou abandon de formation)\r\n<br /> 31 : l’apprenti a suivi la 3è année du cycle et l’a validée (examens réussis mais année non diplômante, cycle adapté)\r\n<br /> 32 : l’apprenti a suivi la 3è année du cycle mais ne l’a pas validée (échec aux examens, interruption ou abandon de formation)\r\n<br /> 40 : l’apprenti a achevé le 1er cycle de l’enseignement secondaire (collège)\r\n<br /> 41 : l’apprenti a interrompu ses études en classe de 3è\r\n<br /> 42 : l’apprenti a interrompu ses études en classe de 4è",
    options: [
      {
        label: "01: l'apprenti a suivi la dernière année du cycle de formation et a obtenu le diplôme ou titre",
        value: 1,
      },
      {
        label:
          "11: l'apprenti a suivi la 1ère année du cycle et l'a validée (examens réussis mais année non diplômante)",
        value: 11,
      },
      {
        label:
          "12: l'apprenti a suivi la 1ère année du cycle mais ne l'a pas validée (échec aux examens, interruption ou abandon de formation)",
        value: 12,
      },
      {
        label: "21: l'apprenti a suivi la 2è année du cycle et l'a validée (examens réussis mais année non diplômante)",
        value: 21,
      },
      {
        label:
          "22: l'apprenti a suivi la 2è année du cycle mais ne l'a pas validée (échec aux examens, interruption ou abandon de formation)",
        value: 22,
      },
      {
        label:
          "31: l'apprenti a suivi la 3è année du cycle et l'a validée (examens réussis mais année non diplômante, cycle adaptés)",
        value: 31,
      },
      {
        label:
          "32: l'apprenti a suivi la 3è année du cycle mais ne l'a pas validée (échec aux examens, interruption ou abandon de formation)",
        value: 32,
      },

      {
        label: "40: l'apprenti a achevé le 1er cycle de l'enseignement secondaire (collège)",
        value: 40,
      },
      {
        label: "41: l'apprenti a interrompu ses études en classe de 3è",
        value: 41,
      },
      {
        label: "42: l'apprenti a interrompu ses études en classe de 4è",
        value: 42,
      },
    ],
  },
  diplomePrepare: {
    ...diplomeSchema,
    label: "Dernier diplôme ou titre préparé :",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  intituleDiplomePrepare: {
    maxLength: 255,
    type: String,
    description: "Intitulé précis du dernier diplôme ou titre préparé par l'apprenti(e)",
    example: "Master en sciences de l'éducation",
    label: "Intitulé précis du dernier diplôme ou titre préparé :",
    requiredMessage: "l'intitulé du dernier diplôme ou titre préparé par l'apprenti(e) est obligatoire",
    default: null,
    required: function () {
      return !this.draft;
    },
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
    type: String,
    default: null,
    required: function () {
      return !this.draft;
    },
    description: "Téléphone de l'apprenti",
    label: "Téléphone de l'apprenti(e) :",
    example: "0102030405",
  },
  courriel: {
    maxLength: 80,
    type: String,
    description: "Courriel de l'apprenti",
    label: "Courriel de l'apprenti(e) :",
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/.test(v);
      },
      message: (props) => `${props.value} n'est pas un courriel valide`,
    },
    example: "jf.martin@orange.fr",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  adresse: {
    ...adresseSchema,
    pays: {
      enum: [null, ...paysEnum.map(({ value }) => value)],
      default: "FRANCE",
      type: String,
      description: "Pays",
      label: "Pays :",
      requiredMessage: "le pays est obligatoire",
      required: function () {
        return !this.draft;
      },
      options: paysEnum.map(({ label, value }) => ({
        label: capitalize(label),
        value,
      })),
    },
  },
  apprentiMineurNonEmancipe: {
    type: Boolean,
    description: "l'apprenti(e) est mineur non emancipé",
    example: false,
    default: null,
    required: function () {
      return !this.draft;
    },
    label: "l'apprenti(e) est mineur non emancipé",
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
  responsableLegal: {
    required: function () {
      // If date de naissance to now < 18
      //!this.draft
      return false;
    },
    type: {
      nom: {
        maxLength: 80,
        type: String,
        default: null,
        required: function () {
          return !this.draft;
        },
        description: "Nom du représentant légal",
        label: "Nom du représentant légal:",
        example: "Honore",
      },
      prenom: {
        maxLength: 80,
        type: String,
        default: null,
        required: function () {
          return !this.draft;
        },
        description: "Prénom du représentant légal",
        label: "Prénom du représentant légal:",
        example: "Robert",
      },
      memeAdresse: {
        type: Boolean,
        description: "l'apprenti(e) vit à la même adresse que son responsable légal",
        example: false,
        default: null,
        required: function () {
          return !this.draft;
        },
        label: "l'apprenti(e) vit à la même adresse que son responsable légal",
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
      adresse: {
        ...adresseSchema,
        pays: {
          enum: [null, ...paysEnum.map(({ value }) => value)],
          default: null,
          type: String,
          description: "Pays",
          label: "Pays :",
          requiredMessage: "le pays est obligatoire",
          required: function () {
            return !this.draft;
          },
          options: paysEnum.map(({ label, value }) => ({
            label: capitalize(label),
            value,
          })),
        },
      },
    },
    default: {
      nom: null,
      prenom: null,
      adresse: {
        numero: null,
        voie: null,
        complement: null,
        codePostal: null,
        commune: null,
      },
    },
  },
  inscriptionSportifDeHautNiveau: {
    type: Boolean,
    description:
      "Déclare être inscrit sur la liste des sportifs, entraîneurs, arbitres et juges sportifs de haut niveau",
    label: "Déclare être inscrit sur la liste des sportifs, entraîneurs, arbitres et juges sportifs de haut niveau :",
    example: true,
    default: null,
    required: function () {
      return !this.draft;
    },
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
};

module.exports = apprentiSchema;
