const { runScript } = require("../scriptWrapper");
const logger = require("../../common/logger");
// const { Role } = require("../../common/model/index");

runScript(async ({ users }) => {
  await users.createUser("testAdmin", "password", {
    email: "antoine.bigard@beta.gouv.fr",
    permissions: { isAdmin: true },
  });
  // "name" : "public",
  //   "acl" : [],
  logger.info(`User 'testAdmin' with password 'password' and admin is successfully created `);
});
