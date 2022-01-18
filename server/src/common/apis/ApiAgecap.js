const axios = require("axios");
const logger = require("../logger");
const config = require("../../config");
const ApiError = require("./_apiError");
const apiRateLimiter = require("./_apiRateLimiter");
const https = require("https");
const fs = require("fs");
const FormData = require("form-data");

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
  constructor() {
    this.token = "";
    this.auth = false;
  }
  authenticate() {
    return executeWithRateLimiting(async (client) => {
      if (this.auth) return true;
      try {
        logger.debug(`[Agecap API] Authenticate`);
        let response = await client.post(`authenticate`);
        if (!response?.data?.token) {
          throw new ApiError("Api Agecap", ` Authenticate: Something went wrong`);
        }
        this.token = response.data.token;
        this.auth = true;
        return true;
      } catch (e) {
        throw new ApiError("Api Agecap", `${e.message}`, e.code || e.response.status);
      }
    });
  }
  sendContrat(contratAgecap) {
    return executeWithRateLimiting(async (client) => {
      if (!this.auth) {
        throw new ApiError("Api Agecap", `Not authenticate`);
      }
      try {
        logger.debug(`[Agecap API] send contrat`);
        let response = await client.post(`contrats`, contratAgecap, {
          headers: { Authorization: `Bearer ${this.token}` },
        });

        return response;
      } catch (e) {
        throw new ApiError("Api Agecap", `${e.message}`, e.code || e.response.status);
      }
    });
  }
  sendDocument(dossierId, document) {
    return executeWithRateLimiting(async (client) => {
      if (!this.auth) {
        throw new ApiError("Api Agecap", `Not authenticate`);
      }
      const formData = new FormData();

      // TODO SEND POST multiPart/form-data
      // const stream = await getFromStorage(document.cheminFichier);
      // formData.append(`${document.nomFichier}`, fs.createReadStream(FILE));
      // await oleoduc(stream, crypto.isCipherAvailable() ? crypto.decipher(dossierId) : noop(), res);

      try {
        logger.debug(`[Agecap API] send document`);
        let response = await client.post(`contrats/${dossierId}/pj/${document.documentId}`, formData, {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${this.token}`,
          },
        });

        return response;
      } catch (e) {
        throw new ApiError("Api Agecap", `${e.message}`, e.code || e.response.status);
      }
    });
  }
}

const apiAgecap = new ApiAgecap();
module.exports = apiAgecap;
