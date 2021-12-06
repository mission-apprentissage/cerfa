const { parse: parseUrl } = require("url"); // eslint-disable-line node/no-deprecated-api
const logger = require("../logger");
const https = require("https");

async function createRequestStream(url, httpOptions = {}) {
  return new Promise((resolve, reject) => {
    let options = {
      ...parseUrl(url),
      method: "GET",
      ...httpOptions,
    };

    logger.info(`Downloading ${url}...`);
    let req = https.request(options, (res) => {
      if (res.statusCode >= 400) {
        reject(new Error(`Unable to get ${url}. Status code ${res.statusCode}`));
      }

      resolve(res);
    });
    req.end();
  });
}

function createUploadStream(url, httpOptions = {}) {
  let options = {
    ...parseUrl(url),
    method: "PUT",
    ...httpOptions,
  };

  logger.info(`Uploading ${url}...`);
  return https.request(options);
}

module.exports = {
  createRequestStream,
  createUploadStream,
};
