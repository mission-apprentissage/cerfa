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
        return {
          cascade: {
            "apprenti.responsableLegal.nom": { required: true, value: cache?.nom, reset: !cache?.nom },
            "apprenti.responsableLegal.prenom": { required: true, value: cache?.prenom, reset: !cache?.prenom },
            "apprenti.responsableLegal.memeAdresse": {
              required: true,
              value: cache?.memeAdresse,
              reset: !cache?.memeAdresse,
            },
          },
        };
      } else {
        return {
          cache: values.apprenti.responsableLegal,
          cascade: {
            "apprenti.responsableLegal.nom": { reset: true, required: false },
            "apprenti.responsableLegal.prenom": { reset: true, required: false },
            "apprenti.responsableLegal.memeAdresse": { reset: true, required: false },
          },
        };
      }
    },
  },
  {
    deps: ["apprenti.apprentiMineurNonEmancipe", "apprenti.responsableLegal.memeAdresse"],
    process: ({ values, cache }) => {
      if (shouldAskResponsalLegalAdresse({ values })) {
        return {
          cascade: {
            "apprenti.responsableLegal.adresse.numero": { value: cache?.numero, reset: !cache?.numero },
            "apprenti.responsableLegal.adresse.voie": { required: true, value: cache?.voie, reset: !cache?.voie },
            "apprenti.responsableLegal.adresse.complement": { value: cache?.complement, reset: !cache?.complement },
            "apprenti.responsableLegal.adresse.codePostal": {
              required: true,
              value: cache?.codePostal,
              reset: !cache?.codePostal,
            },
            "apprenti.responsableLegal.adresse.commune": {
              required: true,
              value: cache?.commune,
              reset: !cache?.commune,
            },
            "apprenti.responsableLegal.adresse.pays": { required: true, value: cache?.pays, reset: !cache?.pays },
          },
        };
      } else {
        return {
          cache: values.apprenti.responsableLegal.adresse,
          cascade: {
            "apprenti.responsableLegal.adresse.numero": { reset: true },
            "apprenti.responsableLegal.adresse.voie": { required: true, reset: true },
            "apprenti.responsableLegal.adresse.complement": { reset: true },
            "apprenti.responsableLegal.adresse.codePostal": { required: true, reset: true },
            "apprenti.responsableLegal.adresse.commune": { required: true, reset: true },
            "apprenti.responsableLegal.adresse.pays": { required: true, reset: true },
          },
        };
      }
    },
  },
];
