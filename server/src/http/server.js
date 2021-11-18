const express = require("express");
const config = require("config");
const logger = require("../common/logger");
const bodyParser = require("body-parser");
const logMiddleware = require("./middlewares/logMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");
const tryCatch = require("./middlewares/tryCatchMiddleware");
const apiKeyAuthMiddleware = require("./middlewares/apiKeyAuthMiddleware");
const corsMiddleware = require("./middlewares/corsMiddleware");
const authMiddleware = require("./middlewares/authMiddleware");
const permissionsMiddleware = require("./middlewares/permissionsMiddleware");
const packageJson = require("../../package.json");
const hello = require("./routes/hello");
const secured = require("./routes/secured");
const authentified = require("./routes/authentified");
// const admin = require("./routes/admin");
const password = require("./routes/password");
const stats = require("./routes/stats");
const auth = require("./routes/auth");

module.exports = async (components) => {
  const { db } = components;
  const app = express();
  const checkJwtToken = authMiddleware(components);
  const adminOnly = permissionsMiddleware({ isAdmin: true });

  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(corsMiddleware());
  app.use(logMiddleware());

  app.use("/api/v1/helloRoute", hello());
  app.use("/api/v1/secured", apiKeyAuthMiddleware, secured());
  app.use("/api/v1/authentified", checkJwtToken, authentified());
  // app.use("/api/v1/admin", checkJwtToken, adminOnly, admin());
  app.use("/api/v1/stats", checkJwtToken, adminOnly, stats(components));

  app.use("/api/v1/auth", auth(components));
  app.use("/api/v1/password", password(components));

  app.get(
    "/api",
    tryCatch(async (req, res) => {
      logger.info("/api called - healthcheck");
      let mongodbStatus;
      try {
        await db.collection("log").stats();
        mongodbStatus = true;
      } catch (e) {
        mongodbStatus = false;
        logger.error("Healthcheck failed", e);
      }

      return res.json({
        name: `Serveur MNA - ${config.appName}`,
        version: packageJson.version,
        env: config.env,
        healthcheck: {
          mongodb: mongodbStatus,
        },
      });
    })
  );

  app.use(errorMiddleware());

  return app;
};
