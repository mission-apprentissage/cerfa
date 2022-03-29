export const validGlobalRules = async ({ name, values, rules }) => {
  let keepedError;

  rules
    .filter((rule) => rule.deps.includes(name))
    .some((rule) => {
      const { error } =
        rule.validate?.({
          values: values,
        }) ?? {};
      if (error) {
        rule.currentTarget = name;
        keepedError = error;
        return true;
      }
      return false;
    });
  return keepedError;
};
