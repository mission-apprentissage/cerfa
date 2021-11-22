const express = require("express");
const config = require("../config");
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
const secured = require("./routes/securedAPI");
const authentified = require("./routes/authentified");
const user = require("./routes/user");
const role = require("./routes/role");
const password = require("./routes/password");
const upload = require("./routes/upload");
const auth = require("./routes/auth");
const maintenanceMessage = require("./routes/maintenanceMessage");
const cerfa = require("./routes/cerfa");

const passport = require("passport");
const cookieParser = require("cookie-parser");

module.exports = async (components) => {
  const { db } = components;
  const app = express();
  const checkJwtToken = authMiddleware(components);

  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(corsMiddleware());
  app.use(logMiddleware());
  app.use(cookieParser());

  app.use(passport.initialize());

  app.use("/api/v1/securedAPI", apiKeyAuthMiddleware, secured());

  app.use(
    "/api/v1/admin",
    checkJwtToken,
    permissionsMiddleware({ isAdmin: true }, ["page_gestion_utilisateurs"]),
    user(components)
  );
  app.use(
    "/api/v1/admin",
    checkJwtToken,
    permissionsMiddleware({ isAdmin: true }, ["page_gestion_utilisateurs", "page_gestion_roles"]),
    role(components)
  );
  app.use("/api/v1/upload", checkJwtToken, permissionsMiddleware({ isAdmin: true }, ["page_upload"]), upload());
  app.use("/api/v1/maintenanceMessage", maintenanceMessage());
  app.use("/api/v1/cerfa", cerfa());
  app.use("/api/v1/auth", auth(components));
  app.use("/api/v1/authentified", checkJwtToken, authentified(components));
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
