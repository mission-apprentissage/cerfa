const assert = require("assert");
const config = require("../../../src/config");
const { startServer } = require("../../utils/testUtils");

describe("[Routes] Healthcheck", () => {
  it("Vérifie que le server fonctionne", async () => {
    const { httpClient } = await startServer();

    const response = await httpClient.get("/api");

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.data.name, `Serveur MNA - ${config.appName}`);
    assert.strictEqual(response.data.healthcheck.mongodb, true);
    assert.ok(response.data.env);
    assert.ok(response.data.version);
  });
});
