const axiosist = require("axiosist");
const createComponents = require("../../src/common/components/components");
const { connectToMongoForTests, cleanAll } = require("./testUtils.js");
const server = require("../../src/http/server");

const startServer = async () => {
  const { db } = await connectToMongoForTests();
  const components = await createComponents({ db });
  const app = await server(components, false);
  const httpClient = axiosist(app);

  return {
    httpClient,
    components,
    createAndLogUser: async (userEmail, password, options) => {
      await components.users.createUser(userEmail, password, options);
      await httpClient.post("/api/v1/auth/login", {
        email: userEmail,
        password: password,
      });
    },
  };
};

module.exports = (desc, cb) => {
  describe(desc, function () {
    cb({ startServer });
    afterEach(cleanAll);
  });
};
