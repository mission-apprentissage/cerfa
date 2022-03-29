export const patchFieldReducer = ({ fields, name, patch }) => ({
  ...fields,
  [name]: { ...fields[name], ...patch },
});
