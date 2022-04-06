export const isRequired = (field, values) =>
  typeof field.required === "function" ? field.required({ values: values }) : !!field.required;
