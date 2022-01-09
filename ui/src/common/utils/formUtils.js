export const convertValueToOption = (field) => {
  let valueOpt = "";
  for (let i = 0; i < field.options.length; i++) {
    const options = field.options[i];
    if (options.value === field.value) {
      valueOpt = options.label;
    }
  }
  return {
    ...field,
    value: valueOpt,
  };
};
