const jwt = require("jsonwebtoken");
const config = require("../../config");

const createToken = (type, subject = null, options = {}) => {
  const defaults = config.auth[type];
  const secret = options.secret || defaults.jwtSecret;
  const expiresIn = options.expiresIn || defaults.expiresIn;
  const payload = options.payload || {};

  let opts = {
    issuer: config.appName,
    expiresIn: expiresIn,
  };
  if (subject) {
    opts.subject = subject;
  }
  return jwt.sign(payload, secret, opts);
};

module.exports = {
  createPasswordToken: (subject, options = {}) => createToken("password", subject, options),
  createActivationToken: (subject, options = {}) => createToken("activation", subject, options),
  createUserToken: (options = {}) => createToken("user", null, options),
  createPdsToken: (options = {}) => createToken("pds", null, options),
};
