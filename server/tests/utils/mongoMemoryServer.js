let { MongoMemoryServer } = require("mongodb-memory-server");
const { connectToMongo } = require("../../src/common/mongodb");

let mongodHolder;
let db;

module.exports = {
  async startMongod() {
    mongodHolder = await MongoMemoryServer.create({
      binary: {
        version: "5.0.2",
      },
    });

    let uri = mongodHolder.getUri();
    let res = await connectToMongo(uri);
    db = res.db;

    return db;
  },
  getDatabase() {
    return db;
  },
  stopMongod() {
    return mongodHolder.stop();
  },
};
