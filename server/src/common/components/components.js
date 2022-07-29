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
const createSessions = require("./session");
const createDreetsDdets = require("./dreetsDdets");
const createBatchManagement = require("./batchManagement");
const createAgecap = require("./agecap");
const createYousign = require("./yousign");
const config = require("../../config");

module.exports = async (options = {}) => {
  const users = options.users || (await createUsers());

  const db = options.db || (await connectToMongo()).db;
  const batchManagement = options.batchManagement || (await createBatchManagement());

  // below specific
  const workspaces = options.workspace || (await createWorkspaces());
  const dossiers = options.cerfa || (await createDossiers());
  const cerfas = options.cerfa || (await createCerfas());
  const permissions = options.permission || (await createPermissions());
  const roles = options.role || (await createRoles());
  const connectionsDossiers = options.connectionsDossier || (await createConnectionsDossiers());
  const clamav = options.clamav || (await createClamav(config.clamav.uri));
  const crypto = options.crypto || createCrypto(config.objectStorage.encryptionKey);
  const sessions = options.session || (await createSessions());
  const dreetsDdets = options.dreetsDdets || (await createDreetsDdets());
  const agecap = options.agecap || (await createAgecap(dossiers, cerfas, crypto));
  const yousign = options.yousign || (await createYousign(dossiers, crypto, agecap, users));

  return {
    users,
    sessions,
    db,
    mailer: options.mailer || createMailer(),
    batchManagement,

    // below specific
    workspaces,
    dossiers,
    dreetsDdets,
    connectionsDossiers,
    cerfas,
    permissions,
    roles,
    clamav,
    crypto,
    agecap,
    yousign,
  };
};
