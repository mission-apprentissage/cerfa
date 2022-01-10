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

export const fieldCompletionPercentage = (fields, nbFields) => {
  const keys = Object.keys(fields);
  let countFilledField = 0;
  for (let index = 0; index < keys.length; index++) {
    const field = fields[keys[index]];
    if (field?.value !== "") {
      countFilledField++;
    }
  }
  const percent = (countFilledField * 100) / nbFields;
  return percent;
};
