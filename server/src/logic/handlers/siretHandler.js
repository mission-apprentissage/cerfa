const entrepriseController = require("../controllers/entrepriseController");
const { getCoordinatesFromAddressData } = require("./geoHandler");

const getDataFromSiret = async (providedSiret, { withGeoloc = true } = {}) => {
  const siretData = await entrepriseController.findDataFromSiret(providedSiret);

  let geoData = {
    result: {},
    messages: {},
  };
  if (withGeoloc && Object.keys(siretData.result).length > 0) {
    const { numero_voie, type_voie, nom_voie, code_postal, localite, code_insee_localite } = siretData.result;
    geoData = await getCoordinatesFromAddressData({
      numero_voie,
      type_voie,
      nom_voie,
      code_postal,
      localite,
      code_insee: code_insee_localite,
    });
  }

  return {
    result: {
      ...siretData.result,
      ...geoData.result,
    },
    messages: {
      ...siretData.messages,
      ...geoData.messages,
    },
  };
};
module.exports.getDataFromSiret = getDataFromSiret;
