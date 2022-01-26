const axios = require("axios");
const logger = require("../../logger");
const config = require("../../../config");
const ApiError = require("../_apiError");
const apiRateLimiter = require("../_apiRateLimiter");

// Cf Documentation : https://dev.yousign.com/
const executeWithRateLimiting = apiRateLimiter("apiYousign", {
  //2 requests per second
  nbRequests: 2,
  durationInSeconds: 1,
  client: axios.create({
    baseURL: config.apiYousign.url,
    timeout: 5000,
    headers: {
      Authorization: `Bearer ${config.apiYousign.key}`,
      "Content-Type": "application/json",
    },
  }),
});

class ApiYousign {
  getUsers() {
    return executeWithRateLimiting(async (client) => {
      try {
        logger.debug(`[Yousign API] Get users...`);
        let response = await client.get(`users`);
        return response.data;
      } catch (e) {
        throw new ApiError("Api Yousign", `${e.message}`, e.code || e.response.status);
      }
    });
  }
  postFiles({ name, content }) {
    return executeWithRateLimiting(async (client) => {
      try {
        logger.debug(`[Yousign API] Upload files...`);
        let response = await client.post(`files`, {
          name,
          content,
        });
        return response.data;
      } catch (e) {
        throw new ApiError("Api Yousign", `${e.message}`, e.code || e.response.status);
      }
    });
  }
  postProcedures({ name, description, members }) {
    return executeWithRateLimiting(async (client) => {
      try {
        logger.debug(`[Yousign API] Create procedures...`);
        let response = await client.post(`procedures`, {
          name,
          description,
          members,
        });
        return response.data;
      } catch (e) {
        throw new ApiError("Api Yousign", `${e.message}`, e.code || e.response.status);
      }
    });
  }
  startProcedures(proceduresId) {
    return executeWithRateLimiting(async (client) => {
      try {
        logger.debug(`[Yousign API] Start procedures...`);
        let response = await client.put(proceduresId, {
          start: true,
        });
        return response.data;
      } catch (e) {
        throw new ApiError("Api Yousign", `${e.message}`, e.code || e.response.status);
      }
    });
  }
}

const apiYousign = new ApiYousign();
module.exports = apiYousign;
