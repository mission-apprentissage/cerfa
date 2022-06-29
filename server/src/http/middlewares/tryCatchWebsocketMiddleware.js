const logger = require("../../common/logger");
const { buildErrorLog } = require("../../common/utils/errorUtils");

module.exports = (callback, socket) => {
  return async (payload, acknowledge) => {
    try {
      const result = await callback(payload);

      acknowledge?.({
        status: "OK",
        result,
      });
    } catch (rawError) {
      const error = buildErrorLog(rawError);
      logger["error"](error, `Socket Request KO`);
      acknowledge?.({
        status: "KO",
        error,
      });
      return socket.disconnect();
    }
  };
};
