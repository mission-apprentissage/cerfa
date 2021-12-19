const { connectToMongo } = require("../mongodb");
const createMailer = require("../../common/mailer");
const createUsers = require("./users");
const createWorkspaces = require("./workspaces");
const createDossiers = require("./dossiers");
const createConnectionsDossiers = require("./connectionsDossiers");
const createCerfas = require("./cerfas");
const createPermissions = require("./permissions");
const createRoles = require("./roles");
const createClamav = require("./clamav");
const createCrypto = require("./crypto");
const config = require("../../config");

module.exports = async (options = {}) => {
  const users = options.users || (await createUsers());

  const db = options.db || (await connectToMongo()).db;

  // below specific
  const workspaces = options.workspace || (await createWorkspaces());
  const dossiers = options.cerfa || (await createDossiers());
  const cerfas = options.cerfa || (await createCerfas());
  const permissions = options.permission || (await createPermissions());
  const roles = options.role || (await createRoles());
  const connectionsDossiers = options.connectionsDossier || (await createConnectionsDossiers());
  const clamav = options.clamav || (await createClamav(config.clamav.uri));
  const crypto = options.crypto || createCrypto(config.ovh.storage.encryptionKey);

  return {
    users,
    db,
    mailer: options.mailer || createMailer(),

    // below specific
    workspaces,
    dossiers,
    connectionsDossiers,
    cerfas,
    permissions,
    roles,
    clamav,
    crypto,
  };
};
