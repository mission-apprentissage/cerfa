export const employerSchema = {
  "employeur.adresse.codePostal": {
    required: true,
    label: "Code postal :",
    requiredMessage: "Le code postal est obligatoire",
    validateMessage: "n'est pas un code postal valide",
    example: "75000",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^\\d*$",
      },
    ],
  },
  "employeur.siret": {
    required: true,
    description:
      "Vous devez renseigner le siret correspondant à l'établissement du lieu d'exécution du contrat (il ne correspond pas forcément au siège). Le siret comporte 14 chiffres. Il doit être présent et actif dans la base Entreprises de l'INSEE (regroupant employeurs privés et publics).",
    example: "98765432400019",
    label: "N° SIRET de l'employeur :",
    requiredMessage: "Le siret est obligatoire",
    validateMessage: "n'est pas un siret valide",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^\\d*$",
      },
    ],
  },
  "employeur.denomination": {
    required: true,
    label: "Dénomination :",
    description: "La dénomination sociale doit être celle de l'établissement dans lequel le contrat s'exécute.",
    requiredMessage: "La dénomination de l'employeur est obligatoire",
    example: "Mairie",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^.*$",
      },
    ],
  },
  "employeur.adresse.numero": {
    precision: 0,
    fieldType: "number",
    label: "N° :",
    example: 13,
    validateMessage: "le numéro de voie ne peut pas commencer par zéro",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^\\d*$",
      },
    ],
  },
  "employeur.adresse.voie": {
    required: true,
    label: "Voie :",
    requiredMessage: "le nom de voie est obligatoire",
    example: "Boulevard de la liberté",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^.*$",
      },
    ],
  },
  "employeur.adresse.complement": {
    label: "Complément d'adresse (optionnel):",
    requiredMessage: "le complement d'adress est obligatoire",
    example: "Hôtel de ville ; Entrée ; Bâtiment ; Etage ; Service ; BP",
  },
  "employeur.adresse.commune": {
    required: true,
    label: "Commune: ",
    requiredMessage: "la commune est obligatoire",
    example: "PARIS",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^.*$",
      },
    ],
  },
  "employeur.adresse.departement": {
    required: true,
    label: "Département de l'employeur :",
    example: "1 Ain, 99 Étranger",
    requiredMessage: "le département de l'employeur est obligatoire",
    validateMessage: " n'est pas un département valide",
  },
  "employeur.adresse.region": {
    required: true,
    label: "Région de l'employeur :",
    example: "93 Provence-Alpes-Côte d'Azur",
    requiredMessage: "la région de l'employeur est obligatoire",
    validateMessage: " n'est pas une région valide",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^\\d*$",
      },
    ],
  },
  "employeur.telephone": {
    required: true,
    description:
      "Dans le cas d'un numéro français, il n'est pas nécessaire de saisir le \"0\" car l'indicateur pays est pré-renseigné.",
    label: "Téléphone de l'employeur :",
    requiredMessage: "Le téléphone de l'employeur est obligatoire",
  },
  "employeur.courriel": {
    required: true,
    fieldType: "email",
    description: "Ce courriel sera utilisé pour l'envoi des notifications pour le suivi du dossier.",
    label: "Courriel de l'employeur :",
    requiredMessage: "Le courriel de l'employeur est obligatoire",
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
  "employeur.naf": {
    required: true,
    description:
      "Le Code NAF est composé de 4 chiffres et 1 lettre. Il est délivré par l'INSEE.[Informations sur le Code NAF.](https://www.economie.gouv.fr/entreprises/activite-entreprise-code-ape-code-naf)",
    label: "Code NAF de l'employeur :",
    requiredMessage: "le code NAF est obligatoire",
    validateMessage: "le code NAF n'est pas au bon format",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^([0-9]{1,2})\\.?([0-9A-Za-z]{0,3})$",
      },
    ],
  },
  "employeur.nombreDeSalaries": {
    fieldType: "number",
    required: true,
    description:
      "L'effectif salarié rempli automatiquement correspond à l'estimation de la base Entreprises de l'INSEE. <br/>L'effectif renseigné est celui de l’entreprise dans sa globalité (et non seulement l’effectif de l’établissement d’exécution du contrat).",
    label: "Effectif salarié de l'entreprise :",
    requiredMessage: "Effectif salarié de l'entreprise est obligatoire",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^\\d*$",
      },
    ],
  },
  "employeur.typeEmployeur": {
    required: true,
    label: "Type d'employeur :",
    requiredMessage: "le type d'employeur est obligatoire",
    description: "Le type d'employeur doit être en adéquation avec son statut juridique.",
    options: [
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
  "employeur.employeurSpecifique": {
    label: "Est un employeur spécifique :",
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
  "employeur.codeIdcc": {
    required: true,
    description:
      "Identifiant de la convention collective de branche appliquée par l’établissement. [le site du Ministère du travail.](https://www.elections-professionnelles.travail.gouv.fr/web/guest/recherche-idcc)",
    label: "Code IDCC de la convention collective appliquée : ",
    requiredMessage: "le code idcc est obligatoire",
    example: "9999",
    validateMessage: "le code IDCC n'est pas au bon format",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^\\d*$",
      },
    ],
  },
  "employeur.codeIdcc_special": {
    fieldType: "radio",
    description: "Autres cas",
    label: "",
    example: "Sans convention collective",
    options: [
      {
        label: "9999 - Sans convention collective",
        value: "9999",
      },
      {
        label: "9998 - Convention non encore en vigueur",
        value: "9998",
      },
    ],
  },
  "employeur.libelleIdcc": {
    // required: true ??,
    label: "Libellé de la convention collective appliquée:",
    requiredMessage: "Le libellé de la convention collective est obligatoire",
    isNotRequiredForm: true,
    example:
      "Convention collective nationale des entreprises de commission, de courtage et de commerce intracommunautaire et d'importation-exportation de France métropolitaine",
  },
  "employeur.regimeSpecifique": {
    required: true,
    label: "Adhésion de l'apprenti au régime spécifique d'assurance chômage : ",
    requiredMessage: "Cette déclaration est obligatoire",
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
  "employeur.privePublic": {
    required: true,
    hidden: true,
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
