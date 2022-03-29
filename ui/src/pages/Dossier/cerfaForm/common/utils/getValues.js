import set from "lodash.set";

export const getValues = (fields) => {
  const values = {};
  Object.entries(fields).forEach(([key, field]) => {
    set(values, key, field.value);
  });
  return values;
};
