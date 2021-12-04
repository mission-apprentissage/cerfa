const { connectToMongo } = require("../mongodb");
const createMailer = require("../../common/mailer");
const createUsers = require("./users");
const createWorkspaces = require("./workspaces");
const createDossiers = require("./dossiers");
const createCerfas = require("./cerfas");
const createPermissions = require("./permissions");
const createRoles = require("./roles");

module.exports = async (options = {}) => {
  const users = options.users || (await createUsers());

  const db = options.db || (await connectToMongo()).db;

  // below specific
  const workspaces = options.workspace || (await createWorkspaces());
  const dossiers = options.cerfa || (await createDossiers());
  const cerfas = options.cerfa || (await createCerfas());
  const permissions = options.permission || (await createPermissions());
  const roles = options.role || (await createRoles());

  return {
    users,
    db,
    mailer: options.mailer || createMailer(),

    // below specific
    workspaces,
    dossiers,
    cerfas,
    permissions,
    roles,
  };
};
