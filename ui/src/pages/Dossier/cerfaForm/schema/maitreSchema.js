import { requiredLabel } from "./validationUtils";

export const maitreSchema = {
  "maitre1.nom": {
    defaultState: {
      value: "",
    },
    validate: ({ value }) => value || { error: requiredLabel },
  },
  "maitre1.prenom": {
    defaultState: {
      value: "",
    },
    validate: ({ value }) => value || { error: requiredLabel },
  },
  "maitre1.dateNaissance": {
    defaultState: {
      value: "",
    },
    validate: ({ value }) => value || { error: requiredLabel },
  },
  "maitre2.nom": {
    defaultState: {
      value: "",
    },
  },
  "maitre2.prenom": {
    defaultState: {
      value: "",
    },
  },
  "maitre2.dateNaissance": {
    defaultState: {
      value: "",
    },
  },
};
