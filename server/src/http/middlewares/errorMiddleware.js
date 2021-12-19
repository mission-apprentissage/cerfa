const { buildErrorLog } = require("../../common/utils/errorUtils");

module.exports = () => {
  // eslint-disable-next-line no-unused-vars
  return (rawError, req, res, next) => {
    req.err = rawError;

    const error = buildErrorLog(rawError);

    return res.status(error.output.statusCode).send(error.output.payload);
  };
};
