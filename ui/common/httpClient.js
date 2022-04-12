import { getAuth } from "./globalStates";
import { emitter } from "./emitter";
import { fetch as fetchPolyfill } from "whatwg-fetch";

class AuthError extends Error {
  constructor(json, statusCode) {
    super(`Request rejected with status code ${statusCode}`);
    this.json = json;
    this.statusCode = statusCode;
    this.prettyMessage = "Identifiant ou mot de passe invalide";
  }
}

class HTTPError extends Error {
  constructor(message, json, statusCode, messages = null) {
    super(message);
    this.json = json;
    this.messages = messages;
    this.statusCode = statusCode;
    this.prettyMessage = "Une erreur technique est survenue";
  }
}

const handleResponse = async (path, response) => {
  let statusCode = response.status;
  if (statusCode >= 400 && statusCode < 600) {
    emitter.emit("http:error", response);

    if (statusCode === 401 || statusCode === 403) {
      throw new AuthError(response, statusCode);
    } else {
      const messages = await response.json();
      throw new HTTPError(
        `Server returned ${statusCode} when requesting resource ${path}`,
        response,
        statusCode,
        messages
      );
    }
  }
  return response.json();
};

const getHeaders = (contentType = "application/json") => {
  let result = {
    Accept: "application/json",
    ...(contentType ? { "Content-Type": contentType } : {}),
  };
  return result;
};

export const _get = (path, signal) => {
  return fetchPolyfill(`${path}`, {
    method: "GET",
    headers: getHeaders(),
    signal,
  }).then((res) => handleResponse(path, res));
};

export const _post = (path, body, signal) => {
  return fetchPolyfill(`${path}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
    signal,
  }).then((res) => handleResponse(path, res));
};

export const _postFile = (path, data) => {
  return fetchPolyfill(`${path}`, {
    method: "POST",
    headers: getHeaders(null),
    body: data,
  }).then((res) => handleResponse(path, res));
};

export const _put = (path, body = {}) => {
  return fetchPolyfill(`${path}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(body),
  }).then((res) => handleResponse(path, res));
};

export const _delete = (path) => {
  return fetchPolyfill(`${path}`, {
    method: "DELETE",
    headers: getHeaders(),
  }).then((res) => handleResponse(path, res));
};

export const buildLink = (path) => {
  let auth = getAuth();
  if (auth.sub !== "anonymous") {
    //TODO better handle params
    return `${path}?token=${auth.token}`;
  }
  return path;
};
