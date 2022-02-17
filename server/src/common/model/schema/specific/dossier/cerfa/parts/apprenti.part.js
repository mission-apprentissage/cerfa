const adresseSchema = require("./adresse.part");
const diplomeSchema = require("./diplome.part");
const departementEnum = require("./departements.part");
const paysEnum = require("./pays.part");
const { capitalize } = require("lodash");

const apprentiSchema = {
  nom: {
    path: "apprenti.nom",
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
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^\\D*$",
      },
    ],
  },
  // nomUsage: {
  //   maxLength: 80,
  //   type: String,
  //   description: "Nom d'usage de l'apprenti",
  //   nullable: true,
  //   example: "DUPONT",
  // },
  prenom: {
    path: "apprenti.prenom",
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
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^\\D*$",
      },
    ],
  },
  sexe: {
    path: "apprenti.sexe",
    enum: ["M", "F", null],
    default: null,
    required: function () {
      return !this.draft;
    },
    type: String,
    label: "Sexe :",
    description: `**Sexe de l'apprenti**\r\n  M : Homme\r\n  F : Femme`,
    requiredMessage: "le sexe de l'apprenti(e) est obligatoire",
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
    path: "apprenti.nationalite",
    enum: [1, 2, 3],
    type: Number,
    default: null,
    required: function () {
      return !this.draft;
    },
    label: "Nationalité :",
    requiredMessage: "la nationalité de l'apprenti(e) est obligatoire",
    description: `Le salarié étranger, non citoyen européen, doit disposer d'un titre de séjour valable l'autorisant à travailler en France et d'une autorisation de travail au début du contrat. Les demandes de titres et d'autorisation de travail peuvent être réalisées sur [le site Etrangers en France.](https://administration-etrangers-en-france.interieur.gouv.fr/particuliers/#/)`,
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
    path: "apprenti.dateNaissance",
    type: Date,
    label: "Date de naissance :",
    requiredMessage: "La date de naissance de l'apprenti(e) est obligatoire",
    example: "2001-01-01T00:00:00+0000",
    description:
      "La date de naissance combinée à la date d'exécution du contrat définira si l'apprenti(e) est mineur(e) ou majeur(e) et est bien âgé de 15 ans ou plus. <br/> Si l'apprenti(e) est mineur(e) à la date de signature du contrat, vous devrez renseigner le cas d'émancipation ou les informations relatives au représentant légal.",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  age: {
    path: "apprenti.age",
    type: Number,
    description: "Âge de l'apprenti(e) à la date de début de contrat [donnée calculée]",
    nullable: true,
    default: null,
    example: 17,
    required: function () {
      return !this.draft;
    },
  },
  departementNaissance: {
    path: "apprenti.departementNaissance",
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
    label: "Département de naissance :",
    example: "1 Ain, 99 Étranger",
    pattern: "^([0-9][0-9]|2[AB]|9[012345]|97[12346])$",
    requiredMessage: "le département de naissance est obligatoire",
    validateMessage: ` n'est pas un département valide`,
    description: `Pour les personnes nées à l'étranger, indiquez 99. Pour les départements à 1 chiffre, faites précéder le chiffre par un "0".`,
    default: null,
    nullable: true,
    required: function () {
      return !this.draft;
    },
  },
  communeNaissance: {
    path: "apprenti.communeNaissance",
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
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^.*$",
      },
    ],
  },
  nir: {
    path: "apprenti.nir",
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
    // required: function () {
    //   return !this.draft;
    // },
  },
  regimeSocial: {
    path: "apprenti.regimeSocial",
    enum: [0, 1, 2],
    type: Number,
    default: null,
    required: function () {
      return !this.draft;
    },
    description: `**Régime social** :\r\n  1 : MSA\r\n  2 : URSSAF`,
    label: "Régime social :",
    requiredMessage: "le régime social de l'apprenti(e) est obligatoire",
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
    path: "apprenti.handicap",
    type: Boolean,
    description: "Est reconnu travailleur handicapé (RQTH)",
    example: false,
    default: null,
    required: function () {
      return !this.draft;
    },
    label: "Déclare bénéficier de la reconnaissance travailleur handicapé :",
    requiredMessage: "La déclaration de reconnaissance travailleur handicapé est obligatoire",
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
    path: "apprenti.situationAvantContrat",
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    type: Number,
    default: null,
    required: function () {
      return !this.draft;
    },
    label: "Situation avant ce contrat :",
    requiredMessage: "la situation social avant ce contrat de l'apprenti(e) est obligatoire",
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
    description: `**Situation de l'apprenti avant le contrat**\r\n  1 : Scolaire\r\n  2 : Prépa apprentissage\r\n  3 : Etudiant\r\n  4 : Contrat d’apprentissage\r\n  5 : Contrat de professionnalisation\r\n  6 : Contrat aidé\r\n  7 : En formation au CFA avant signature d’un contrat d’apprentissage (L6222-12-1 du code du travail)\r\n  8 : En formation, au CFA, sans contrat, suite à rupture (5° de L6231-2 du code du travail)\r\n  9 : Stagiaire de la formation professionnelle\r\n  10 : Salarié\r\n  11 : Personne à la recherche d’un emploi (inscrite ou non au Pôle Emploi)\r\n  12 : Inactif`,
  },
  diplome: {
    path: "apprenti.diplome",
    ...diplomeSchema,
    label: "Diplôme ou titre le plus élevé obtenu :",
    requiredMessage: "le diplôme ou titre le plus élevé obtenu par l'apprenti(e) est obligatoire",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  derniereClasse: {
    path: "apprenti.derniereClasse",
    enum: [1, 11, 12, 21, 22, 31, 32, 40, 41, 42],
    type: Number,
    default: null,
    required: function () {
      return !this.draft;
    },
    label: "Dernière classe / année suivie :",
    requiredMessage: "la dernière classe / année suivie par l'apprenti(e) est obligatoire",
    description: `Il faut sélectionner la situation qui précède l'entrée en contrat d'apprentissage. Par exemple, si le diplôme préparé avant était une 1ère année de BTS et que cette dernière a été validée, il faut sélectionner 11 - l'apprenti a suivi la première année du cycle et l'a validée ( examens réussis mais année non diplômante).`,
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
    path: "apprenti.diplomePrepare",
    ...diplomeSchema,
    label: "Dernier diplôme ou titre préparé :",
    requiredMessage: "le dernier diplôme ou titre préparé par l'apprenti(e) est obligatoire",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  intituleDiplomePrepare: {
    path: "apprenti.intituleDiplomePrepare",
    maxLength: 255,
    type: String,
    description: "Intitulé précis du dernier diplôme ou titre préparé par l'apprenti(e)",
    example: "BTS comptabilité gestion",
    label: "Intitulé précis du dernier diplôme ou titre préparé :",
    requiredMessage: "l'intitulé du dernier diplôme ou titre préparé par l'apprenti(e) est obligatoire",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  telephone: {
    path: "apprenti.telephone",
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
    label: "Téléphone de l'apprenti(e) :",
    description: `Dans le cas d'un numéro français, il n'est pas nécessaire de saisir le "0" car l'indicateur pays est pré-renseigné.`,
    example: "0102030405",
  },
  courriel: {
    path: "apprenti.courriel",
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
    requiredMessage: "le courriel de l'apprenti(e) est obligatoire",
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
  adresse: {
    ...adresseSchema,
    numero: {
      path: "apprenti.adresse.numero",
      ...adresseSchema.numero,
    },
    voie: {
      path: "apprenti.adresse.voie",
      ...adresseSchema.voie,
    },
    complement: {
      path: "apprenti.adresse.complement",
      ...adresseSchema.complement,
    },
    codePostal: {
      path: "apprenti.adresse.codePostal",
      ...adresseSchema.codePostal,
    },
    commune: {
      path: "apprenti.adresse.commune",
      ...adresseSchema.commune,
    },
    pays: {
      path: "apprenti.adresse.pays",
      enum: [null, ...paysEnum.map(({ code }) => code)],
      default: "FR",
      type: String,
      description: "Pays",
      label: "Pays :",
      requiredMessage: "le pays est obligatoire",
      required: function () {
        return !this.draft;
      },
      options: paysEnum.map(({ label, code }) => ({
        label: capitalize(label),
        value: code,
      })),
    },
  },
  apprentiMineur: {
    path: "apprenti.apprentiMineur",
    type: Boolean,
    description: "À la date de signature de ce contrat, l'apprenti(e) sera-t-il(elle) mineur(e) ?",
    example: false,
    default: null,
    required: function () {
      return !this.draft;
    },
    label: "À la date de signature de ce contrat, l'apprenti(e) sera-t-il(elle) mineur(e) ?",
    requiredMessage: "l'apprenti(e) sera-t-il(elle) mineur(e) à la date de signature de ce contrat ?",
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
  apprentiMineurNonEmancipe: {
    path: "apprenti.apprentiMineurNonEmancipe",
    type: Boolean,
    example: false,
    default: null,
    required: function () {
      return !this.draft;
    },
    label: "l'apprenti(e) est mineur(e) non emancipé(e)",
    description: `Vous devez indiquer "oui" si l'apprenti est mineur non émancipé à la date de signature du contrat. Dans ce cas, le représentant légal devra également signer le contrat.`,
    requiredMessage: "Merci de renseigner si l'apprenti(e) mineur(e) est emancipé(e) ou non",
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
        path: "apprenti.responsableLegal.nom",
        maxLength: 80,
        type: String,
        default: null,
        required: function () {
          return !this.draft;
        },
        description: "Nom du représentant légal",
        label: "Nom du représentant légal:",
        requiredMessage: "le nom du représentant légal est obligatoire",
        example: "Honore",
        mask: "C",
        maskBlocks: [
          {
            name: "C",
            mask: "Pattern",
            pattern: "^\\D*$",
          },
        ],
      },
      prenom: {
        path: "apprenti.responsableLegal.prenom",
        maxLength: 80,
        type: String,
        default: null,
        required: function () {
          return !this.draft;
        },
        description: "Prénom du représentant légal",
        label: "Prénom du représentant légal:",
        requiredMessage: "le prénom du représentant légal est obligatoire",
        example: "Robert",
        mask: "C",
        maskBlocks: [
          {
            name: "C",
            mask: "Pattern",
            pattern: "^\\D*$",
          },
        ],
      },
      memeAdresse: {
        path: "apprenti.responsableLegal.memeAdresse",
        type: Boolean,
        description: "l'apprenti(e) vit à la même adresse que son responsable légal",
        example: false,
        default: null,
        required: function () {
          return !this.draft;
        },
        label: "l'apprenti(e) vit à la même adresse que son responsable légal",
        requiredMessage: "L'adresse du représentant légal est obligatoire",
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
        numero: {
          path: "apprenti.responsableLegal.adresse.numero",
          ...adresseSchema.numero,
        },
        voie: {
          path: "apprenti.responsableLegal.adresse.voie",
          ...adresseSchema.voie,
        },
        complement: {
          path: "apprenti.responsableLegal.adresse.complement",
          ...adresseSchema.complement,
        },
        codePostal: {
          path: "apprenti.responsableLegal.adresse.codePostal",
          ...adresseSchema.codePostal,
        },
        commune: {
          path: "apprenti.responsableLegal.adresse.commune",
          ...adresseSchema.commune,
        },
        pays: {
          path: "apprenti.responsableLegal.adresse.pays",
          enum: [null, ...paysEnum.map(({ code }) => code)],
          default: "FR",
          type: String,
          description: "Pays",
          label: "Pays :",
          requiredMessage: "le pays est obligatoire",
          required: function () {
            return !this.draft;
          },
          options: paysEnum.map(({ label, code }) => ({
            label: capitalize(label),
            value: code,
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
        pays: null,
      },
    },
  },
  inscriptionSportifDeHautNiveau: {
    path: "apprenti.inscriptionSportifDeHautNiveau",
    type: Boolean,
    description:
      "Déclare être inscrit sur la liste des sportifs, entraîneurs, arbitres et juges sportifs de haut niveau",
    label: "Déclare être inscrit sur la liste des sportifs, entraîneurs, arbitres et juges sportifs de haut niveau :",
    requiredMessage: "Cette déclaration est obligatoire",
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
