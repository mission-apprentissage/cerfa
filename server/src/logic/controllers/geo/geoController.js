const geoAdresseData = require("./geoAdresseData");
const fs = require("fs-extra");
const path = require("path");

class GeoController {
  constructor() {
    this.departements = fs.readJsonSync(path.resolve(__dirname, "../../assets/dataDepartements.json"));
  }

  async findCode(code, codeInsee) {
    try {
      const { records = [] } = await geoAdresseData.getMunicipality(code, codeInsee);
      if (records.length === 0) {
        return {
          info: "Erreur: Non trouvé",
          value: null,
        };
      }
      const {
        fields: { insee_com, code_dept, postal_code, nom_comm },
      } = records[0];
      const value = { insee_com, code_dept, postal_code, nom_comm };

      if (insee_com === code) {
        return {
          info: "Ok",
          update: `Le code ${code} est un code commune insee`,
          value,
        };
      }
      return {
        info: "Ok",
        value,
      };
    } catch (error) {
      return error;
    }
  }

  findDataByDepartementNum(code_dept) {
    const data = this.departements[code_dept];
    if (!data) {
      return { nom_dept: null, nom_region: null, code_region: null, nom_academie: null, num_academie: null };
    }

    const { nom_dept, nom_region, code_region, nom_academie, num_academie } = data;
    return { nom_dept, nom_region, code_region, nom_academie, num_academie };
  }

  async findGeoCoordinateFromAdresse({ numero_voie, type_voie, nom_voie, code_postal, localite, code_insee }) {
    const { geo_coordonnees, results_count } = await geoAdresseData.getGeoCoordinateFromAdresse({
      numero_voie,
      type_voie,
      nom_voie,
      code_postal,
      localite,
      code_insee,
    });

    return {
      info: `Ok`,
      value: geo_coordonnees,
      count: results_count,
    };
  }

  async findAddressFromGeoCoordinates({ latitude, longitude }) {
    const { address, results_count } = await geoAdresseData.getAddressFromGeoCoordinates({ latitude, longitude });
    return {
      info: `Ok`,
      value: address,
      count: results_count,
    };
  }

  isValidCodePostal(codePostal) {
    return /^[0-9]{5}$/g.test(codePostal);
  }

  /**
   * Le code commune Insee contient cinq chiffres ou lettres (Corse 2A - 2B)
   */
  isValidCodeInsee(codeInsee) {
    return /^[a-zA-Z0-9]{5}$/g.test(codeInsee);
  }
}

const geoController = new GeoController();
module.exports = geoController;
