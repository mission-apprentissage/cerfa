export const dateSignatureContratControl = [
  {
    deps: ["contrat.dateDebutContrat", "contrat.dateConclusion", "contrat.typeContratApp"],
    process: ({ values }) => {
      const typeContratApp = values.contrat.typeContratApp;
      const dateDebutContrat = values.contrat.dateDebutContrat;
      const dateConclusionContrat = values.contrat.dateConclusion;

      if (!dateConclusionContrat || !dateDebutContrat || !typeContratApp) return;

      if (!hasAvenant(typeContratApp) && dateConclusionContrat > dateDebutContrat) {
        return { error: "Date de signature de contrat ne peut pas être après la date de début de contrat" };
      }
    },
  },
  {
    deps: ["contrat.dateConclusion", "contrat.dateEffetAvenant", "contrat.typeContratApp"],
    process: ({ values }) => {
      const typeContratApp = values.contrat.typeContratApp;

      const dateEffetAvenant = values.contrat.dateEffetAvenant;
      const dateConclusionContrat = values.contrat.dateConclusion;

      if (!dateConclusionContrat || !dateEffetAvenant || !typeContratApp) return;

      if (hasAvenant(typeContratApp) && dateConclusionContrat > dateEffetAvenant) {
        return { error: "Date de signature de contrat ne peut pas être après la date d'effet de l'avenant" };
      }
    },
  },
];

const hasAvenant = (typeContratApp) => {
  return typeContratApp >= 30;
};
