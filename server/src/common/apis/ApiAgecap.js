const axios = require("axios");
const logger = require("../logger");
const config = require("../../config");
const ApiError = require("./_apiError");
const apiRateLimiter = require("./_apiRateLimiter");
const FormData = require("form-data");
const { getFromStorage } = require("../utils/ovhUtils");
const { oleoduc, writeData } = require("oleoduc");
const { PassThrough } = require("stream");
const Boom = require("boom");

// Cf Documentation : Api Agecap
const executeWithRateLimiting = apiRateLimiter("apiAgecap", {
  //2 requests per second
  nbRequests: 2,
  durationInSeconds: 1,
  client: axios.create({
    baseURL: config.agecap.url,
    timeout: 5000,
    headers: { Authorization: `Basic ${config.agecap.key}` },
    // httpsAgent,
  }),
});

class ApiAgecap {
  constructor(crypto) {
    this.token = "";
    this.auth = false;
    this.crypto = crypto;
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
        console.log(e);
        throw Boom.badRequest("Api Agecap: Something went wrong", `${e.message}, ${e.code || e.response.status}`);
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
        // console.log(e);
        // console.log(e.response.data);
        throw new ApiError("Api Agecap contrat", `${e.message}`, {
          id: contratAgecap.detailsContrat.numeroEnregistrementContrat,
          ...e.response.data,
        });
      }
    });
  }
  sendDocument(dossierId, document) {
    return executeWithRateLimiting(async (client) => {
      if (!this.auth) {
        throw new ApiError("Api Agecap", `Not authenticate`);
      }

      const _buf = [];
      await oleoduc(
        await getFromStorage(document.cheminFichier),
        this.crypto.isCipherAvailable() ? this.crypto.decipher(dossierId) : new PassThrough(),
        writeData((chunk) => _buf.push(chunk))
      );

      const formData = new FormData();
      formData.append(`file`, Buffer.concat(_buf), {
        filename: `${document.nomFichier}`,
        contentType: "application/pdf",
        knownLength: document.tailleFichier,
      });

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
        console.log(e);
        console.log(e.response.data);
        throw new ApiError("Api Agecap document", `${e.message}`, e.response.data);
      }
    });
  }
  statut({ dateDebut, dateFin }) {
    return executeWithRateLimiting(async (client) => {
      if (!this.auth) {
        throw new ApiError("Api Agecap", `Not authenticate`);
      }
      try {
        logger.debug(`[Agecap API] send contrat`);
        let response = await client.get(`/contrats/changementStatut?dateDebut=${dateDebut}&dateFin=${dateFin}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });

        return response.data;
      } catch (e) {
        console.log(e.response.data);
        throw new ApiError("Api Agecap contrat", `${e.message}`, { ...e.response.data });
      }
    });
  }
}

module.exports = ApiAgecap;
