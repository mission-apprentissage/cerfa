import { shouldAskDateEffetAvenant } from "./domain/shouldAskDateEffetAvenant";
import { getLabelNumeroContratPrecedent } from "./domain/getLabelNumeroContratPrecedent";
import { isRequiredNumeroContratPrecedent } from "./domain/isRequiredNumeroContratPrecedent";
import { getTypeDerogationOptions } from "./domain/getTypeDerogationOptions";

export const contratSchema = {
  "contrat.typeContratApp": {
    fieldType: "select",
    required: true,
    showInfo: true,
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
    showInfo: true,
    label: "Type de dérogation (optionnel)",
  },
  "contrat.numeroContratPrecedent": {
    fieldType: "text",
    _init: ({ values }) => ({
      label: getLabelNumeroContratPrecedent({ values }),
      required: isRequiredNumeroContratPrecedent({ values }),
    }),
    showInfo: true,
    requiredMessage: "la numéro du contrat précédent est obligatoire",
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
    showInfo: true,
    label: "Date de début d'exécution du contrat :",
    requiredMessage: "la date de début d'exécution de contrat est obligatoire",
  },
  "contrat.dateEffetAvenant": {
    fieldType: "date",
    _init: ({ values }) => ({ required: shouldAskDateEffetAvenant({ values }) }),
    showInfo: true,
    label: "Date d'effet d'avenant :",
    requiredMessage: "S'agissant d'un avenant sa date d'effet est obligatoire ",
  },
  "contrat.dateFinContrat": {
    required: true,
    fieldType: "date",
    showInfo: true,
    label: "Date de fin du contrat ou de la période d'apprentissage :",
    requiredMessage: "la date de fin de contrat est obligatoire",
  },
  "contrat.dureeTravailHebdoHeures": {
    required: true,
    fieldType: "number",
    showInfo: true,
    requiredMessage: "la durée hebdomadaire de travail est obligatoire",
    label: "Heures:",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^\\d*$",
      },
    ],
    validate: ({ value }) => {
      if (value > 40) {
        return { error: "la durée de travail hebdomadaire en heures ne peut excéder 40h" };
      }
    },
  },
  "contrat.dureeTravailHebdoMinutes": {
    fieldType: "number",
    showInfo: true,
    label: "Minutes:",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^\\d*$",
      },
    ],
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
  },
  "contrat.remunerationsAnnuelles[].dateDebut": {
    label: "Date de début",
    fieldType: "date",
    required: true,
    locked: true,
  },
  "contrat.remunerationsAnnuelles[].dateFin": {
    required: true,
    label: "Date de fin",
    fieldType: "date",
    locked: true,
  },
  "contrat.remunerationsAnnuelles[].ordre": {
    label: "ordre",
    required: true,
  },
  "contrat.remunerationsAnnuelles[].salaireBrut": {
    fieldType: "number",
    label: "salaireBrut",
    required: true,
  },
  "contrat.remunerationsAnnuelles[].taux": {
    fieldType: "numberStepper",
    label: "% de rémunération du SMIC",
    required: true,
  },
  "contrat.remunerationsAnnuelles[].tauxMinimal": {
    fieldType: "number",
    showInfo: true,
    label: "% de rémunération du SMIC",
    required: true,
  },
  "contrat.remunerationsAnnuelles[].typeSalaire": {
    label: "SMIC ou SMC",
    required: true,
    showInfo: true,
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
    showInfo: true,
    label: "L'apprenti(e) bénéficie d'avantages en nature",
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
    requiredMessage: "Cette déclaration est obligatoire",
    min: 1,
    mask: "X € / rep\\as",
    precision: 2,
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
    min: 1,
    mask: "X € / mois",
    precision: 2,
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
    options: [
      {
        label: "true",
        value: true,
      },
    ],
  },
  "contrat.smic": {},
};
