import { requiredLabel } from "./validationUtils";
import { _post } from "../../../../common/httpClient";

export const employerSchema = {
  "employeur.siret": {
    defaultState: {
      value: "ll",
    },
    validate: async ({ value, values, dossier }) => {
      if (!value) return { error: requiredLabel };
      if (!/^([0-9]{14})$/.test(value)) {
        return { error: `${value} n'est pas un siret valide` };
      }

      const response = await _post(`/api/v1/siret`, {
        siret: value,
        dossierId: dossier._id,
      });

      return {
        cascade: {
          "employeur.denomination": { value: "decathlon", locked: false },
          "employeur.adresse.numero": { value: 12, locked: false },
          "employeur.adresse.voie": { value: "rue du Lac", locked: false },
        },
      };

      const resultLength = Object.keys(response.result).length;

      if (resultLength === 0) {
        return {
          error: response.messages.error,
        };
      }

      if (response.result.api_entreprise === "KO") {
        return {
          error: `Le service de récupération des informations Siret est momentanément indisponible. Nous ne pouvons pas pre-remplir le formulaire.`,
        };
      }

      if (response.result.ferme) {
        return {
          error: `Le Siret ${value} est un établissement fermé.`,
        };
      }

      if (response.result.secretSiret) {
        return {
          error: `Votre siret est valide. En revanche, en raison de sa nature, nous ne pouvons pas récupérer les informations reliées.`,
        };
      }

      return {
        cascade: {
          "employeur.denomination": { value: "decathlon", locked: false },
          "employeur.adresse.numero": { value: 12, locked: false },
          "employeur.adresse.voie": { value: "rue du Lac", locked: false },
        },
      };
    },
  },
  "employeur.denomination": {
    validate: ({ value }) => value || { error: requiredLabel },
    defaultState: {
      value: "",
      locked: true,
    },
  },
  "employeur.adresse.numero": {
    validate: ({ value }) => value || { error: requiredLabel },
    defaultState: {
      value: "",
      locked: true,
    },
  },
  "employeur.adresse.voie": {
    validate: ({ value }) => value || { error: requiredLabel },
    defaultState: {
      value: "",
      locked: true,
    },
  },
};
