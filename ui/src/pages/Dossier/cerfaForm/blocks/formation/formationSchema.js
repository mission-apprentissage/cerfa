import { shouldHideEtablissementFormation } from "./shouldHideEtablissementFormation";

export const formationSchema = {
  "etablissementFormation.memeResponsable": {
    fieldType: "radio",
    required: true,
    label: "Le lieu de formation est le même que l'organisme responsable",
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
  "etablissementFormation.denomination": {
    fieldType: "text",
    required: true,
    hidden: shouldHideEtablissementFormation,
    label: "Dénomination du lieu de formation :",
    requiredMessage: "la dénomination du du lieu de formation est obligatoire",
    example: "CFA",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^.*$",
      },
    ],
  },
  "etablissementFormation.siret": {
    fieldType: "text",
    hidden: shouldHideEtablissementFormation,
    description: "N° SIRET du lieu de formation",
    example: "98765432400019",
    label: "N° SIRET du lieu de formation :",
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
  "etablissementFormation.uaiCfa": {
    fieldType: "text",
    hidden: shouldHideEtablissementFormation,
    description:
      "Le numéro UAI est autocomplété ; il peut être recherché sur [le catalogue des formations en apprentissage.](https://catalogue.apprentissage.beta.gouv.fr/)",
    example: "0561910X",
    label: "N° UAI du CFA :",
    validateMessage: "n'est pas un uai valide",
  },
  "etablissementFormation.adresse.numero": {
    fieldType: "number",
    hidden: shouldHideEtablissementFormation,
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
  "etablissementFormation.adresse.voie": {
    fieldType: "text",
    required: true,
    hidden: shouldHideEtablissementFormation,
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
  "etablissementFormation.adresse.complement": {
    fieldType: "text",
    hidden: shouldHideEtablissementFormation,
    label: "Complément d'adresse (optionnel):",
    requiredMessage: "le complement d'adress est obligatoire",
    example: "Bâtiment ; Résidence ; Entrée ; Appartement ; Escalier ; Etage",
  },
  "etablissementFormation.adresse.codePostal": {
    fieldType: "text",
    required: true,
    hidden: shouldHideEtablissementFormation,
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
  "etablissementFormation.adresse.commune": {
    fieldType: "text",
    required: true,
    hidden: shouldHideEtablissementFormation,
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
  "formation.rncp": {
    fieldType: "text",
    required: true,
    description:
      "Le code RNCP peut être recherché sur [le site France compétences.](https://www.francecompetences.fr/recherche_certificationprofessionnelle/) Le code diplôme peut être déduit du code RNCP et à l'inverse, vous pouvez renseigner un code diplôme pour déduire le code RNCP correspondant.",
    label: "Code RNCP : ",
    example: "RNCP15516",
    requiredMessage: "Le code RNCP est obligatoire",
    validateMessage:
      "n'est pas un code RNCP valide. Le code RNCP doit être définit et au format 5 ou 9 caractères,  RNCP24440 ou 24440",
    mask: "RNCPX",
    maskBlocks: [
      {
        name: "X",
        mask: "Pattern",
        pattern: "^\\d*$",
      },
    ],
    unmask: false,
  },
  "formation.codeDiplome": {
    fieldType: "text",
    required: true,
    description:
      "Ce code à 8 caractères permet d'identifier un titre ou diplôme préparé par la voie de l'apprentissage, plus d'informations sur [le site du ministère de l'Education Nationale.](https://www.education.gouv.fr/codification-des-formations-et-des-diplomes-11270) Le code diplôme peut être recherché sur [le catalogue des formations en apprentissage.](https://catalogue.apprentissage.beta.gouv.fr/) Le code diplôme peut être déduit du code RNCP et à l'inverse, vous pouvez renseigner un code diplôme pour déduire le code RNCP correspondant.",
    label: "Code diplôme (Éducation Nationale) : ",
    example: "32322111",
    requiredMessage: "Le code diplôme est obligatoire",
    validateMessage:
      "n'est pas un code diplôme valide. Le code formation diplôme doit être au format 8 caractères ou 9 avec la lettre specialité",
  },
  "formation.typeDiplome": {
    fieldType: "select",
    required: true,
    description:
      "Il faut sélectionner le diplôme ou le titre préparé avant la conclusion du présent contrat. Par exemple, si l'entrée en apprentissage concerne la 2ème année de BTS, le dernier diplôme ou titre préparé est la 1ère année de BTS : il faut donc sélectionner 54 - Brevet de Technicien supérieur.",
    options: [
      {
        name: "Diplôme ou titre de niveau bac +5 et plus",
        options: [
          {
            label: "80: Doctorat",
            value: 80,
          },
          {
            label: "71: Master professionnel/DESS",
            value: 71,
          },
          {
            label: "72: Master recherche/DEA",
            value: 72,
          },
          {
            label: "73: Master indifférencié",
            value: 73,
          },
          {
            label: "74: Diplôme d'ingénieur, diplôme d'école de commerce",
            value: 74,
          },
          {
            label: "79: Autre diplôme ou titre de niveau bac+5 ou plus",
            value: 79,
          },
        ],
      },
      {
        name: "Diplôme ou titre de niveau bac +3 et 4",
        options: [
          {
            label: "61: 1 ère année de Master",
            value: 61,
          },
          {
            label: "62: Licence professionnelle",
            value: 62,
          },
          {
            label: "63: Licence générale",
            value: 63,
          },
          {
            label: "69: Autre diplôme ou titre de niveau bac +3 ou 4",
            value: 69,
          },
        ],
      },
      {
        name: "Diplôme ou titre de niveau bac +2",
        options: [
          {
            label: "54: Brevet de Technicien Supérieur",
            value: 54,
          },
          {
            label: "55: Diplôme Universitaire de technologie",
            value: 55,
          },
          {
            label: "58: Autre diplôme ou titre de niveau bac+2",
            value: 58,
          },
        ],
      },
      {
        name: "Diplôme ou titre de niveau bac",
        options: [
          {
            label: "41: Baccalauréat professionnel",
            value: 41,
          },
          {
            label: "42: Baccalauréat général",
            value: 42,
          },
          {
            label: "43: Baccalauréat technologique",
            value: 43,
          },
          {
            label: "49: Autre diplôme ou titre de niveau bac",
            value: 49,
          },
        ],
      },
      {
        name: "Diplôme ou titre de niveau CAP/BEP",
        options: [
          {
            label: "33: CAP",
            value: 33,
          },
          {
            label: "34: BEP",
            value: 34,
          },
          {
            label: "35: Mention complémentaire",
            value: 35,
          },
          {
            label: "38: Autre diplôme ou titre de niveau CAP/BEP",
            value: 38,
          },
        ],
      },
      {
        name: "Aucun diplôme ni titre",
        options: [
          {
            label: "25: Diplôme national du Brevet",
            value: 25,
          },
          {
            label: "26: Certificat de formation générale",
            value: 26,
          },
          {
            label: "13: Aucun diplôme ni titre professionnel",
            value: 13,
          },
        ],
      },
    ],
    label: "Diplôme ou titre visé par l'apprenti :",
    example: 74,
    requiredMessage: "Le diplôme ou titre visé est obligatoire",
    validateMessage: " n'est pas un diplôme ou titre valide",
  },
  "formation.intituleQualification": {
    fieldType: "text",
    required: true,
    description: "Intitulé précis du diplôme ou titre visé par l'Alternant",
    label: "Intitulé précis :",
    example: "PRODUCTION ET SERVICE EN RESTAURATION (RAPIDE, COLLECTIVE, CAFETERIA) (CAP)",
    requiredMessage: "L'intitulé du diplôme ou titre est obligatoire",
    validateMessage: " n'est pas un intitulé valide",
  },
  "formation.dateDebutFormation": {
    fieldType: "date",
    required: true,
    description:
      "Il faut renseigner la date effective à laquelle l'apprenti débute sa formation, même si l'apprenti a démarré la formation sous le statut \"stagiaire de la formation professionnelle\".",
    label: "Date de début du cycle de formation : ",
    example: "05/11/2021",
    requiredMessage: "la date de début de cycle est obligatoire",
    validateMessage: " n'est pas une date valide",
  },
  "formation.dateFinFormation": {
    fieldType: "date",
    required: true,
    description:
      "Lorsque la date précise n'est pas connue, il est possible de renseigner une date prévisionnelle avec une marge de 2 mois maximum.",
    label: "Date prévue de fin des épreuves ou examens : ",
    example: "18/11/2021",
    requiredMessage: "la date de fin de cycle est obligatoire",
    validateMessage: " n'est pas une date valide",
  },
  "formation.dureeFormationCalc": {
    description: "Durée de formation en mois [calculé]",
  },
  "formation.dureeFormation": {
    fieldType: "number",
    required: true,
    description:
      "La quotité de formation théorique du contrat d’apprentissage ne peut pas être inférieure à 25% de la durée globale du contrat (cette quotité de formation est calculée sur la base de la durée légale annuelle de travail, soit 1 607 heures, sauf aménagements spécifiques en cas de pratique du sport à haut niveau ou reconnaissance de handicap).",
    label: "Durée de la formation en heures :",
    example: "400",
    requiredMessage: "Le nombre d'heures de la formation est obligatoire",
    validateMessage: " n'est pas un nombre d'heures valide",
    precision: 0,
    min: 1,
  },
  "formation.dateObtentionDiplome": {
    fieldType: "date",
    description: "Date d'obtention du diplôme ou titre visé par l'Alternant",
  },
  "organismeFormation.denomination": {
    fieldType: "text",
    required: true,
    label: "Dénomination du CFA responsable :",
    requiredMessage: "la dénomination du CFA responsable est obligatoire",
    example: "CFA",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^.*$",
      },
    ],
  },
  "organismeFormation.formationInterne": {
    required: true,
    fieldType: "radio",
    description:
      "Un CFA d'entreprise est interne à l’entreprise ou constitué par plusieurs entreprises partageant des perspectives communes d’évolution des métiers ou qui interviennent dans des secteurs d’activité complémentaires.",
    label: "Le centre de formation est-il un CFA d'entreprise ?",
    requiredMessage: "Merci de préciser s'il sagit d'un CFA d'entreprise",
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
  "organismeFormation.siret": {
    fieldType: "text",
    required: true,
    description:
      "Vous devez renseigner le siret du CFA responsable. Le lieu principal de formation sera quant-à lui précisé dans la convention de formation. Le siret comporte 14 chiffres. Il doit être présent et actif dans la base Entreprises de l'INSEE (regroupant employeurs privés et publics).",
    example: "98765432400019",
    label: "N° SIRET du CFA responsable :",
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
  "organismeFormation.uaiCfa": {
    fieldType: "text",
    required: true,
    description:
      "Le numéro UAI est autocomplété ; il peut être recherché sur [le catalogue des formations en apprentissage.](https://catalogue.apprentissage.beta.gouv.fr/)",
    example: "0561910X",
    label: "N° UAI du CFA :",
    requiredMessage: "Le N° UAI de l'organisme est obligatoire",
    validateMessage: "n'est pas un uai valide",
  },
  "organismeFormation.visaCfa": {
    description: "Est visé par l'organisme de formation responsable",
  },
  "organismeFormation.adresse.numero": {
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
  "organismeFormation.adresse.voie": {
    fieldType: "text",
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
  "organismeFormation.adresse.complement": {
    fieldType: "text",
    label: "Complément d'adresse (optionnel):",
    requiredMessage: "le complement d'adress est obligatoire",
    example: "Bâtiment ; Résidence ; Entrée ; Appartement ; Escalier ; Etage",
  },
  "organismeFormation.adresse.codePostal": {
    fieldType: "text",
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
  "organismeFormation.adresse.commune": {
    fieldType: "text",
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
};
