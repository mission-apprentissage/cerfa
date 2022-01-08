const logSchema = require("./log");
const userSchema = require("./user");
const jwtSessionSchema = require("./jwtSession");
const roleSchema = require("./role");
const maintenanceMessageSchema = require("./maintenanceMessage");
const dossierSchema = require("./specific/dossier/Dossier");
const connectionDossierSchema = require("./specific/dossier/ConnectionDossier");
const cerfaSchema = require("./specific/dossier/cerfa/Cerfa");
const commentaireSchema = require("./specific/dossier/Commentaire");
const historySchema = require("./specific/dossier/cerfa/History");
const permissionSchema = require("./specific/Permission");
const workspaceSchema = require("./specific/Workspace");

module.exports = {
  logSchema,
  userSchema,
  jwtSessionSchema,
  roleSchema,
  maintenanceMessageSchema,

  // below Cerfa specific
  dossierSchema,
  connectionDossierSchema,
  cerfaSchema,
  commentaireSchema,
  historySchema,
  permissionSchema,
  workspaceSchema,
};
