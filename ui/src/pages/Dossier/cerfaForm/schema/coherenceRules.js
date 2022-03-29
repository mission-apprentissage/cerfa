export const coherenceRules = [
  {
    deps: ["siret", "name"],
    validate: ({ values }) => {
      return { error: "shit" };
    },
  },
];
