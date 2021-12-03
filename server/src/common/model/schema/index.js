const logSchema = require("./log");
const userSchema = require("./user");
const roleSchema = require("./role");
const maintenanceMessageSchema = require("./maintenanceMessage");
const dossierSchema = require("./specific/Dossier");
const cerfaSchema = require("./specific/cerfa/Cerfa");
const commentaireSchema = require("./specific/Commentaire");
const historySchema = require("./specific/History");
const permissionSchema = require("./specific/Permission");
const workspaceSchema = require("./specific/Workspace");

module.exports = {
  logSchema,
  userSchema,
  roleSchema,
  maintenanceMessageSchema,

  // below Cerfa specific
  dossierSchema,
  cerfaSchema,
  commentaireSchema,
  historySchema,
  permissionSchema,
  workspaceSchema,
};
