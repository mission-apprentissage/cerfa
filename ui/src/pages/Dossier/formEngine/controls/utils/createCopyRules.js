export const createCopyRules = ({ mapping, copyIf }) => {
  return Object.entries(mapping).map(([from, target]) => ({
    deps: [from, target],
    process: ({ values, fields }) => {
      console.log("copy", from, target);
      if (copyIf({ values })) {
        return {
          cascade: {
            [target]: {
              value: fields[from].value,
              cascade: false,
            },
          },
        };
      }
    },
  }));
};
