// eslint-disable-next-line node/no-extraneous-require
const axios = require("axios");
const config = require("../../config");
const logger = require("../logger");
const { createRequestStream, createUploadStream } = require("./httpUtils");

async function authenticate(uri) {
  let regExp = new RegExp(/^(https:\/\/)(.+):(.+):(.+)@(.*)$/);

  if (!regExp.test(uri)) {
    throw new Error("Invalid OVH URI");
  }

  let [, protocol, user, password, tenantId, authUrl] = uri.match(regExp);
  let response = await axios.post(`${protocol}${authUrl}`, {
    auth: {
      identity: {
        tenantId,
        methods: ["password"],
        password: {
          user: {
            name: user,
            password: password,
            domain: {
              name: "Default",
            },
          },
        },
      },
    },
  });

  let token = response.headers["x-subject-token"];
  let { endpoints } = response.data.token.catalog.find((c) => c.type === "object-store");
  let { url: baseUrl } = endpoints.find((s) => s.region === "GRA");

  return { baseUrl, token };
}

async function requestObjectAccess(path, options = {}) {
  let storage = options.storage || config.storageName;
  let { baseUrl, token } = await authenticate(config.ovh.storage.uri);

  return {
    url: encodeURI(`${baseUrl}/${storage}${path === "/" ? "" : `/${path}`}`),
    token,
  };
}

module.exports = {
  listStorage: async () => {
    logger.debug(`Fetching OVH Object Storage file list`);
    let { url, token } = await requestObjectAccess("/");
    let response = await axios.get(url, {
      headers: {
        "X-Auth-Token": token,
        Accept: "application/json",
      },
    });

    return response.data;
  },
  getFromStorage: async (path, options = {}) => {
    logger.debug(`Fetching OVH Object Storage file ${path}`);
    let { url, token } = await requestObjectAccess(path, options);
    return createRequestStream(url, {
      method: "GET",
      headers: {
        "X-Auth-Token": token,
        Accept: "application/json",
      },
    });
  },
  uploadToStorage: async (path, options = {}) => {
    logger.debug(`Uploading OVH Object Storage file ${path}`);
    let { url, token } = await requestObjectAccess(path, options);
    return createUploadStream(url, {
      headers: {
        "X-Auth-Token": token,
        Accept: "application/json",
        "Content-Type": options.contentType || "application/octet-stream",
      },
    });
  },
  deleteFromStorage: async (path, options = {}) => {
    logger.debug(`Deleting OVH Object Storage file ${path}`);
    let { url, token } = await requestObjectAccess(path, options);
    return createRequestStream(url, {
      method: "DELETE",
      headers: {
        "X-Auth-Token": token,
        Accept: "application/json",
      },
    });
  },
};
