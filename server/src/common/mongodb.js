const mongoose = require("mongoose");
const config = require("../config");

let mongooseInstance = mongoose;
module.exports.connectToMongo = (mongoUri = config.mongodb.uri, mongooseInst = null) => {
  return new Promise((resolve, reject) => {
    console.log(`MongoDB: Connection to ${mongoUri}`);

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
      console.log("MongoDB", "...close");
      reject(e);
    });
    db.on("error", (err) => {
      console.error("MongoDB", "Error...error", err);
      reject(err);
    });
    db.on("disconnect", (err) => {
      console.log("MongoDB", "...disconnect", err ?? "");
      reject(err);
    });
    db.on("disconnected", (err) => {
      console.log("MongoDB", "...disconnected", err ?? "");
      reject(err);
    });
    db.on("parseError", (err) => {
      console.error("MongoDB", "Error...parse", err);
      reject(err);
    });
    db.on("timeout", (err) => {
      console.error("MongoDB", "Error...timeout", err);
      reject(err);
    });

    db.once("open", () => {
      console.log("MongoDB", "Connected");
      resolve({ db });
    });
  });
};

module.exports.mongoose = mongooseInstance;
module.exports.closeMongoConnection = (mongooseInst = mongoose) => mongooseInst.disconnect();
