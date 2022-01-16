import { DateTime } from "luxon";

export const convertValueToOption = (field) => {
  let valueOpt = "";
  let valueDb = field.value;
  for (let i = 0; i < field.options.length; i++) {
    const options = field.options[i];
    if (options.value === field.value) {
      valueOpt = options.label;
    }
  }
  return {
    ...field,
    value: valueOpt,
    valueDb,
  };
};

export const convertValueToMultipleSelectOption = (field) => {
  let valueOpt = "";
  let valueDb = field.value;
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
    valueDb,
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
  if (!field) return null;
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

//

export const isAgeInValidAtDate = ({ dateNaissance, age, dateString, limitAge = 15, label = "" }) => {
  // console.log(age === limitAge - 1 && dateString !== "", limitAge - 1, dateString, age);
  if (age === limitAge - 1 && dateString !== "") {
    const dateObj = DateTime.fromISO(dateString).setLocale("fr-FR");
    const anniversaireA1 = dateNaissance.plus({ years: age + 1 });
    // console.log(
    //   dateObj < anniversaireA1,
    //   dateObj.toFormat("yyyy-MM-dd"),
    //   dateNaissance.toFormat("yyyy-MM-dd"),
    //   anniversaireA1.toFormat("yyyy-MM-dd")
    // );
    if (dateObj < anniversaireA1) {
      return {
        successed: false,
        data: null,
        message: label,
      };
    }
  }
  return false;
};

export const caclAgeFromStringDate = (dateNaissanceString) => {
  const dateNaissance = DateTime.fromISO(dateNaissanceString).setLocale("fr-FR");
  const today = DateTime.now().setLocale("fr-FR");
  const diffInYears = today.diff(dateNaissance, "years");
  const { years } = diffInYears.toObject();
  const age = years ? Math.floor(years) : 0;
  return {
    age,
    dateNaissance: age > 0 ? dateNaissance : null,
  };
};

export const normalizeInputNumberForDb = (data) => (data && !isNaN(data) && parseInt(data) !== 0 ? data : null);
