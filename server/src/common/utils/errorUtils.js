const Boom = require("boom");

const buildErrorLog = (rawError) => {
  let error;
  if (rawError.isBoom) {
    error = rawError;
    error.output.payload.details = rawError.data;
  } else if (rawError.name === "ValidationError") {
    //This is a joi validation error
    error = Boom.badRequest("Erreur de validation");
    error.output.payload.details = rawError.details;
  } else if (rawError.message === "Unauthorized") {
    error = Boom.unauthorized("Accès non autorisé");
  } else {
    error = Boom.boomify(rawError, {
      statusCode: rawError.status || 500,
      ...(!rawError.message ? "Une erreur est survenue" : {}),
    });
  }
  return error;
};
module.exports.buildErrorLog = buildErrorLog;
