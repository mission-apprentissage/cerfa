const { Server } = require("socket.io");
const { ioUseNamespace } = require("../../common/utils/socketsUtils");

const corsRules = require("../../common/corsRules");

const dossier = require("./namespaces/dossier");

module.exports = async (httpServer, components) => {
  const io = new Server(httpServer, {
    cors: {
      origin: corsRules.origin,
      allowedHeaders: corsRules.allowedHeaders,
    },
  });

  ioUseNamespace(io, "/dossier", components, dossier);
};
