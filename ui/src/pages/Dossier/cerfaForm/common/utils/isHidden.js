export const isHidden = (field, values) =>
  typeof field?.hidden === "function" ? field?.hidden?.({ values, field }) : field?.hidden;
