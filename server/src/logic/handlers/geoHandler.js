const geoController = require("../controllers/geo/geoController");

const getDataFromCP = async (providedCP, providedCodeInsee) => {
  if (!providedCP || !geoController.isValidCodePostal(providedCP.trim())) {
    return {
      result: {},
      messages: {
        error: `Erreur: Le code postal fourni doit être définit et au format 5 caractères ${providedCP}`,
      },
    };
  }

  if (providedCodeInsee && !geoController.isValidCodeInsee(providedCodeInsee.trim())) {
    return {
      result: {},
      messages: {
        error: `Erreur: Le code insee fourni doit être définit et au format 5 caractères ${providedCodeInsee}`,
      },
    };
  }

  const codePostal = `${providedCP}`.trim();
  const codeInsee = providedCodeInsee ? `${providedCodeInsee}`.trim() : null;

  const { info, value, update } = await geoController.findCode(codePostal, codeInsee);

  if (!value) {
    return {
      result: {},
      messages: {
        error: `Erreur: Le code postal fourni est introuvable ${providedCP}${
          providedCodeInsee ? ` (Code Insee : ${providedCodeInsee})` : ""
        }`,
      },
    };
  }

  const { insee_com, code_dept, postal_code, nom_comm } = value;

  const { nom_dept, nom_region, code_region, nom_academie, num_academie } = geoController.findDataByDepartementNum(
    code_dept
  );

  return {
    result: {
      code_postal: postal_code,
      code_commune_insee: insee_com,
      commune: nom_comm,
      num_departement: code_dept,
      nom_departement: nom_dept,
      region: nom_region,
      num_region: code_region,
      nom_academie: nom_academie,
      num_academie: num_academie,
    },
    messages: {
      cp: info,
      update: update ? update : "",
    },
  };
};

const getCoordinatesFromAddressData = async ({
  numero_voie,
  type_voie,
  nom_voie,
  code_postal,
  localite,
  code_insee,
}) => {
  const coordUpdated = await geoController.findGeoCoordinateFromAdresse({
    numero_voie,
    type_voie,
    nom_voie,
    code_postal,
    localite,
    code_insee,
  });

  return {
    result: {
      geo_coordonnees: coordUpdated.value,
      results_count: coordUpdated.count,
    },
    messages: {
      geo_coordonnees: coordUpdated.info,
    },
  };
};

const getAddressDataFromCoordinates = async ({ latitude, longitude }) => {
  const result = await geoController.findAddressFromGeoCoordinates({ latitude, longitude });

  if (result.count === 0) {
    return {
      result: {},
      messages: {
        error: `Erreur: Aucun résultat pour les coordonnées ${latitude}, ${longitude}`,
      },
    };
  }

  const { insee_com, code_dept, postal_code, nom_comm, nom_voie, numero_voie, type_voie } = result.value;

  const { nom_dept, nom_region, code_region, nom_academie, num_academie } = geoController.findDataByDepartementNum(
    code_dept
  );

  return {
    result: {
      adresse: {
        numero_voie,
        type_voie,
        nom_voie,
        code_postal: postal_code,
        code_commune_insee: insee_com,
        commune: nom_comm,
        num_departement: code_dept,
        nom_departement: nom_dept,
        region: nom_region,
        num_region: code_region,
        nom_academie: nom_academie,
        num_academie: `${num_academie}`,
      },
      results_count: result.count,
    },
    messages: {
      adresse: result.info,
    },
  };
};

module.exports = {
  getCoordinatesFromAddressData,
  getDataFromCP,
  getAddressDataFromCoordinates,
};
