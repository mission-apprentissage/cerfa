const logSchema = require("./log");
const userSchema = require("./user");
const roleSchema = require("./role");
const maintenanceMessageSchema = require("./maintenanceMessage");
const dossierSchema = require("./cerfa/dossier/Dossier");
const commentaireSchema = require("./cerfa/Commentaire");
const historySchema = require("./cerfa/History");

module.exports = {
  logSchema,
  userSchema,
  roleSchema,
  maintenanceMessageSchema,

  // below Cerfa specific
  dossierSchema,
  commentaireSchema,
  historySchema,
};
