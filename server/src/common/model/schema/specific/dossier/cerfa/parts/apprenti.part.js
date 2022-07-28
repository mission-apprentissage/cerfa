const adresseSchema = require("./adresse.part");
const diplomeSchema = require("./diplome.part");
const departementEnum = require("./departements.part");
const paysEnum = require("./pays.part");

const apprentiSchema = {
  nom: {
    path: "apprenti.nom",
    maxLength: 80,
    type: String,
    description:
      "Le nom et le prénom doivent strictement correspondre à l'identité officielle du salarié (attention aux inversions).",
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
    path: "apprenti.prenom",
    maxLength: 80,
    type: String,
    description:
      "Le nom et le prénom doivent strictement correspondre à l'identité officielle du salarié (attention aux inversions).",
    example: "Jean-François",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  sexe: {
    path: "apprenti.sexe",
    enum: ["M", "F", null],
    default: null,
    required: function () {
      return !this.draft;
    },
    type: String,
    description: `**Sexe de l'apprenti**\r\n  M : Homme\r\n  F : Femme`,
  },
  nationalite: {
    path: "apprenti.nationalite",
    enum: [1, 2, 3],
    type: Number,
    default: null,
    required: function () {
      return !this.draft;
    },
    description: `Le salarié étranger, non citoyen européen, doit disposer d'un titre de séjour valable l'autorisant à travailler en France et d'une autorisation de travail au début du contrat. Les demandes de titres et d'autorisation de travail peuvent être réalisées sur [le site Etrangers en France.](https://administration-etrangers-en-france.interieur.gouv.fr/particuliers/#/)`,
  },
  dateNaissance: {
    path: "apprenti.dateNaissance",
    type: Date,
    example: "2001-01-01T00:00:00+0000",
    description:
      "La date de naissance combinée à la date d'exécution du contrat définira si l'apprenti(e) est mineur(e) ou majeur(e) et est bien âgé de 15 ans ou plus. Si l'apprenti(e) est mineur(e) à la date de signature du contrat, vous devrez renseigner le cas d'émancipation ou les informations relatives au représentant légal.",
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
        return /^([0-9][0-9]|2[AB]|9[012345]|97[1234678]|98[46789])$/.test(v);
      },
      message: (props) => `${props.value} n'est pas un departement valide`,
    },
    type: String,
    example: "1, 60",
    pattern: "^([0-9][0-9]|2[AB]|9[012345]|97[1234678]|98[46789])$",
    description: `Pour les personnes nées à l'étranger, indiquez 99. 
    Pour les départements à 1 chiffre, faites précéder 
    le chiffre par un "0".
    Le numéro doit contenir 2 à 3 chiffres.`,
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
    example: "Bourg-en-Bresse",
    default: null,
    required: function () {
      return !this.draft;
    },
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
  },
  situationAvantContrat: {
    path: "apprenti.situationAvantContrat",
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    type: Number,
    default: null,
    required: function () {
      return !this.draft;
    },
    description: `**Situation de l'apprenti avant le contrat**\r\n  1 : Scolaire\r\n  2 : Prépa apprentissage\r\n  3 : Etudiant\r\n  4 : Contrat d’apprentissage\r\n  5 : Contrat de professionnalisation\r\n  6 : Contrat aidé\r\n  7 : En formation au CFA avant signature d’un contrat d’apprentissage (L6222-12-1 du code du travail)\r\n  8 : En formation, au CFA, sans contrat, suite à rupture (5° de L6231-2 du code du travail)\r\n  9 : Stagiaire de la formation professionnelle\r\n  10 : Salarié\r\n  11 : Personne à la recherche d’un emploi (inscrite ou non au Pôle Emploi)\r\n  12 : Inactif`,
  },
  diplome: {
    path: "apprenti.diplome",
    ...diplomeSchema,
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
    description: `Il faut sélectionner la situation qui précède l'entrée en contrat d'apprentissage. Par exemple, si le diplôme préparé avant était une 1ère année de BTS et que cette dernière a été validée, il faut sélectionner 11 - l'apprenti a suivi la première année du cycle et l'a validée ( examens réussis mais année non diplômante).`,
  },
  diplomePrepare: {
    path: "apprenti.diplomePrepare",
    ...diplomeSchema,
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
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  telephone: {
    path: "apprenti.telephone",
    maxLength: 13,
    minLength: 8,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /([+])?(\d{7,12})/.test(v);
      },
      message: (props) => `${props.value} n'est pas un numéro de télephone valide`,
    },
    type: String,
    default: null,
    required: function () {
      return !this.draft;
    },
    description: `Dans le cas d'un numéro français, il n'est pas 
    nécessaire de saisir le "0" car l'indicateur pays est 
    pré-renseigné.
    Il doit contenir 9 chiffres après l’indicatif.`,
    example: "0102030405",
  },
  courriel: {
    path: "apprenti.courriel",
    maxLength: 80,
    type: String,
    description: `Ce courriel sera utilisé pour l'envoi des notifications pour le suivi du dossier.
     Il doit être au format courriel@texte.domaine.`,
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
      example: "Bâtiment ; Résidence ; Entrée ; Appartement ; Escalier ; Etage",
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
      required: function () {
        return !this.draft;
      },
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
  },
  apprentiMineurNonEmancipe: {
    path: "apprenti.apprentiMineurNonEmancipe",
    type: Boolean,
    example: false,
    default: null,
    required: function () {
      return !this.draft;
    },
    description: `Un mineur émancipé peut accomplir seul les actes nécessitant la majorité légale. Plus d'informations à propos de l'émancipation sur [le site du Service public.](https://www.service-public.fr/particuliers/vosdroits/F1194) `,
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
        example: "Honore",
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
        example: "Robert",
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
          required: function () {
            return !this.draft;
          },
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
    example: true,
    default: null,
    required: function () {
      return !this.draft;
    },
  },
};

module.exports = apprentiSchema;
