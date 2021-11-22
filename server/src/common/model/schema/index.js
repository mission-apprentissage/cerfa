const logSchema = require("./log");
const userSchema = require("./user");
const roleSchema = require("./role");
const maintenanceMessageSchema = require("./maintenanceMessage");
const dossierSchema = require("./cerfa/dossier/Dossier");

module.exports = {
  logSchema,
  userSchema,
  roleSchema,
  maintenanceMessageSchema,

  // below Cerfa specific
  dossierSchema,
};
