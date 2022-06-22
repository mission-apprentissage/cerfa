import { DateTime } from "luxon";
import { _post } from "../httpClient";

export const caclAgeAtDate = (dateNaissanceString, dateString) => {
  const dateNaissance = DateTime.fromISO(dateNaissanceString).setLocale("fr-FR");
  const dateObj = DateTime.fromISO(dateString).setLocale("fr-FR");
  const diffInYears = dateObj.diff(dateNaissance, "years");
  const { years } = diffInYears.toObject();
  const age = years ? Math.floor(years) : 0;
  return {
    age,
    exactAge: years,
  };
};

export const normalizeInputNumberForDb = (data) => (data && !isNaN(data) && parseInt(data) !== 0 ? data : null);

export const doAsyncCodePostalActions = async (value, data, dossierId) => {
  try {
    const response = await _post(`/api/v1/geo/cp`, {
      codePostal: value,
      dossierId,
    });

    if (response.messages.cp === "Ok") {
      return {
        successed: true,
        data: {
          codePostal: value,
          commune: response.result.commune,
          departement: response.result.num_departement,
          region: response.result.num_region,
        },
        message: null,
      };
    }

    return {
      successed: false,
      data: null,
      message: response.messages.error,
    };
  } catch (error) {
    return {
      successed: false,
      data: null,
      message: error.prettyMessage,
    };
  }
};
