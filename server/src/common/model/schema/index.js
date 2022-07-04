const logSchema = require("./log");
const userSchema = require("./user");
const jwtSessionSchema = require("./jwtSession");
const roleSchema = require("./role");
const maintenanceMessageSchema = require("./maintenanceMessage");
const batchManagementSchema = require("./batchManagement");
const dossierSchema = require("./specific/dossier/Dossier");
const connectionDossierSchema = require("./specific/dossier/ConnectionDossier");
const cerfaSchema = require("./specific/dossier/cerfa/Cerfa");
const commentaireSchema = require("./specific/dossier/Commentaire");
const cerfaHistorySchema = require("./specific/dossier/cerfa/CerfaHistory");
const permissionSchema = require("./specific/Permission");
const workspaceSchema = require("./specific/Workspace");
const categoriesJuridiqueSchema = require("./specific/CategoriesJuridique");
const ddetsDreetsSchema = require("./specific/DdetsDreets");

module.exports = {
  logSchema,
  userSchema,
  jwtSessionSchema,
  roleSchema,
  maintenanceMessageSchema,
  batchManagementSchema,

  // below Cerfa specific
  dossierSchema,
  connectionDossierSchema,
  cerfaSchema,
  commentaireSchema,
  cerfaHistorySchema,
  permissionSchema,
  workspaceSchema,
  categoriesJuridiqueSchema,
  ddetsDreetsSchema,
};
