const axios = require("axios");
const logger = require("../logger");
const config = require("../../config");
const ApiError = require("./_apiError");
const apiRateLimiter = require("./_apiRateLimiter");

const https = require("https");
const fs = require("fs");

const CERT_PATH = "/data/agecap";

const httpsAgent = new https.Agent({
  key: fs.readFileSync(`${CERT_PATH}/client-key.pem`),
  cert: fs.readFileSync(`${CERT_PATH}/client-crt.pem`),
  passphrase: config.agecap_passphrase,
});

// Cf Documentation : Api Agecap
const executeWithRateLimiting = apiRateLimiter("apiAgecap", {
  //2 requests per second
  nbRequests: 2,
  durationInSeconds: 1,
  client: axios.create({
    baseURL: "https://sia-refonte-api-agecap-rec-ext.rct01.kleegroup.com/agecap-api",
    timeout: 5000,
    httpsAgent,
  }),
});

class ApiAgecap {
  authenticate() {
    return executeWithRateLimiting(async (client) => {
      try {
        logger.debug(`[Agecap API] Authenticate`);
        let response = await client.post(`authenticate`);
        return response;
      } catch (e) {
        throw new ApiError("Api Agecap", `${e.message}`, e.code || e.response.status);
      }
    });
  }
}

const apiAgecap = new ApiAgecap();
module.exports = apiAgecap;
