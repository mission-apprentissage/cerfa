import { DateTime } from "luxon";

export const ContratDatesLogics = [
  {
    deps: ["contrat.dateDebutContrat", "contrat.dateFinContrat"],
    process: ({ values }) => {
      if (!values.contrat.dateDebutContrat || !values.contrat.dateFinContrat) return;
      const dateDebutContrat = DateTime.fromISO(values.contrat.dateDebutContrat).setLocale("fr-FR");
      const dateFinContrat = DateTime.fromISO(values.contrat.dateFinContrat).setLocale("fr-FR");
      const dureeContrat = dateFinContrat.diff(dateDebutContrat, "months").months;
      if (dureeContrat < 0) {
        return {
          error: "Date de début de contrat ne peut pas être après la date de fin de contrat",
        };
      }
    },
  },
  {
    deps: ["contrat.dateDebutContrat", "contrat.dateFinContrat"],
    process: ({ values }) => {
      if (!values.contrat.dateDebutContrat || !values.contrat.dateFinContrat) return;
      const dateDebutContrat = DateTime.fromISO(values.contrat.dateDebutContrat).setLocale("fr-FR");
      const dateFinContrat = DateTime.fromISO(values.contrat.dateFinContrat).setLocale("fr-FR");
      const dureeContrat = dateFinContrat.diff(dateDebutContrat, "months").months;
      if (dureeContrat < 6) {
        return { error: "La durée du contrat ne peut pas être inférieure à 6 mois" };
      }
    },
  },
  {
    deps: ["contrat.dateDebutContrat", "contrat.dateFinContrat"],
    process: ({ values }) => {
      if (!values.contrat.dateDebutContrat || !values.contrat.dateFinContrat) return;
      const dateDebutContrat = DateTime.fromISO(values.contrat.dateDebutContrat).setLocale("fr-FR");
      const dateFinContrat = DateTime.fromISO(values.contrat.dateFinContrat).setLocale("fr-FR");
      const dureeContrat = dateFinContrat.diff(dateDebutContrat, "months").months;
      if (dureeContrat > 54) {
        return {
          error: "La durée du contrat ne peut pas être supérieure à 4 ans et 6 mois",
        };
      }
    },
  },
  {
    deps: ["contrat.dateDebutContrat", "contrat.dateEffetAvenant"],
    process: ({ values }) => {
      if (!values.contrat.dateDebutContrat || !values.contrat.dateEffetAvenant) return;
      const dateDebutContrat = DateTime.fromISO(values.contrat.dateDebutContrat).setLocale("fr-FR");
      const dateEffetAvenant = DateTime.fromISO(values.contrat.dateEffetAvenant).setLocale("fr-FR");
      if (dateDebutContrat > dateEffetAvenant) {
        return {
          error: "Date de début de contrat ne peut pas être après la date d'effet de l'avenant",
        };
      }
    },
  },
];
