const assert = require("assert");
const config = require("../../../src/config");
const jwt = require("jsonwebtoken");
const { User } = require("../../../src/common/model");
const { hash } = require("../../../src/common/utils/sha512Utils");
const { startServer, getTokenFromCookie } = require("../../utils/testUtils");
const { omit } = require("lodash");

describe("[Routes] Login", () => {
  it("Vérifie qu'on peut se connecter", async () => {
    const { httpClient, components } = await startServer();
    await components.users.createUser("h@ck.me", "password", {
      email: "h@ck.me",
      nom: "hack",
      prenom: "me",
      telephone: "+33102030405",
    });

    const response = await httpClient.post("/api/v1/auth/login", {
      username: "h@ck.me",
      password: "password",
    });

    assert.strictEqual(response.status, 200);
    let token = getTokenFromCookie(response);
    const decoded = jwt.verify(token, config.auth.user.jwtSecret);
    assert.ok(decoded.iat);
    assert.ok(decoded.exp);
    assert.deepStrictEqual(omit(decoded, ["iat", "exp", "workspaceId"]), {
      account_status: "FORCE_RESET_PASSWORD",
      acl: [],
      email: "h@ck.me",
      nom: "hack",
      prenom: "me",
      roles: [],
      sub: "h@ck.me",
      iss: config.appName,
      permissions: {
        isAdmin: false,
      },
    });
  });

  it("Vérifie qu'un mot de passe invalide est rejeté", async () => {
    const { httpClient, components } = await startServer();
    await components.users.createUser("h@ck.me", "password", {
      email: "h@ck.me",
      nom: "hack",
      prenom: "me",
      telephone: "+33102030405",
    });

    const response = await httpClient.post("/api/v1/auth/login", {
      username: "h@ck.me",
      password: "INVALID",
    });

    assert.strictEqual(response.status, 401);
  });

  it("Vérifie qu'un login invalide est rejeté", async () => {
    const { httpClient } = await startServer();

    const response = await httpClient.post("/api/v1/auth/login", {
      email: "h@ck.me",
      password: "INVALID",
    });

    assert.strictEqual(response.status, 401);
  });

  it("Vérifie que le mot de passe est rehashé si trop faible", async () => {
    const { httpClient, components } = await startServer();
    await components.users.createUser("h@ck.me", "password", {
      hash: hash("password", 1000),
      email: "h@ck.me",
      nom: "hack",
      prenom: "me",
      telephone: "+33102030405",
    });

    let response = await httpClient.post("/api/v1/auth/login", {
      username: "h@ck.me",
      password: "password",
    });

    assert.strictEqual(response.status, 200);
    const found = await User.findOne({ email: "h@ck.me" });
    assert.strictEqual(found.password.startsWith("$6$rounds=1001"), true);

    response = await httpClient.post("/api/v1/auth/login", {
      username: "h@ck.me",
      password: "password",
    });
    assert.strictEqual(response.status, 200);
  });

  it("Vérifie que le mot de passe n'est pas rehashé si ok", async () => {
    const { httpClient, components } = await startServer();
    await components.users.createUser("h@ck.me", "password", {
      hash: hash("password", 1001),
      email: "h@ck.me",
      nom: "hack",
      prenom: "me",
      telephone: "+33102030405",
    });
    const previous = await User.findOne({ email: "h@ck.me" });

    const response = await httpClient.post("/api/v1/auth/login", {
      username: "h@ck.me",
      password: "password",
    });

    assert.strictEqual(response.status, 200);
    const found = await User.findOne({ email: "h@ck.me" });
    assert.strictEqual(previous.password, found.password);
  });

  it("Vérifie que le mot de passe n'est pas rehashé si invalide", async () => {
    const { httpClient, components } = await startServer();
    await components.users.createUser("h@ck.me", "password", {
      hash: hash("password", 1001),
      email: "h@ck.me",
      nom: "hack",
      prenom: "me",
      telephone: "+33102030405",
    });
    const previous = await User.findOne({ email: "h@ck.me" });

    const response = await httpClient.post("/api/v1/auth/login", {
      username: "h@ck.me",
      password: "invalid",
    });

    assert.strictEqual(response.status, 401);
    const found = await User.findOne({ email: "h@ck.me" });
    assert.strictEqual(previous.password, found.password);
  });
});
