import { getValues } from "./getValues";

export const validGlobalRules = async ({ name, fields, rules }) => {
  const values = getValues(fields);
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
