const logSchema = require("./log");
const userSchema = require("./user");
const roleSchema = require("./role");
const maintenanceMessageSchema = require("./maintenanceMessage");
const cerfaSchema = require("./cerfa/dossier/Cerfa");

module.exports = {
  logSchema,
  userSchema,
  roleSchema,
  maintenanceMessageSchema,

  // below Cerfa specific
  cerfaSchema,
};
