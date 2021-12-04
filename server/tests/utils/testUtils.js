const { getDatabase } = require("./mongoMemoryServer");
const createComponents = require("../../src/common/components/components");
const server = require("../../src/http/server");
const axiosist = require("axiosist");
const fakeMailer = require("./fakeMailer");
const models = require("../../src/common/model");

async function testContext() {
  const db = getDatabase();
  let emailsSents = [];
  const mailer = fakeMailer({ calls: emailsSents });
  return {
    components: await createComponents({ db, mailer }),
    helpers: { getEmailsSent: () => emailsSents },
  };
}

async function initComponents(options) {
  let { components, helpers } = await testContext();

  const defaultOptions = {
    userOpt: { username: "user", password: "password", options: { email: "h@ck.me" } },
    roleOpt: { name: "wks.admin", acl: [] },
  };

  const roleOpt = options?.roleOpt || defaultOptions.roleOpt;
  const userOpt = options?.userOpt || defaultOptions.userOpt;

  const testRole = await components.roles.createRole(roleOpt);
  const testUser = await components.users.createUser(userOpt.username, userOpt.password, userOpt.options);

  return {
    components,
    testRole,
    testUser,
    ...helpers,
  };
}

async function startServer() {
  let { components, helpers } = await testContext();
  const app = await server(components);
  const httpClient = axiosist(app);

  await components.roles.createRole({ name: "wks.admin" });

  return {
    httpClient,
    components,
    ...helpers,
    createAndLogUser: async (username, password, options) => {
      await components.users.createUser(username, password, options);

      const response = await httpClient.post("/api/v1/auth/login", {
        username: username,
        password: password,
      });

      return {
        Cookie: response.headers["set-cookie"].join(";"),
      };
    },
  };
}

function cleanDatabase() {
  let all = Object.values(models);
  return Promise.all(all.map((m) => m.deleteMany({})));
}

function getTokenFromCookie(response) {
  let cookie = response.headers["set-cookie"];
  let jwt = cookie[0].split(";").find((i) => i.startsWith("cerfa-local-jwt"));
  if (!jwt) {
    throw new Error("No JWT found in response");
  }

  return jwt.split("=")[1];
}

module.exports = {
  startServer,
  cleanDatabase,
  getTokenFromCookie,
  initComponents,
};
