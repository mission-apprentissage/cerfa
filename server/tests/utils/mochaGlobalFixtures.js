const { stopMongod, startMongod } = require("./mongoMemoryServer");
const { cleanDatabase } = require("./testUtils");
const nock = require("nock"); // eslint-disable-line node/no-unpublished-require

nock.disableNetConnect();
nock.enableNetConnect((host) => {
  return host.startsWith("127.0.0.1") || host.indexOf("fastdl.mongodb.org") !== -1;
});

exports.mochaGlobalSetup = function () {
  return startMongod();
};

exports.mochaHooks = {
  afterEach: async function () {
    nock.cleanAll();
    return cleanDatabase();
  },
};

exports.mochaGlobalTeardown = function () {
  return stopMongod();
};
