const { runScript } = require("../scriptWrapper");
const logger = require("../../common/logger");
// const { Role } = require("../../common/model/index");
const { MaintenanceMessage, Role } = require("../../common/model/index");

runScript(async ({ users }) => {
  await users.createUser("testAdmin", "password", {
    email: "antoine.bigard@beta.gouv.fr",
    permissions: { isAdmin: true },
  });

  logger.info(`User 'testAdmin' with password 'password' and admin is successfully created `);
  const newMaintenanceMessage = new MaintenanceMessage({
    context: "automatique",
    type: "alert",
    msg: "Une mise à jour des données est en cours...",
    name: "auto",
    enabled: false,
    time: new Date(),
  });
  await newMaintenanceMessage.save();
  logger.info(`MaintenanceMessage default created`);

  const newRole = new Role({
    name: "public",
    acl: [],
  });
  await newRole.save();
  logger.info(`Role public created`);
});
