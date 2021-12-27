const mongoose = require("mongoose");
const config = require("../config");

const log = console.error; //Send to diagnostic/error output
const mongooseInstance = mongoose;

module.exports.connectToMongo = (mongoUri = config.mongodb.uri, mongooseInst = null) => {
  return new Promise((resolve, reject) => {
    log(`MongoDB: Connection to ${mongoUri}`);

    const mI = mongooseInst || mongooseInstance;
    // Set up default mongoose connection
    mI.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      keepAlive: true,
    });

    // Get Mongoose to use the global promise library
    mI.Promise = global.Promise; // Get the default connection
    const db = mI.connection;

    db.on("close", (e) => {
      log("MongoDB", "...close");
      reject(e);
    });
    db.on("error", (err) => {
      log("MongoDB", "Error...error", err);
      reject(err);
    });
    db.on("disconnect", (err) => {
      log("MongoDB", "...disconnect", err ?? "");
      reject(err);
    });
    db.on("disconnected", (err) => {
      log("MongoDB", "...disconnected", err ?? "");
      reject(err);
    });
    db.on("parseError", (err) => {
      log("MongoDB", "Error...parse", err);
      reject(err);
    });
    db.on("timeout", (err) => {
      log("MongoDB", "Error...timeout", err);
      reject(err);
    });

    db.once("open", () => {
      log("MongoDB", "Connected");
      resolve({ db });
    });
  });
};

module.exports.mongoose = mongooseInstance;
module.exports.closeMongoConnection = (mongooseInst = mongoose) => mongooseInst.disconnect();
