// eslint-disable-next-line node/no-extraneous-require
const axios = require("axios");
const config = require("../../config");
const { fetchFileAsStream, sendFileAsStream } = require("./httpUtils");

const DEFAULT_STORAGE_NAME = "mna-cerfa";

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

async function requestObjectAccess(path, options) {
  let storage = options.storage || DEFAULT_STORAGE_NAME;
  let { baseUrl, token } = await authenticate(config.ovh.storage.uri);

  return {
    url: encodeURI(`${baseUrl}/${storage}/${path}`),
    token,
  };
}

module.exports = {
  getObjectFromStorage: async (path, options = {}) => {
    let { url, token } = await requestObjectAccess(path, options);
    return fetchFileAsStream(url, {
      headers: {
        "X-Auth-Token": token,
        Accept: "application/json",
      },
    });
  },
  putObjectIntoStorage: async (path, stream, options = {}) => {
    let { url, token } = await requestObjectAccess(path, options);

    return sendFileAsStream(url, stream, {
      headers: {
        "X-Auth-Token": token,
        Accept: "application/json",
        "Content-Type": options.contentType || "application/octet-stream",
      },
    });
  },
};
