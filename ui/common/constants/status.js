export const DOSSIER_STATUS = {
  BROUILLON: {
    priority: 0,
    text: "Brouillon",
  },
  DOSSIER_FINALISE_EN_ATTENTE_ACTION: {
    priority: 1,
    text: "En cours de signature",
  },
  EN_ATTENTE_DECLENCHEMENT_SIGNATURES: {
    priority: 2,
    text: "En cours de signature",
  },
  EN_ATTENTE_SIGNATURE: {
    priority: 2,
    text: "En attente de signature",
  },
  EN_ATTENTE_SIGNATURES: {
    priority: 2,
    text: "En cours de signature",
  },
  SIGNATURES_EN_COURS: {
    priority: 2,
    text: "En cours de signature",
  },
  SIGNATURES_REFUS: {
    priority: 2,
    text: "Signature refusée",
  },
  SIGNE: {
    priority: 2,
    text: "Signé",
  },
  REFUS: {
    priority: 2,
    text: "Refusé",
  },
  DOSSIER_TERMINE_AVEC_SIGNATURE: {
    priority: 3,
    text: "À télétransmettre",
  },
  DOSSIER_TERMINE_SANS_SIGNATURE: {
    priority: 3,
    text: "À télétransmettre",
  },
  TRANSMIS: {
    priority: 4,
    text: "Transmis",
  },
  EN_COURS_INSTRUCTION: {
    priority: 5,
    text: "En cours d'instruction",
  },
  INCOMPLET: {
    priority: 6,
    // text: "À modifier",
    text: "Non déposable",
  },
  DEPOSE: {
    priority: 6,
    text: "Validé",
  },
  REFUSE: {
    priority: 6,
    text: "Non déposable",
  },
  ENGAGE: {
    priority: 7,
    text: "Contrat en cours",
  },
  ANNULE: {
    priority: 7,
    text: "Annulé",
  },
  RUTPURE: {
    priority: 7,
    text: "Rupture",
  },
  SOLDE: {
    priority: 7,
    text: "Terminé",
  },
};
