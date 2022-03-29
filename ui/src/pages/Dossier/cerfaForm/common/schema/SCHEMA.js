export const SCHEMA = {
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
};

export const defaultValues = Object.fromEntries(
  Object.entries(SCHEMA).map(([name, { defaultValue }]) => [name, defaultValue])
);

export const fieldKeys = Object.keys(SCHEMA);

const requiredLabel = "Cette information est nécessaire";
