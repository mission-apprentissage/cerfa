const assert = require("assert");
const httpTests = require("../../utils/httpTests");
const { createPasswordToken } = require("../../../src/common/utils/jwtUtils");

const BASE_URL = "/api/v1/password";

httpTests(__filename, ({ startServer }) => {
  it("Vérifie qu'un utilisateur peut faire une demande de réinitialisation de mot de passe", async () => {
    const { httpClient, createAndLogUser } = await startServer();
    await createAndLogUser("user", "password", { permissions: { isAdmin: true } });

    const response = await httpClient.post(`${BASE_URL}/forgotten-password?noEmail=true`, {
      username: "user",
    });

    assert.strictEqual(response.status, 200);
    assert.ok(response.data.token);
  });

  it("Vérifie qu'on ne peut pas demander la réinitialisation du mot de passe pour un utilisateur inconnu", async () => {
    const { httpClient, createAndLogUser } = await startServer();
    await createAndLogUser("admin", "password", { permissions: { isAdmin: true } });

    const response = await httpClient.post(`${BASE_URL}/forgotten-password?noEmail=true`, {
      username: "inconnu",
    });

    assert.strictEqual(response.status, 400);
  });

  it("Vérifie qu'on ne peut pas demander la réinitialisation du mot de passe pour un utilisateur invalide", async () => {
    const { httpClient, createAndLogUser } = await startServer();
    await createAndLogUser("user123", "password");

    const response = await httpClient.post(`${BASE_URL}/forgotten-password?noEmail=true`, {
      type: "cfa",
      username: "user123456",
    });

    assert.strictEqual(response.status, 400);
  });

  it("Vérifie qu'un utilisateur peut changer son mot de passe", async () => {
    const { httpClient, createAndLogUser } = await startServer();
    await createAndLogUser("admin", "password", { permissions: { isAdmin: true } });

    const response = await httpClient.post(`${BASE_URL}/reset-password`, {
      passwordToken: createPasswordToken("admin"),
      newPassword: "Password!123456",
    });

    assert.strictEqual(response.status, 200);
    const responseLogin = await httpClient.post("/api/v1/auth/login", {
      username: "admin",
      password: "Password!123456",
    });

    assert.strictEqual(responseLogin.status, 200);
    // const { permissions, sub } = responseLogin.data;
    // assert.strictEqual(permissions.isAdmin, true);
    // assert.strictEqual(sub, "admin");
  });

  it("Vérifie qu'on doit spécifier un mot de passe valide", async () => {
    const { httpClient, createAndLogUser } = await startServer();
    await createAndLogUser("admin", "password", { permissions: { isAdmin: true } });

    const response = await httpClient.post(`${BASE_URL}/reset-password`, {
      passwordToken: createPasswordToken("admin"),
      newPassword: "invalid",
    });

    assert.strictEqual(response.status, 400);
    assert.deepStrictEqual(response.data, {
      statusCode: 400,
      error: "Bad Request",
      message: "Erreur de validation",
      details: [
        {
          message:
            '"newPassword" with value "invalid" fails to match the required pattern: /^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\d\\s:])([^\\s]){8,}$/',
          path: ["newPassword"],
          type: "string.pattern.base",
          context: { regex: {}, value: "invalid", label: "newPassword", key: "newPassword" },
        },
      ],
    });
  });
});
