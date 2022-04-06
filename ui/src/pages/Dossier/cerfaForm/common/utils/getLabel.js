export const getLabel = (field, values) =>
  typeof field?.label === "function" ? field?.label?.({ values, field }) : field?.label;
