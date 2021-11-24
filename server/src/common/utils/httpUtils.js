const { oleoduc } = require("oleoduc");
const { parse: parseUrl } = require("url"); // eslint-disable-line node/no-deprecated-api
const logger = require("../logger");
const https = require("https");

function sendJsonStream(stream, res) {
  res.setHeader("Content-Type", "application/json");
  oleoduc(stream, res);
}

async function sendFileAsStream(url, stream, httpOptions = {}) {
  return new Promise((resolve, reject) => {
    let options = {
      ...parseUrl(url),
      method: "PUT",
      ...httpOptions,
    };

    logger.info(`Uploading ${url}...`);
    oleoduc(stream, https.request(options))
      .then(() => resolve())
      .catch((e) => reject(e));
  });
}

async function fetchFileAsStream(url, httpOptions = {}) {
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

module.exports = {
  sendJsonStream,
  fetchFileAsStream,
  sendFileAsStream,
};
