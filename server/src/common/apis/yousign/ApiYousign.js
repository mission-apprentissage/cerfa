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
  postProcedures(data) {
    return executeWithRateLimiting(async (client) => {
      try {
        logger.debug(`[Yousign API] Create procedures...`);
        let response = await client.post(`procedures`, data);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new ApiError("Api Yousign", `${e.message}`, e.code || e.response.status);
      }
    });
  }
  getFile(id, alt = true) {
    return executeWithRateLimiting(async (client) => {
      try {
        logger.debug(`[Yousign API] Download files...`);
        let response = null;
        if (alt) {
          response = await client.get(`files/${id}/download?alt=media`, { responseType: "stream" });
        } else {
          response = await client.get(`files/${id}/download`);
        }
        return response.data;
      } catch (e) {
        console.log(e);
        throw new ApiError("Api Yousign", `${e.message}`, e.code || e.response.status);
      }
    });
  }
}

const apiYousign = new ApiYousign();
module.exports = apiYousign;
