const { connectToMongo } = require("../mongodb");
const createUsers = require("./users");
const createCerfas = require("./cerfas");
const createDossiers = require("./dossiers");
const createMailer = require("../../common/mailer");

module.exports = async (options = {}) => {
  const users = options.users || (await createUsers());

  const db = options.db || (await connectToMongo()).db;

  // below specific
  const cerfas = options.cerfa || (await createCerfas());
  const dossiers = options.cerfa || (await createDossiers());

  return {
    users,
    db,
    mailer: options.mailer || createMailer(),

    // below specific
    dossiers,
    cerfas,
  };
};
