const modeContractuelSchema = require("./modeContractuel.part");
const typeContratSchema = require("./typeContrat.part");
const typeDerogationSchema = require("./typeDerogation.part");
const remunerationAnnuelleSchema = require("./remunerationAnnuelle.part");

const numContratChecks = {
  example: "02B202212000000",
  validate: {
    validator: function (v) {
      if (!v) return true;
      return /^(0[0-9][0-9]|02[ABab]|9[012345]|97[12346])([0-9]{4})([0-1][0-9])((NC|nc)|[0-9]{2})([0-9]{4})$/.test(v);
    },
    message: (props) => `${props.value} n'est pas un numéro valide`,
  },
  pattern: "^(0[0-9][0-9]|02[ABab]|9[012345]|97[12346])([0-9]{4})([0-1][0-9])((NC|nc)|[0-9]{2})([0-9]{4})$",
};

const contratSchema = {
  modeContractuel: {
    path: "contrat.modeContractuel",
    ...modeContractuelSchema,
    default: null,
  },
  typeContratApp: {
    path: "contrat.typeContratApp",
    ...typeContratSchema,
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  numeroContratPrecedent: {
    path: "contrat.numeroContratPrecedent",
    type: String,
    description:
      "Succession (n° du contrat précédent) : s'il ne s'agit pas du tout premier contrat de l'apprenti, renseignez le numéro de son contrat précédent, même s'il a été conclu avec un autre employeur. Avenant (n° du contrat sur lequel porte l'avenant ) : indiquez le n° de dépôt du contrat initial qui fait l'objet de la modification.",
    labelAvenant: "Numéro de contrat sur lequel porte l'avenant :",
    labelSuccession: "Numéro du contrat précédent :",
    nullable: true,
    default: null,
    ...numContratChecks,
  },
  noContrat: {
    path: "contrat.noContrat",
    type: String,
    description: "Numéro DECA de contrat",
    nullable: true,
    ...numContratChecks,
  },
  noAvenant: {
    path: "contrat.noAvenant",
    type: String,
    description: "Numéro d'Avenant",
    nullable: true,
    ...numContratChecks,
  },
  dateDebutContrat: {
    path: "contrat.dateDebutContrat",
    type: Date,
    description:
      "Indiquez la date du 1er jour où débute effectivement le contrat (chez l'employeur ou dans le centre de formation). La date de début d'exécution du contrat est liée à la date de naissance de l'apprenti pour le calcul des périodes de rémunération.",
    example: "2021-02-01T00:00:00+0000",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dateFinContrat: {
    path: "contrat.dateFinContrat",
    type: Date,
    description:
      "La période de contrat doit englober la date du dernier examen qui sanctionne l'obtention du diplôme. Si celle-ci n'est pas connue au moment de la conclusion du contrat, vous pouvez renseigner une date située maximum 2 mois au-delà de la date de fin prévisionnelle des examens.",
    example: "2021-02-28T00:00:00+0000",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dureeContrat: {
    path: "contrat.dureeContrat",
    type: Number,
    default: null,
    required: function () {
      return !this.draft;
    },
    description: "Durée du contrat en mois [calculé]",
  },
  dateEffetAvenant: {
    path: "contrat.dateEffetAvenant",
    type: Date,
    description: "Date à laquelle l'avenant va prendre effet.",
    nullable: true,
    default: null,
    example: "2021-03-01T00:00:00+0000",
  },
  dateConclusion: {
    path: "contrat.dateConclusion",
    type: Date,
    description: "Date de conclusion du contrat. (Date de signature du présent contrat)",
    example: "2021-01-15T00:00:00+0000",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dateRupture: {
    path: "contrat.dateRupture",
    type: Date,
    description: "Date de rupture du contrat",
    nullable: true,
    example: "2021-02-28T00:00:00+0000",
  },
  lieuSignatureContrat: {
    path: "contrat.lieuSignatureContrat",
    type: String,
    description: "Lieu de signature du contrat",
    example: "PARIS",
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  typeDerogation: {
    path: "contrat.typeDerogation",
    ...typeDerogationSchema,
  },
  dureeTravailHebdoHeures: {
    path: "contrat.dureeTravailHebdoHeures",
    type: Number,
    description: `La durée légale du travail effectif est fixée à 35h par semaine. Dans certains secteurs, quand l'organisation du travail le justifie, elle peut être portée à 40h. Le temps de formation en CFA est du temps de travail effectif et compte dans l'horaire de travail. En savoir plus sur les horaires sur [le site du Service public.](https://www.service-public.fr/particuliers/vosdroits/F2918), rubrique "Temps de travail".`,
    example: 37,
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  dureeTravailHebdoMinutes: {
    path: "contrat.dureeTravailHebdoMinutes",
    type: Number,
    description: "Durée hebdomadaire du travail (minutes)",
    example: 30,
    default: null,
  },
  travailRisque: {
    path: "contrat.travailRisque",
    type: Boolean,
    description: "Travaille sur machines dangereuses ou exposition à des risques particuliers",
    default: null,
    required: function () {
      return !this.draft;
    },
    example: "Oui",
  },
  caisseRetraiteComplementaire: {
    path: "contrat.caisseRetraiteComplementaire",
    type: String,
    description: "Caisse de retraite complémentaire",
    example: "",
    default: null,
  },
  avantageNature: {
    path: "contrat.avantageNature",
    type: Boolean,
    default: null,
    required: function () {
      return !this.draft;
    },
    description: `Une déduction du montant des avantages peut être pratiquée sur la rémunération de l'apprenti sous certaines conditions (code du travail, [art. D6222-33](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000041770368)).`,
    example: "Oui",
  },
  avantageNourriture: {
    path: "contrat.avantageNourriture",
    type: Number,
    description: "Nourriture €/repas",
    nullable: true,
    default: null,
    example: 3,
    // required: function () {
    //   return this.contrat.avantageNature && (!this.contrat.avantageLogement || !this.contrat.autreAvantageEnNature);
    // },
  },
  avantageLogement: {
    path: "contrat.avantageLogement",
    type: Number,
    description: "Logement €/mois",
    nullable: true,
    default: null,
    example: 456,
    // required: function () {
    //   return this.contrat.avantageNature;
    // },
  },
  autreAvantageEnNature: {
    path: "contrat.autreAvantageEnNature",
    type: Boolean,
    description: "Autre avantage en nature",
    nullable: true,
    default: null,
    example: true,
    // required: function () {
    //   return this.contrat.avantageNature;
    // },
  },
  salaireEmbauche: {
    path: "contrat.salaireEmbauche",
    type: Number,
    description: "Salaire brut à l'embauche",
    example: 1530,
    default: null,
    required: function () {
      return !this.draft;
    },
  },
  smic: {
    type: {},
    description: "Smic en vigeur [calculé]",
    default: null,
  },
  remunerationMajoration: {
    path: "contrat.remunerationMajoration",
    enum: [0, 10, 20],
    type: Number,
    default: 0,
    description: `**Majoration de la rémunération** :\r\n  Aucune\r\n  10%\r\n  20%`,
  },
  remunerationsAnnuelles: {
    type: [
      {
        ...remunerationAnnuelleSchema,
      },
    ],
  },
};

module.exports = contratSchema;
