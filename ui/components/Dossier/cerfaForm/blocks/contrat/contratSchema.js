import { shouldAskDateEffetAvenant } from "./domain/shouldAskDateEffetAvenant";
import { getLabelNumeroContratPrecedent } from "./domain/getLabelNumeroContratPrecedent";
import { isRequiredNumeroContratPrecedent } from "./domain/isRequiredNumeroContratPrecedent";
import { getTypeDerogationOptions } from "./domain/getTypeDerogationOptions";

export const contratSchema = {
  "contrat.typeContratApp": {
    fieldType: "select",
    required: true,
    description:
      "Le type de contrat ou avenant doit correspondre à la situation du contrat (premier contrat, succession de contrats, avenants).",
    options: [
      {
        name: "Contrat initial",
        options: [
          {
            label: "11 Premier contrat d'apprentissage de l'apprenti",
            value: 11,
          },
        ],
      },
      {
        name: "Succession de contrats",
        options: [
          {
            label: "21 Nouveau contrat avec un apprenti qui a terminé son précédent contrat auprès d'un même employeur",
            value: 21,
          },
          {
            label:
              "22 Nouveau contrat avec un apprenti qui a terminé son précédent contrat auprès d'un autre employeur",
            value: 22,
          },
          {
            label:
              "23 Nouveau contrat avec un apprenti dont le précédent contrat auprès d'un autre employeur a été rompu",
            value: 23,
          },
        ],
      },
      {
        name: "Avenant : modification des conditions du contrat",
        options: [
          {
            label: "31 Modification de la situation juridique de l'employeur",
            value: 31,
          },
          {
            label: "32 Changement d'employeur dans le cadre d'un contrat saisonnier",
            value: 32,
          },
          {
            label: "33 Prolongation du contrat suite à un échec à l'examen de l'apprenti",
            value: 33,
          },
          {
            label: "34 Prolongation du contrat suite à la reconnaissance de l'apprenti comme travailleur handicapé",
            value: 34,
          },
          {
            label: "35 Modification du diplôme préparé par l'apprenti",
            value: 35,
          },
          {
            label:
              "36 Autres changements : changement de maître d'apprentissage, de durée de travail hebdomadaire, réduction de durée, etc.",
            value: 36,
          },
          {
            label: "37 Modification du lieu d'exécution du contrat",
            value: 37,
          },
        ],
      },
    ],
    label: "Type de contrat ou d'avenant",
    requiredMessage: "le type de contrat ou d'avenant est obligatoire",
  },
  "contrat.typeDerogation": {
    fieldType: "select",
    _init: ({ values }) => ({ options: getTypeDerogationOptions({ values }) }),
    description:
      "A renseigner si une dérogation existe pour ce contrat (exemple : l'apprentissage commence à partir de 16 ans mais par dérogation, les jeunes âgés d'au moins 15 ans et un jour peuvent conclure un contrat d'apprentissage s'ils ont terminé la scolarité du 1er cycle de l'enseignement secondaire (collège).",
    label: "Type de dérogation (optionnel)",
  },
  "contrat.numeroContratPrecedent": {
    fieldType: "text",
    _init: ({ values }) => ({
      label: getLabelNumeroContratPrecedent({ values }),
      required: isRequiredNumeroContratPrecedent({ values }),
    }),
    description:
      "Succession (n° du contrat précédent) : s'il ne s'agit pas du tout premier contrat de l'apprenti, renseignez le numéro de son contrat précédent, même s'il a été conclu avec un autre employeur. Avenant (n° du contrat sur lequel porte l'avenant ) : indiquez le n° de dépôt du contrat initial qui fait l'objet de la modification.",
    requiredMessage: "la numéro du contrat précédent est obligatoire",
    example: "02B202212000000",
    mask: "DEP Y M N 0000",
    maskBlocks: [
      {
        name: "D",
        mask: "MaskedEnum",
        placeholderChar: "_",
        enum: ["0", "9"],
        maxLength: 1,
      },
      {
        name: "E",
        mask: "MaskedRange",
        placeholderChar: "_",
        from: 0,
        to: 9,
        maxLength: 1,
      },
      {
        name: "P",
        mask: "MaskedEnum",
        placeholderChar: "_",
        enum: ["A", "B", "a", "b", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        maxLength: 1,
      },
      {
        name: "Y",
        mask: "MaskedRange",
        placeholderChar: "_",
        from: 1900,
        to: 2999,
        maxLength: 4,
      },
      {
        name: "M",
        mask: "MaskedRange",
        placeholderChar: "_",
        from: 1,
        to: 12,
        maxLength: 2,
      },
      {
        name: "N",
        mask: "MaskedEnum",
        placeholderChar: "_",
        enum: [
          "NC",
          "nc",
          "00",
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28",
          "29",
          "30",
          "31",
          "32",
          "33",
          "34",
          "35",
          "36",
          "37",
          "38",
          "39",
          "40",
          "41",
          "42",
          "43",
          "44",
          "45",
          "46",
          "47",
          "48",
          "49",
          "50",
          "51",
          "52",
          "53",
          "54",
          "55",
          "56",
          "57",
          "58",
          "59",
          "60",
          "61",
          "62",
          "63",
          "64",
          "65",
          "66",
          "67",
          "68",
          "69",
          "70",
          "71",
          "72",
          "73",
          "74",
          "75",
          "76",
          "77",
          "78",
          "79",
          "80",
          "81",
          "82",
          "83",
          "84",
          "85",
          "86",
          "87",
          "88",
          "89",
          "90",
          "91",
          "92",
          "93",
          "94",
          "95",
          "96",
          "97",
          "98",
          "99",
        ],
        maxLength: 2,
      },
    ],
    validateMessage: "n'est pas un numéro valide",
  },
  "contrat.dateDebutContrat": {
    required: true,
    fieldType: "date",
    description:
      "Indiquez la date du 1er jour où débute effectivement le contrat (chez l'employeur ou dans le centre de formation). La date de début d'exécution du contrat est liée à la date de naissance de l'apprenti pour le calcul des périodes de rémunération.",
    label: "Date de début d'exécution du contrat :",
    requiredMessage: "la date de début d'exécution de contrat est obligatoire",
    example: "2021-02-01T00:00:00+0000",
  },
  "contrat.dateEffetAvenant": {
    fieldType: "date",
    _init: ({ values }) => ({ required: shouldAskDateEffetAvenant({ values }) }),
    description: "Date à laquelle l'avenant va prendre effet.",
    label: "Date d'effet d'avenant :",
    requiredMessage: "S'agissant d'un avenant sa date d'effet est obligatoire ",
    example: "2021-03-01T00:00:00+0000",
  },
  "contrat.dateFinContrat": {
    required: true,
    fieldType: "date",
    description:
      "La période de contrat doit englober la date du dernier examen qui sanctionne l'obtention du diplôme. Si celle-ci n'est pas connue au moment de la conclusion du contrat, vous pouvez renseigner une date située maximum 2 mois au-delà de la date de fin prévisionnelle des examens.",
    label: "Date de fin du contrat ou de la période d'apprentissage :",
    requiredMessage: "la date de fin de contrat est obligatoire",
    example: "2021-02-28T00:00:00+0000",
  },
  "contrat.dureeTravailHebdoHeures": {
    required: true,
    fieldType: "number",
    description:
      "La durée légale du travail effectif est fixée à 35h par semaine. Dans certains secteurs, quand l'organisation du travail le justifie, elle peut être portée à 40h. Le temps de formation en CFA est du temps de travail effectif et compte dans l'horaire de travail. En savoir plus sur les horaires sur [le site du Service public.](https://www.service-public.fr/particuliers/vosdroits/F2918), rubrique \"Temps de travail\".",
    requiredMessage: "la durée hebdomadaire de travail est obligatoire",
    label: "Heures:",
    example: 37,
    validate: ({ value }) => {
      if (value > 40) {
        return { error: "la durée de travail hebdomadaire en heures ne peut excéder 40h" };
      }
    },
  },
  "contrat.dureeTravailHebdoMinutes": {
    fieldType: "number",
    description: "Durée hebdomadaire du travail (minutes)",
    label: "Minutes:",
    example: 30,
    validate: ({ value }) => {
      if (value > 59) {
        return { error: "la durée de travail hebdomadaire en minutes ne peut excéder 59 minutes" };
      }
    },
  },
  "contrat.travailRisque": {
    fieldType: "radio",
    required: true,
    requiredMessage: "Cette déclaration est obligatoire",
    label: "Travail sur machines dangereuses ou exposition à des risques particuliers: ",
    example: "Oui",
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
  "contrat.salaireEmbauche": {
    locked: true,
    label: "Salaire brut mensuel à l'embauche:",
    example: 1530,
  },
  "contrat.remunerationsAnnuelles[].dateDebut": {
    label: "Date de début",
    fieldType: "date",
    required: true,
    locked: true,
    example: "2021-02-01T00:00:00+0000",
  },
  "contrat.remunerationsAnnuelles[].dateFin": {
    required: true,
    example: "2021-02-28T00:00:00+0000",
    label: "Date de fin",
    fieldType: "date",
    locked: true,
  },
  "contrat.remunerationsAnnuelles[].ordre": {
    example: "1.1, 1.2, 2.1",
    label: "ordre",
    required: true,
  },
  "contrat.remunerationsAnnuelles[].salaireBrut": {
    fieldType: "number",
    label: "salaireBrut",
    required: true,
  },
  "contrat.remunerationsAnnuelles[].taux": {
    fieldType: "number",
    example: 75,
    label: "% de rémunération du SMIC",
    required: true,
  },
  "contrat.remunerationsAnnuelles[].tauxMinimal": {
    fieldType: "number",
    description: "Seuil légal en %",
    example: 57,
    label: "% de rémunération du SMIC",
    required: true,
  },
  "contrat.remunerationsAnnuelles[].typeSalaire": {
    label: "SMIC ou SMC",
    required: true,
    description:
      "**Type de salaire** :\r\n  SMIC = salaire minimum de croissance\r\n  SMC = salaire minimum conventionnel",
    options: [
      {
        label: "SMIC",
        value: "SMIC",
      },
      {
        label: "SMC",
        value: "SMC",
        locked: true,
      },
    ],
  },
  "contrat.avantageNature": {
    fieldType: "radio",
    required: true,
    requiredMessage: "Cette déclaration est obligatoire",
    description:
      "Une déduction du montant des avantages peut être pratiquée sur la rémunération de l'apprenti sous certaines conditions (code du travail, [art. D6222-33](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000041770368)).",
    label: "L'apprenti(e) bénéficie d'avantages en nature",
    example: "Oui",
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
  "contrat.avantageNourriture": {
    fieldType: "number",
    label: "Nourriture:",
    example: 3,
    requiredMessage: "Cette déclaration est obligatoire",
    min: 1,
    mask: "X € / rep\\as",
    maskBlocks: [
      {
        name: "X",
        mask: "Number",
        signed: true,
        normalizeZeros: true,
        max: 10000,
      },
    ],
  },
  "contrat.avantageLogement": {
    fieldType: "number",
    label: "Logement:",
    example: 456,
    min: 1,
    mask: "X € / mois",
    maskBlocks: [
      {
        name: "X",
        mask: "Number",
        signed: true,
        normalizeZeros: true,
        max: 10000,
      },
    ],
  },
  "contrat.autreAvantageEnNature": {
    fieldType: "consent",
    label: "Autres avantages",
    example: true,
    options: [
      {
        label: "true",
        value: true,
      },
    ],
  },
  "contrat.smic": {},
};
