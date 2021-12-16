const { Server } = require("socket.io");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const corsRules = require("../../common/corsRules");
const logger = require("../../common/logger");
const authMiddleware = require("../middlewares/authMiddleware");

const dossier = require("./dossier");

const wrapMiddleware = (middleware) => (socket, next) => middleware(socket.request, {}, next);

const ioUseNamespace = (io, name, components, callback) => {
  const checkJwtToken = authMiddleware(components);
  const namespace = io.of(name);
  namespace.use(wrapMiddleware(bodyParser.json()));
  namespace.use(wrapMiddleware(cookieParser()));
  namespace.use(wrapMiddleware(passport.initialize()));
  namespace.use(wrapMiddleware(checkJwtToken));

  io.of(name).on("connection", (socket) => {
    socket.on("error", (err) => {
      logger["error"](err, `Socket Request KO`);
      socket.disconnect();
    });

    callback({ socket, components });
  });
};

module.exports = async (httpServer, components) => {
  const io = new Server(httpServer, {
    cors: {
      origin: corsRules.origin,
      allowedHeaders: corsRules.allowedHeaders,
    },
  });

  ioUseNamespace(io, "/dossier", components, dossier);
};
