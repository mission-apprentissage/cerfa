const logger = require("../../common/logger");
const path = require("path");
const fs = require("fs-extra");
const { getDataFromSiret } = require("../../logic/handlers/siretHandler");
const { runScript } = require("../scriptWrapper");

const importer = async (db, assetsDir = path.join(__dirname, "./assets")) => {
  logger.info(`[Add info to users] Starting`);

  // CSV import
  const EXTRACT_PATH = path.join(assetsDir, "ExtractUsersOrigin-19052022.json");
  const users = await fs.readJson(EXTRACT_PATH);
  const nUsers = [];
  try {
    for (const user of users) {
      const data = await getDataFromSiret(user.siret);
      // console.log(data);
      if (data) {
        const {
          siege_social,
          enseigne,
          adresse,
          numero_voie,
          type_voie,
          nom_voie,
          complement_adresse,
          code_postal,
          num_departement,
          localite,
          code_insee_localite,
          cedex,
          region,
        } = data;
        nUsers.push({
          ...user,
          siege_social: siege_social,
          enseigne: enseigne,
          adresse: adresse,
          numero_voie: numero_voie,
          type_voie: type_voie,
          nom_voie: nom_voie,
          complement_adresse: complement_adresse,
          code_postal: code_postal,
          num_departement: num_departement,
          localite: localite,
          code_insee_localite: code_insee_localite,
          cedex: cedex,
          region: region,
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
  // console.log(nUsers);
  await fs.writeJson(path.join(__dirname, "ExtractUsersOrigin-19052022_COMPLETED.json"), nUsers);

  logger.info(`[Add info to users] Ended`);
};

runScript(async () => {
  await importer();
});
