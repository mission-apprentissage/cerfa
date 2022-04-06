export const apprentiMineurLogics = [
  {
    deps: ["apprenti.apprentiMineur"],
    process: ({ values }) => {
      return {
        cascade: {
          "employeur.adresse.voie": undefined,
          "apprenti.apprentiMineurNonEmancipe":
            values.apprenti.apprentiMineur === true ? { locked: false, value: "" } : { locked: true, value: false },
        },
      };
    },
  },
];
