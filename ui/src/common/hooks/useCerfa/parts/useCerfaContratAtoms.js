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
export const cerfaContratNumeroContratPrecedentDepartementAtom = atom({
  key: "cerfa/contrat/numeroContratPrecedent/departement",
  default: null,
});
export const cerfaContratNumeroContratPrecedentAnneeAtom = atom({
  key: "cerfa/contrat/numeroContratPrecedent/annee",
  default: null,
});
export const cerfaContratNumeroContratPrecedentMoisAtom = atom({
  key: "cerfa/contrat/numeroContratPrecedent/mois",
  default: null,
});
export const cerfaContratNumeroContratPrecedentNcAtom = atom({
  key: "cerfa/contrat/numeroContratPrecedent/nc",
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
export const cerfaContratDureeContratAtom = atom({
  key: "cerfa/contrat/dureeContrat",
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
export const cerfaContratRemunerationsAnnuellesAtom = atom({
  key: "cerfa/contrat/remunerationsAnnuelles",
  default: [],
});
export const cerfaContratSalaireEmbaucheAtom = atom({
  key: "cerfa/contrat/salaireEmbauche",
  default: null,
});
export const cerfaContratSmicAtom = atom({
  key: "cerfa/contrat/smic",
  default: null,
});
///////

export const defaultDateDebut = {
  description:
    "Date de début d'exécution du contrat d'apprentissage pour l'année considérée ou date de début de la seconde période si l'apprenti change de tranche d'âge au cours de l'année, quelle que soit la date de début du cycle de formation",
  example: "2021-02-01T00:00:00+0000",
  label: "Date de début",
  default: null,
  value: "",
  locked: true,
};

export const defaultDateFin = {
  description:
    "Date de fin d'exécution du contrat d'apprentissage pour l'année considérée ou date à laquelle l'apprenti change de tranche d'âge et de rémunération, quelle que soit la date de début du cycle de formation",
  example: "2021-02-28T00:00:00+0000",
  label: "Date de fin",
  default: null,
  value: "",
  locked: true,
};

export const defaultTaux = {
  description:
    "Taux du SMIC ou SMC applicable pour définir la rémunération de l'apprenti, en fonction de l'âge de l'apprent et de l'année d'exécution du contrat, voir notice (grille de rémunération minimale)",
  example: 75,
  label: "% de rémunération du SMIC",
  requiredMessage: "le taux de rémunération est obligatoire",
  default: "",
  value: 0,
  locked: false,
  mask: "P %",
  maskBlocks: [
    {
      name: "P",
      mask: "Number",
      signed: true, // disallow negative
      normalizeZeros: true, // appends or removes zeros at ends
      max: 10000,
    },
  ],
};
export const defaultTauxMinimal = {
  description: "Seuil légal en %",
  example: 57,
  label: "% de rémunération du SMIC",
  default: "",
  value: 0,
  locked: true,
};

export const defaultSalaireBrut = {
  description: "Salaire brut [Calculé]",
  example: 75,
  default: "",
  value: 0,
  locked: true,
};

export const defaultTypeSalaire = {
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
};
