const { PassThrough } = require("stream");
const { getDatabase } = require("./mongoMemoryServer");
const createComponents = require("../../src/common/components/components");
const server = require("../../src/http/server");
const axiosist = require("axiosist");
const fakeMailer = require("./fakeMailer");
const models = require("../../src/common/model");
const fs = require("fs");
const path = require("path");

async function testContext(custom = {}) {
  const db = getDatabase();
  let emailsSents = [];
  const mailer = fakeMailer({ calls: emailsSents });
  return {
    components: {
      ...(await createComponents({ db, mailer, clamav: fakeClamav({}) })),
      ...custom,
    },
    helpers: { getEmailsSent: () => emailsSents },
  };
}

async function initComponents(options) {
  let { components, helpers } = await testContext();

  const defaultOptions = {
    userOpt: {
      email: "h@ck.me",
      password: "password",
      options: { email: "h@ck.me", nom: "hack", prenom: "me" },
    },
    roleOpt: { name: "wks.admin", type: "permission", acl: [] },
  };

  const roleOpt = options?.roleOpt || defaultOptions.roleOpt;
  const userOpt = options?.userOpt || defaultOptions.userOpt;

  const testRole = await components.roles.createRole(roleOpt);
  const testUser = await components.users.createUser(userOpt.email, userOpt.password, userOpt.options);

  return {
    components,
    testRole,
    testUser,
    ...helpers,
  };
}

async function startServer(custom) {
  let { components, helpers } = await testContext(custom);
  const app = await server(components);
  const httpClient = axiosist(app);

  await components.roles.createRole({ name: "wks.admin", type: "permission" });
  await components.roles.createRole({
    name: "dossier.admin",
    type: "permission",
    acl: ["dossier/page_documents/ajouter_un_document"],
  });

  return {
    httpClient,
    components,
    ...helpers,
    createAndLogUser: async (userEmail, password, options) => {
      const testUser = await components.users.createUser(userEmail, password, options);
      const testDossier = await components.dossiers.createDossier(
        { sub: testUser.email },
        { nom: "Dossier Test", saved: true }
      );

      const response = await httpClient.post("/api/v1/auth/login", {
        username: userEmail,
        password: password,
      });

      return {
        Cookie: response.headers["set-cookie"].join(";"),
        testDossier,
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

function fakeClamav(results) {
  return {
    getScanner: () => {
      return {
        scanStream: new PassThrough(),
        getScanResults: () => Promise.resolve(results),
      };
    },
  };
}

function getBlankPDFStream() {
  return fs.createReadStream(path.join(__dirname, "blank.pdf"));
}

module.exports = {
  startServer,
  cleanDatabase,
  getTokenFromCookie,
  initComponents,
  fakeClamav,
  getBlankPDFStream,
};
