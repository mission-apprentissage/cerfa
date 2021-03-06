require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const config = require("../config");
const logger = require("../common/logger");
const bodyParser = require("body-parser");
const tryCatch = require("./middlewares/tryCatchMiddleware");
const logMiddleware = require("./middlewares/logMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");
const corsMiddleware = require("./middlewares/corsMiddleware");
const authMiddleware = require("./middlewares/authMiddleware");
const pageAccessMiddleware = require("./middlewares/pageAccessMiddleware");
const packageJson = require("../../package.json");
const authentified = require("./routes/authentified");
const user = require("./routes/user");
const profile = require("./routes/profile");
const role = require("./routes/role");
const password = require("./routes/password");
const upload = require("./routes/specific/upload");
const auth = require("./routes/auth");
const maintenanceMessage = require("./routes/maintenanceMessage");
const assistanceDossier = require("./routes/assistanceDossier");
const workspace = require("./routes/specific/workspace");
const dossier = require("./routes/specific/dossier");
const cerfa = require("./routes/specific/cerfa");
const siret = require("./routes/specific/siret");
const geo = require("./routes/specific/geo");
const naf = require("./routes/specific/naf");
const dreetsDdets = require("./routes/specific/dreetsDdets");
const cfdrncp = require("./routes/specific/cfdrncp");
const signDocument = require("./routes/specific/signDocument");
const agecap = require("./routes/specific/agecap");

const supportPage = require("./routes/specific/supportPage");
const pds = require("./routes/specific/pds");

const startWebsocket = require("./websockets/socket");

const passport = require("passport");
const cookieParser = require("cookie-parser");

module.exports = async (components) => {
  const { db } = components;
  const app = express();

  const checkJwtToken = authMiddleware(components);
  app.use(bodyParser.json());
  app.use(corsMiddleware());
  app.use(logMiddleware());
  app.use(cookieParser());
  app.use(passport.initialize());

  // public access
  app.use("/api/v1/auth", auth(components));
  app.use("/api/v1/password", password(components));

  app.use("/api/v1/support", supportPage());
  app.use("/api/v1/pds", pds(components));

  // Controled access
  app.use("/api/v1/maintenanceMessage", maintenanceMessage(checkJwtToken));

  // private access
  app.use("/api/v1/authentified", checkJwtToken, authentified(components));
  app.use("/api/v1/admin", checkJwtToken, pageAccessMiddleware(["admin/page_gestion_utilisateurs"]), user(components));
  app.use(
    "/api/v1/admin",
    checkJwtToken,
    pageAccessMiddleware(["admin/page_assistance_dossier"]),
    assistanceDossier(components)
  );
  app.use(
    "/api/v1/admin",
    checkJwtToken,
    pageAccessMiddleware(["admin/page_gestion_utilisateurs", "admin/page_gestion_roles"]),
    role(components)
  );
  app.use("/api/v1/profile", checkJwtToken, profile(components));

  // below specific
  app.use("/api/v1/workspace", checkJwtToken, workspace(components));
  app.use("/api/v1/dossier", checkJwtToken, dossier(components));
  app.use("/api/v1/cerfa", checkJwtToken, cerfa(components));
  app.use("/api/v1/upload", checkJwtToken, upload(components));
  app.use("/api/v1/siret", siret(components));
  app.use("/api/v1/geo", checkJwtToken, geo(components));
  app.use("/api/v1/naf", checkJwtToken, naf(components));
  app.use("/api/v1/dreetsddets", checkJwtToken, dreetsDdets(components));
  app.use("/api/v1/cfdrncp", checkJwtToken, cfdrncp(components));
  app.use("/api/v1/sign_document", signDocument(components));
  app.use("/api/v1/agecap", checkJwtToken, agecap(components));

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

  const httpServer = createServer(app);
  startWebsocket(httpServer, components);

  return httpServer;
};
