const axios = require("axios");
const logger = require("../logger");
const ApiError = require("./_apiError");
const apiRateLimiter = require("./_apiRateLimiter");

const https = require("https");
const fs = require("fs");

// const HOST = "sia-refonte-api-agecap-rec-ext.rct01.kleegroup.com";
// const ROOT_PATH = "/agecap-api";
// const CERT_PATH = "/agecap";
// const requestAgecap = (path) => {
//   const req = https.request(
//     {
//       host: HOST,
//       port: 443,
//       secureProtocol: "TLSv1_2_method",
//       key: fs.readFileSync(`${__dirname}/${CERT_PATH}/client-key.pem`),
//       cert: fs.readFileSync(`${__dirname}/${CERT_PATH}/client-crt.pem`),
//       ca: [fs.readFileSync(`${__dirname}/${CERT_PATH}/server-ca-crt.pem`)],
//       path: `${ROOT_PATH}${path}`,
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     },
//     function (response) {
//       console.log("Response statusCode: ", response.statusCode);
//       console.log("Response headers: ", response.headers);
//       console.log("Server Host Name: " + response.connection.getPeerCertificate().subject.CN);
//       if (response.statusCode !== 200) {
//         console.log(`Wrong status code`);
//         return;
//       }
//       let rawData = "";
//       response.on("data", function (data) {
//         rawData += data;
//       });
//       response.on("end", function () {
//         if (rawData.length > 0) {
//           console.log(`Received message: ${rawData}`);
//         }
//         console.log(`TLS Connection closed!`);
//         req.end();
//         return;
//       });
//     }
//   );
// };

const CERT_PATH = "data/agecap";

const httpsAgent = new https.Agent({
  key: fs.readFileSync(`${__dirname}/${CERT_PATH}/client-key.pem`),
  cert: fs.readFileSync(`${__dirname}/${CERT_PATH}/client-crt.pem`),
  ca: [fs.readFileSync(`${__dirname}/${CERT_PATH}/server-ca-crt.pem`)],
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
