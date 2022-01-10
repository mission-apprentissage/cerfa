import { DateTime } from "luxon";

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

export const convertValueToMultipleSelectOption = (field) => {
  let valueOpt = "";
  for (let i = 0; i < field.options.length; i++) {
    const options = field.options[i];
    for (let j = 0; j < options.options.length; j++) {
      const option = options.options[j];
      if (option.value === field.value) {
        valueOpt = option.label;
      }
    }
  }
  return {
    ...field,
    value: valueOpt,
  };
};

export const convertValueToDate = (field) => {
  return {
    ...field,
    value: field.value ? DateTime.fromISO(field.value).setLocale("fr-FR").toFormat("yyyy-MM-dd") : field.value,
  };
};

//

export const convertOptionToValue = (field) => {
  let value = null;
  for (let i = 0; i < field.options.length; i++) {
    const options = field.options[i];
    if (options.label === field.value) {
      value = options.value;
    }
  }
  return value;
};

export const convertMultipleSelectOptionToValue = (field) => {
  let value = null;
  for (let i = 0; i < field.options.length; i++) {
    const options = field.options[i];
    for (let j = 0; j < options.options.length; j++) {
      const option = options.options[j];
      if (option.label === field.value) {
        value = option.value;
      }
    }
  }
  return value;
};

export const convertDateToValue = (field) => {
  return DateTime.fromISO(field.value).setLocale("fr-FR").toISO();
};

//

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
