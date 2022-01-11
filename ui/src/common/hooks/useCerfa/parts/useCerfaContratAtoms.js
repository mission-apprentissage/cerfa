import { atom } from "recoil";

export const cerfaPartContratCompletionAtom = atom({
  key: "cerfa/part/contrat/completion",
  default: 0,
});

export const cerfaContratModeContractuelAtom = atom({
  key: "cerfa/contrat/modeContractuel",
  default: null,
});
export const cerfaContratTypeContratAppAtom = atom({
  key: "cerfa/contrat/typeContratApp",
  default: null,
});
export const cerfaContratNumeroContratPrecedentAtom = atom({
  key: "cerfa/contrat/numeroContratPrecedent",
  default: null,
});
export const cerfaContratNoContratAtom = atom({
  key: "cerfa/contrat/noContrat",
  default: null,
});
export const cerfaContratNoAvenantAtom = atom({
  key: "cerfa/contrat/noAvenant",
  default: null,
});
export const cerfaContratDateDebutContratAtom = atom({
  key: "cerfa/contrat/dateDebutContrat",
  default: null,
});
export const cerfaContratDateEffetAvenantAtom = atom({
  key: "cerfa/contrat/dateEffetAvenant",
  default: null,
});
export const cerfaContratDateConclusionAtom = atom({
  key: "cerfa/contrat/dateConclusion",
  default: null,
});
export const cerfaContratDateFinContratAtom = atom({
  key: "cerfa/contrat/dateFinContrat",
  default: null,
});
export const cerfaContratDateRuptureAtom = atom({
  key: "cerfa/contrat/dateRupture",
  default: null,
});
export const cerfaContratLieuSignatureContratAtom = atom({
  key: "cerfa/contrat/lieuSignatureContrat",
  default: null,
});
export const cerfaContratTypeDerogationAtom = atom({
  key: "cerfa/contrat/typeDerogation",
  default: null,
});
export const cerfaContratDureeTravailHebdoHeuresAtom = atom({
  key: "cerfa/contrat/dureeTravailHebdoHeures",
  default: null,
});
export const cerfaContratDureeTravailHebdoMinutesAtom = atom({
  key: "cerfa/contrat/dureeTravailHebdoMinutes",
  default: null,
});
export const cerfaContratTravailRisqueAtom = atom({
  key: "cerfa/contrat/travailRisque",
  default: null,
});
export const cerfaContratSalaireEmbaucheAtom = atom({
  key: "cerfa/contrat/salaireEmbauche",
  default: null,
});
export const cerfaContratCaisseRetraiteComplementaireAtom = atom({
  key: "cerfa/contrat/caisseRetraiteComplementaire",
  default: null,
});
export const cerfaContratAvantageNatureAtom = atom({
  key: "cerfa/contrat/avantageNature",
  default: null,
});
export const cerfaContratAvantageNourritureAtom = atom({
  key: "cerfa/contrat/avantageNourriture",
  default: null,
});
export const cerfaContratAvantageLogementAtom = atom({
  key: "cerfa/contrat/avantageLogement",
  default: null,
});
export const cerfaContratAutreAvantageEnNatureAtom = atom({
  key: "cerfa/contrat/autreAvantageEnNature",
  default: null,
});

// Remuneration
export const cerfaContratRemunerationMajorationAtom = atom({
  key: "cerfa/contrat/remunerationMajoration",
  default: null,
});
export const cerfaContratRemunerationsAnnuellesAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles",
  default: [],
});

///////

//1.1
export const cerfaContratRemunerationsAnnuelles11DateDebutAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/11/dateDebut",
  default: {
    description:
      "Date de début d'exécution du contrat d'apprentissage pour l'année considérée ou date de début de la seconde période si l'apprenti change de tranche d'âge au cours de l'année, quelle que soit la date de début du cycle de formation",
    example: "2021-02-01T00:00:00+0000",
    label: "Date de début",
    default: null,
    value: "",
    locked: true,
  },
});
export const cerfaContratRemunerationsAnnuelles11DateFinAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/11/dateFin",
  default: {
    description:
      "Date de fin d'exécution du contrat d'apprentissage pour l'année considérée ou date à laquelle l'apprenti change de tranche d'âge et de rémunération, quelle que soit la date de début du cycle de formation",
    example: "2021-02-28T00:00:00+0000",
    label: "Date de fin",
    default: null,
    value: "",
    locked: true,
  },
});
export const cerfaContratRemunerationsAnnuelles11TauxAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/11/taux",
  default: {
    description:
      "Taux du SMIC ou SMC applicable pour définir la rémunération de l'apprenti, en fonction de l'âge de l'apprent et de l'année d'exécution du contrat, voir notice (grille de rémunération minimale)",
    example: 75,
    label: "% de rémunération",
    default: "",
    value: 0,
    locked: true,
  },
});
export const cerfaContratRemunerationsAnnuelles11TypeSalaireAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/11/typeSalaire",
  default: {
    enum: ["SMIC", "SMC"],
    default: null,
    label: "SMIC ou SMC",
    description:
      "**Type de salaire** :\r\n<br />SMIC = salaire minimum de croissance\r\n<br />SMC = salaire minimum conventionnel",
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
    value: "SMIC",
    locked: true,
  },
});
//1.2
export const cerfaContratRemunerationsAnnuelles12DateDebutAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/12/dateDebut",
  default: {
    description:
      "Date de début d'exécution du contrat d'apprentissage pour l'année considérée ou date de début de la seconde période si l'apprenti change de tranche d'âge au cours de l'année, quelle que soit la date de début du cycle de formation",
    example: "2021-02-01T00:00:00+0000",
    label: "Date de début",
    default: null,
    value: "",
    locked: true,
  },
});
export const cerfaContratRemunerationsAnnuelles12DateFinAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/12/dateFin",
  default: {
    description:
      "Date de fin d'exécution du contrat d'apprentissage pour l'année considérée ou date à laquelle l'apprenti change de tranche d'âge et de rémunération, quelle que soit la date de début du cycle de formation",
    example: "2021-02-28T00:00:00+0000",
    label: "Date de fin",
    default: null,
    value: "",
    locked: true,
  },
});
export const cerfaContratRemunerationsAnnuelles12TauxAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/12/taux",
  default: {
    description:
      "Taux du SMIC ou SMC applicable pour définir la rémunération de l'apprenti, en fonction de l'âge de l'apprent et de l'année d'exécution du contrat, voir notice (grille de rémunération minimale)",
    example: 75,
    label: "% de rémunération",
    default: null,
    value: 0,
    locked: true,
  },
});
export const cerfaContratRemunerationsAnnuelles12TypeSalaireAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/12/typeSalaire",
  default: {
    enum: ["SMIC", "SMC"],
    default: null,
    label: "SMIC ou SMC",
    description:
      "**Type de salaire** :\r\n<br />SMIC = salaire minimum de croissance\r\n<br />SMC = salaire minimum conventionnel",
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
    value: "SMIC",
    locked: true,
  },
});

//2.1
export const cerfaContratRemunerationsAnnuelles21DateDebutAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/21/dateDebut",
  default: {
    description:
      "Date de début d'exécution du contrat d'apprentissage pour l'année considérée ou date de début de la seconde période si l'apprenti change de tranche d'âge au cours de l'année, quelle que soit la date de début du cycle de formation",
    example: "2021-02-01T00:00:00+0000",
    label: "Date de début",
    default: null,
    value: "",
    locked: true,
  },
});
export const cerfaContratRemunerationsAnnuelles21DateFinAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/21/dateFin",
  default: {
    description:
      "Date de fin d'exécution du contrat d'apprentissage pour l'année considérée ou date à laquelle l'apprenti change de tranche d'âge et de rémunération, quelle que soit la date de début du cycle de formation",
    example: "2021-02-28T00:00:00+0000",
    label: "Date de fin",
    default: null,
    value: "",
    locked: true,
  },
});
export const cerfaContratRemunerationsAnnuelles21TauxAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/21/taux",
  default: {
    description:
      "Taux du SMIC ou SMC applicable pour définir la rémunération de l'apprenti, en fonction de l'âge de l'apprent et de l'année d'exécution du contrat, voir notice (grille de rémunération minimale)",
    example: 75,
    label: "% de rémunération",
    default: null,
    value: 0,
    locked: true,
  },
});
export const cerfaContratRemunerationsAnnuelles21TypeSalaireAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/21/typeSalaire",
  default: {
    enum: ["SMIC", "SMC"],
    default: null,
    label: "SMIC ou SMC",
    description:
      "**Type de salaire** :\r\n<br />SMIC = salaire minimum de croissance\r\n<br />SMC = salaire minimum conventionnel",
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
    value: "SMIC",
    locked: true,
  },
});
//2.2
export const cerfaContratRemunerationsAnnuelles22DateDebutAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/22/dateDebut",
  default: {
    description:
      "Date de début d'exécution du contrat d'apprentissage pour l'année considérée ou date de début de la seconde période si l'apprenti change de tranche d'âge au cours de l'année, quelle que soit la date de début du cycle de formation",
    example: "2021-02-01T00:00:00+0000",
    label: "Date de début",
    default: null,
    value: "",
    locked: true,
  },
});
export const cerfaContratRemunerationsAnnuelles22DateFinAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/22/dateFin",
  default: {
    description:
      "Date de fin d'exécution du contrat d'apprentissage pour l'année considérée ou date à laquelle l'apprenti change de tranche d'âge et de rémunération, quelle que soit la date de début du cycle de formation",
    example: "2021-02-28T00:00:00+0000",
    label: "Date de fin",
    default: null,
    value: "",
    locked: true,
  },
});
export const cerfaContratRemunerationsAnnuelles22TauxAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/22/taux",
  default: {
    description:
      "Taux du SMIC ou SMC applicable pour définir la rémunération de l'apprenti, en fonction de l'âge de l'apprent et de l'année d'exécution du contrat, voir notice (grille de rémunération minimale)",
    example: 75,
    label: "% de rémunération",
    default: null,
    value: 0,
    locked: true,
  },
});
export const cerfaContratRemunerationsAnnuelles22TypeSalaireAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/22/typeSalaire",
  default: {
    enum: ["SMIC", "SMC"],
    default: "",
    label: "SMIC ou SMC",
    description:
      "**Type de salaire** :\r\n<br />SMIC = salaire minimum de croissance\r\n<br />SMC = salaire minimum conventionnel",
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
    value: "SMIC",
    locked: true,
  },
});

//3.1
export const cerfaContratRemunerationsAnnuelles31DateDebutAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/31/dateDebut",
  default: {
    description:
      "Date de début d'exécution du contrat d'apprentissage pour l'année considérée ou date de début de la seconde période si l'apprenti change de tranche d'âge au cours de l'année, quelle que soit la date de début du cycle de formation",
    example: "2021-02-01T00:00:00+0000",
    label: "Date de début",
    default: null,
    value: "",
    locked: true,
  },
});
export const cerfaContratRemunerationsAnnuelles31DateFinAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/31/dateFin",
  default: {
    description:
      "Date de fin d'exécution du contrat d'apprentissage pour l'année considérée ou date à laquelle l'apprenti change de tranche d'âge et de rémunération, quelle que soit la date de début du cycle de formation",
    example: "2021-02-28T00:00:00+0000",
    label: "Date de fin",
    default: null,
    value: "",
    locked: true,
  },
});
export const cerfaContratRemunerationsAnnuelles31TauxAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/31/taux",
  default: {
    description:
      "Taux du SMIC ou SMC applicable pour définir la rémunération de l'apprenti, en fonction de l'âge de l'apprent et de l'année d'exécution du contrat, voir notice (grille de rémunération minimale)",
    example: 75,
    label: "% de rémunération",
    default: null,
    value: 0,
    locked: true,
  },
});
export const cerfaContratRemunerationsAnnuelles31TypeSalaireAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/31/typeSalaire",
  default: {
    enum: ["SMIC", "SMC"],
    default: null,
    label: "SMIC ou SMC",
    description:
      "**Type de salaire** :\r\n<br />SMIC = salaire minimum de croissance\r\n<br />SMC = salaire minimum conventionnel",
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
    value: "SMIC",
    locked: true,
  },
});
//3.2
export const cerfaContratRemunerationsAnnuelles32DateDebutAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/32/dateDebut",
  default: {
    description:
      "Date de début d'exécution du contrat d'apprentissage pour l'année considérée ou date de début de la seconde période si l'apprenti change de tranche d'âge au cours de l'année, quelle que soit la date de début du cycle de formation",
    example: "2021-02-01T00:00:00+0000",
    label: "Date de début",
    default: null,
    value: "",
    locked: true,
  },
});
export const cerfaContratRemunerationsAnnuelles32DateFinAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/32/dateFin",
  default: {
    description:
      "Date de fin d'exécution du contrat d'apprentissage pour l'année considérée ou date à laquelle l'apprenti change de tranche d'âge et de rémunération, quelle que soit la date de début du cycle de formation",
    example: "2021-02-28T00:00:00+0000",
    label: "Date de fin",
    default: null,
    value: "",
    locked: true,
  },
});
export const cerfaContratRemunerationsAnnuelles32TauxAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/32/taux",
  default: {
    description:
      "Taux du SMIC ou SMC applicable pour définir la rémunération de l'apprenti, en fonction de l'âge de l'apprent et de l'année d'exécution du contrat, voir notice (grille de rémunération minimale)",
    example: 75,
    label: "% de rémunération",
    default: null,
    value: 0,
    locked: true,
  },
});
export const cerfaContratRemunerationsAnnuelles32TypeSalaireAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/32/typeSalaire",
  default: {
    enum: ["SMIC", "SMC"],
    default: null,
    label: "SMIC ou SMC",
    description:
      "**Type de salaire** :\r\n<br />SMIC = salaire minimum de croissance\r\n<br />SMC = salaire minimum conventionnel",
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
    value: "SMIC",
    locked: true,
  },
});

//4.1
export const cerfaContratRemunerationsAnnuelles41DateDebutAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/41/dateDebut",
  default: {
    description:
      "Date de début d'exécution du contrat d'apprentissage pour l'année considérée ou date de début de la seconde période si l'apprenti change de tranche d'âge au cours de l'année, quelle que soit la date de début du cycle de formation",
    example: "2021-02-01T00:00:00+0000",
    label: "Date de début",
    default: null,
    value: "",
    locked: true,
  },
});
export const cerfaContratRemunerationsAnnuelles41DateFinAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/41/dateFin",
  default: {
    description:
      "Date de fin d'exécution du contrat d'apprentissage pour l'année considérée ou date à laquelle l'apprenti change de tranche d'âge et de rémunération, quelle que soit la date de début du cycle de formation",
    example: "2021-02-28T00:00:00+0000",
    label: "Date de fin",
    default: null,
    value: "",
    locked: true,
  },
});
export const cerfaContratRemunerationsAnnuelles41TauxAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/41/taux",
  default: {
    description:
      "Taux du SMIC ou SMC applicable pour définir la rémunération de l'apprenti, en fonction de l'âge de l'apprent et de l'année d'exécution du contrat, voir notice (grille de rémunération minimale)",
    example: 75,
    label: "% de rémunération",
    default: null,
    value: 0,
    locked: true,
  },
});
export const cerfaContratRemunerationsAnnuelles41TypeSalaireAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/41/typeSalaire",
  default: {
    enum: ["SMIC", "SMC"],
    default: null,
    label: "SMIC ou SMC",
    description:
      "**Type de salaire** :\r\n<br />SMIC = salaire minimum de croissance\r\n<br />SMC = salaire minimum conventionnel",
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
    value: "SMIC",
    locked: true,
  },
});
//4.2
export const cerfaContratRemunerationsAnnuelles42DateDebutAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/42/dateDebut",
  default: {
    description:
      "Date de début d'exécution du contrat d'apprentissage pour l'année considérée ou date de début de la seconde période si l'apprenti change de tranche d'âge au cours de l'année, quelle que soit la date de début du cycle de formation",
    example: "2021-02-01T00:00:00+0000",
    label: "Date de début",
    default: null,
    value: "",
    locked: true,
  },
});
export const cerfaContratRemunerationsAnnuelles42DateFinAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/42/dateFin",
  default: {
    description:
      "Date de fin d'exécution du contrat d'apprentissage pour l'année considérée ou date à laquelle l'apprenti change de tranche d'âge et de rémunération, quelle que soit la date de début du cycle de formation",
    example: "2021-02-28T00:00:00+0000",
    label: "Date de fin",
    default: null,
    value: "",
    locked: true,
  },
});
export const cerfaContratRemunerationsAnnuelles42TauxAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/42/taux",
  default: {
    description:
      "Taux du SMIC ou SMC applicable pour définir la rémunération de l'apprenti, en fonction de l'âge de l'apprent et de l'année d'exécution du contrat, voir notice (grille de rémunération minimale)",
    example: 75,
    label: "% de rémunération",
    default: null,
    value: 0,
    locked: true,
  },
});
export const cerfaContratRemunerationsAnnuelles42TypeSalaireAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles/42/typeSalaire",
  default: {
    enum: ["SMIC", "SMC"],
    default: null,
    label: "SMIC ou SMC",
    description:
      "**Type de salaire** :\r\n<br />SMIC = salaire minimum de croissance\r\n<br />SMC = salaire minimum conventionnel",
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
    value: "SMIC",
    locked: true,
  },
});
