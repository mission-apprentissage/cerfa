const axios = require("axios");
const config = require("../../config");
const logger = require("../logger");
const ApiError = require("./_apiError");
const apiRateLimiter = require("./_apiRateLimiter");

// Cf Documentation : https://doc.entreprise.api.gouv.fr/#param-tres-obligatoires
const executeWithRateLimiting = apiRateLimiter("apiEntreprise", {
  //2 requests per second
  nbRequests: 2,
  durationInSeconds: 1,
  client: axios.create({
    baseURL: "https://entreprise.api.gouv.fr/v2",
    timeout: 5000,
  }),
});

const apiParams = {
  token: config.apiEntreprise,
  context: "CERFA MNA",
  recipient: "13002526500013", // Siret Dinum
  object: "Construction d'un générateur de CERFA pour les contrats publique d'apprentissage",
};

class ApiEntreprise {
  getEntreprise(siren) {
    return executeWithRateLimiting(async (client) => {
      try {
        logger.debug(`[Entreprise API] Fetching entreprise ${siren}...`);
        let response = await client.get(`entreprises/${siren}`, {
          params: apiParams,
        });
        if (!response?.data?.entreprise) {
          throw new ApiError("Api Entreprise", "No entreprise data received");
        }
        return response.data.entreprise;
      } catch (e) {
        throw new ApiError("Api Entreprise", e.message, e.code || e.response.status);
      }
    });
  }

  async getEtablissement(siret) {
    return executeWithRateLimiting(async (client) => {
      try {
        logger.debug(`[Entreprise API] Fetching etablissement ${siret}...`);
        let response = await client.get(`etablissements/${siret}`, {
          params: apiParams,
        });
        if (!response?.data?.etablissement) {
          throw new ApiError("Api Entreprise", "No etablissement data received");
        }
        return response.data.etablissement;
      } catch (e) {
        throw new ApiError("Api Entreprise", e.message, e.code || e.response.status);
      }
    });
  }
  async getConventionCollective(siret) {
    return executeWithRateLimiting(async (client) => {
      try {
        logger.debug(`[Entreprise API] Fetching convention collective ${siret}...`);
        let response = await client.get(`conventions_collectives/${siret}`, {
          params: apiParams,
        });
        if (!response?.data?.conventions[0]) {
          throw new ApiError("Api Entreprise", "error getConventionCollective");
        }
        return response.data.conventions[0];
      } catch (e) {
        throw new ApiError("Api Entreprise", e.message, e.code || e.response.status);
      }
    });
  }
}

const apiEntreprise = new ApiEntreprise();
module.exports = apiEntreprise;
