import { shouldAskRepresentantLegal } from "../../cerfaForm/blocks/apprenti/domain/shouldAskRepresentantLegal";
import { shouldAskResponsalLegalAdresse } from "../../cerfaForm/blocks/apprenti/domain/shouldAskResponsalLegalAdresse";
import { createCopyRules } from "./utils/createCopyRules";

export const responsableLegalControl = [
  {
    deps: ["apprenti.apprentiMineur"],
    process: ({ values }) => {
      return {
        cascade: {
          "apprenti.apprentiMineurNonEmancipe":
            values.apprenti.apprentiMineur === true ? { locked: false, reset: true } : { locked: true, value: false },
        },
      };
    },
  },
  ...createCopyRules({
    copyIf: ({ values }) => values.apprenti.responsableLegal.memeAdresse,
    mapping: {
      "apprenti.adresse.numero": "apprenti.responsableLegal.adresse.numero",
      "apprenti.adresse.voie": "apprenti.responsableLegal.adresse.voie",
      "apprenti.adresse.complement": "apprenti.responsableLegal.adresse.complement",
      "apprenti.adresse.codePostal": "apprenti.responsableLegal.adresse.codePostal",
      "apprenti.adresse.commune": "apprenti.responsableLegal.adresse.commune",
      "apprenti.adresse.pays": "apprenti.responsableLegal.adresse.pays",
    },
  }),
  {
    deps: ["apprenti.apprentiMineurNonEmancipe"],
    process: ({ values, cache }) => {
      if (shouldAskRepresentantLegal({ values })) {
        const cachedValueOrResetRequired = (value) => ({ value, reset: !value, required: true });
        return {
          cache,
          cascade: {
            "apprenti.responsableLegal.nom": cachedValueOrResetRequired(cache?.nom),
            "apprenti.responsableLegal.prenom": cachedValueOrResetRequired(cache?.prenom),
            "apprenti.responsableLegal.memeAdresse": cachedValueOrResetRequired(cache?.memeAdresse),
          },
        };
      } else {
        const requiredAndReset = { reset: true, required: false };
        return {
          cache: values.apprenti.responsableLegal,
          cascade: {
            "apprenti.responsableLegal.nom": requiredAndReset,
            "apprenti.responsableLegal.prenom": requiredAndReset,
            "apprenti.responsableLegal.memeAdresse": requiredAndReset,
          },
        };
      }
    },
  },
  {
    deps: ["apprenti.apprentiMineurNonEmancipe", "apprenti.responsableLegal.memeAdresse"],
    process: ({ values, cache }) => {
      const cachedValueOrReset = (value) => ({ value, reset: !value });
      const cachedValueOrResetRequired = (value) => ({ value, reset: !value, required: true });
      if (shouldAskResponsalLegalAdresse({ values })) {
        return {
          cache,
          cascade: {
            "apprenti.responsableLegal.adresse.numero": cachedValueOrReset(cache?.numero),
            "apprenti.responsableLegal.adresse.voie": cachedValueOrResetRequired(cache?.voie),
            "apprenti.responsableLegal.adresse.complement": cachedValueOrReset(cache?.complement),
            "apprenti.responsableLegal.adresse.codePostal": cachedValueOrResetRequired(cache?.codePostal),
            "apprenti.responsableLegal.adresse.commune": cachedValueOrResetRequired(cache?.commune),
            "apprenti.responsableLegal.adresse.pays": cachedValueOrResetRequired(cache?.pays),
          },
        };
      } else {
        const requiredAndReset = { reset: true, required: false };
        return {
          cache: values.apprenti.responsableLegal.adresse,
          cascade: {
            "apprenti.responsableLegal.adresse.numero": requiredAndReset,
            "apprenti.responsableLegal.adresse.voie": requiredAndReset,
            "apprenti.responsableLegal.adresse.complement": requiredAndReset,
            "apprenti.responsableLegal.adresse.codePostal": requiredAndReset,
            "apprenti.responsableLegal.adresse.commune": requiredAndReset,
            "apprenti.responsableLegal.adresse.pays": requiredAndReset,
          },
        };
      }
    },
  },
];
