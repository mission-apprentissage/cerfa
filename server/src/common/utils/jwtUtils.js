const jwt = require("jsonwebtoken");
const config = require("config");
const crypto = require("crypto");

const createToken = (type, subject, options = {}) => {
  const defaults = config.auth[type];
  const secret = options.secret || defaults.jwtSecret;
  const expiresIn = options.expiresIn || defaults.expiresIn;
  const payload = options.payload || {};

  return jwt.sign(payload, secret, {
    issuer: config.appName,
    expiresIn: expiresIn,
    subject: subject,
  });
};

/**
 * Generate a JWT token to use for Parcoursup Web Service
 * ttl default : 20 seconds
 */
const createParcoursupToken = ({ ttl = 20000, id, data, privateKey, pwd }) => {
  const expire = Date.now() + ttl;
  const dataStr = JSON.stringify(data);
  const hash = crypto.createHash("sha512").update(dataStr, "utf-8").digest("hex");

  console.log("expire :", expire, "->", new Date(expire));
  console.log("data:", dataStr);
  console.log("hash:", hash);

  return jwt.sign(
    {
      id,
      expire,
      hash,
    },
    { key: privateKey, passphrase: pwd },
    {
      algorithm: "RS512",
      noTimestamp: true,
      // keyid: "devKey", // no keyid yet
    }
  );
};

module.exports = {
  createParcoursupToken,
  createPasswordToken: (subject, options = {}) => createToken("password", subject, options),
};
