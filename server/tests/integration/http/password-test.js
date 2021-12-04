const assert = require("assert");
const config = require("../../../src/config");
const jwt = require("jsonwebtoken");
const { createPasswordToken } = require("../../../src/common/utils/jwtUtils");
const { startServer, getTokenFromCookie } = require("../../utils/testUtils");

describe("[Routes] Password", () => {
  it("Vérifie qu'un utilisateur peut faire une demande de réinitialisation de mot de passe", async () => {
    const { httpClient, createAndLogUser, getEmailsSent } = await startServer();
    await createAndLogUser("user", "password", {
      email: "user1@apprentissage.beta.gouv.fr",
      permissions: { isAdmin: true },
    });

    const response = await httpClient.post("/api/v1/password/forgotten-password", {
      username: "user",
    });

    assert.strictEqual(response.status, 200);
    let emailsSent = getEmailsSent();
    assert.strictEqual(emailsSent.length, 1);
    assert.strictEqual(emailsSent[0].to, "user1@apprentissage.beta.gouv.fr");
    assert.strictEqual(emailsSent[0].from, "no-reply@apprentissage.beta.gouv.fr");
    assert.ok(emailsSent[0].subject.indexOf("Réinitialiser votre mot de passe") !== -1);
  });

  it("Vérifie qu'on ne peut pas demander la réinitialisation du mot de passe pour un utilisateur inconnu", async () => {
    const { httpClient, createAndLogUser } = await startServer();
    await createAndLogUser("admin", "password", { email: "h@ck.me", permissions: { isAdmin: true } });

    const response = await httpClient.post("/api/v1/password/forgotten-password", {
      username: "inconnu",
    });

    assert.strictEqual(response.status, 400);
  });

  it("Vérifie qu'on ne peut pas demander la réinitialisation du mot de passe pour un utilisateur invalide", async () => {
    const { httpClient, createAndLogUser } = await startServer();
    await createAndLogUser("user123", "password", { email: "h@ck.me" });

    const response = await httpClient.post("/api/v1/password/forgotten-password", {
      type: "cfa",
      username: "user123456",
    });

    assert.strictEqual(response.status, 400);
  });

  it("Vérifie qu'un utilisateur peut changer son mot de passe", async () => {
    const { httpClient, createAndLogUser } = await startServer();
    await createAndLogUser("admin", "password", { email: "h@ck.me", permissions: { isAdmin: true } });

    const response = await httpClient.post("/api/v1/password/reset-password", {
      passwordToken: createPasswordToken("admin"),
      newPassword: "Password!123456",
    });

    assert.strictEqual(response.status, 200);
    let token = getTokenFromCookie(response);
    const decoded = jwt.verify(token, config.auth.user.jwtSecret);
    assert.ok(decoded.iat);
    assert.ok(decoded.exp);
  });

  it("Vérifie qu'on doit spécifier un mot de passe valide", async () => {
    const { httpClient, createAndLogUser } = await startServer();
    await createAndLogUser("admin", "password", { email: "h@ck.me", permissions: { isAdmin: true } });

    const response = await httpClient.post("/api/v1/password/reset-password", {
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
