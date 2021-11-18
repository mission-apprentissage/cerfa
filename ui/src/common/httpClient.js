import { getAuth } from "./auth";
import { emitter } from "./emitter";

class AuthError extends Error {
  constructor(json, statusCode) {
    super(`Request rejected with status code ${statusCode}`);
    this.json = json;
    this.statusCode = statusCode;
    this.prettyMessage = "Identifiant ou mot de passe invalide";
  }
}

class HTTPError extends Error {
  constructor(message, json, statusCode) {
    super(message);
    this.json = json;
    this.statusCode = statusCode;
    this.prettyMessage = "Une erreur technique est survenue";
  }
}

const handleResponse = (path, response) => {
  let statusCode = response.status;
  if (statusCode >= 400 && statusCode < 600) {
    emitter.emit("http:error", response);

    if (statusCode === 401 || statusCode === 403) {
      throw new AuthError(response.json(), statusCode);
    } else {
      throw new HTTPError(
        `Server returned ${statusCode} when requesting resource ${path}`,
        response.json(),
        statusCode
      );
    }
  }
  return response.json();
};

const getHeaders = (authorization = true, contentType = "application/json") => {
  let auth = getAuth();
  let result = {
    Accept: "application/json",
    ...(auth.sub !== "anonymous" ? { Authorization: `Bearer ${auth.token}` } : {}),
    ...(contentType ? { "Content-Type": contentType } : {}),
  };
  if (!authorization) {
    delete result.Authorization;
  }
  return result;
};

export const _get = (path, auth = true) => {
  return fetch(`${path}`, {
    method: "GET",
    headers: getHeaders(auth),
  }).then((res) => handleResponse(path, res));
};

export const _post = (path, body, auth = true) => {
  return fetch(`${path}`, {
    method: "POST",
    headers: getHeaders(auth),
    body: JSON.stringify(body),
  }).then((res) => handleResponse(path, res));
};

export const _postFile = (path, data, auth = true) => {
  return fetch(`${path}`, {
    method: "POST",
    headers: getHeaders(auth, null),
    body: data,
  }).then((res) => handleResponse(path, res));
};

export const _put = (path, body = {}, auth = true) => {
  return fetch(`${path}`, {
    method: "PUT",
    headers: getHeaders(auth),
    body: JSON.stringify(body),
  }).then((res) => handleResponse(path, res));
};

export const _delete = (path, auth = true) => {
  return fetch(`${path}`, {
    method: "DELETE",
    headers: getHeaders(auth),
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
