export const dateSignatureContratControl = [
  {
    deps: ["contrat.dateDebutContrat", "contrat.dateConclusion", "contrat.typeContratApp"],
    process: ({ values, fields }) => {
      const typeContratApp = values.contrat.typeContratApp;
      const contratInitial = typeContratApp === 11;

      const dateDebutContrat = values.contrat.dateDebutContrat;
      const dateConclusionContrat = values.contrat.dateConclusion;

      if (!dateConclusionContrat || !dateDebutContrat || !typeContratApp) return;

      if (contratInitial && dateConclusionContrat > dateDebutContrat) {
        return { error: "Date de signature de contrat ne peut pas être après la date de début de contrat" };
      }
    },
  },
  {
    deps: ["contrat.dateConclusion", "contrat.dateEffetAvenant", "contrat.typeContratApp"],
    process: ({ values, fields }) => {
      const typeContratApp = values.contrat.typeContratApp;
      const hasAvenant = [31, 32, 33, 34, 35, 36, 37].includes(typeContratApp);

      const dateEffetAvenant = values.contrat.dateEffetAvenant;
      const dateConclusionContrat = values.contrat.dateConclusion;

      if (!dateConclusionContrat || !dateEffetAvenant || !typeContratApp) return;

      if (hasAvenant && dateConclusionContrat > dateEffetAvenant) {
        return { error: "Date de signature de contrat ne peut pas être après la date d'effet de l'avenant" };
      }
    },
  },
];
