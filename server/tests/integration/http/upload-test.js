const assert = require("assert");
const fs = require("fs");
const FormData = require("form-data");
const { startServer, fakeClamav } = require("../../utils/testUtils");

describe("[Routes] Upload", () => {
  function startServerWithClamav(res) {
    return startServer({
      clamav: fakeClamav(res),
    });
  }

  it("Vérifie qu'on ne peut uploader un fichier", async () => {
    let { httpClient, createAndLogUser } = await startServerWithClamav({ isInfected: false });
    let { Cookie } = await createAndLogUser("user1@apprentissage.beta.gouv.fr", "password", {
      nom: "Robert",
      prenom: "Henri",
      permissions: { isAdmin: true },
    });

    var form = new FormData();
    form.append("file", fs.createReadStream(__filename), {
      filename: "testFile.pdf",
      contentType: "application/pdf",
    });

    const response = await httpClient.post("/api/v1/upload?test=true", form, {
      headers: {
        ...form.getHeaders(),
        cookie: Cookie,
      },
    });

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.data, {});
  });

  it("Vérifie qu'on ne peut pas uploader un fichier qui n'a pas le bon content type", async () => {
    let { httpClient, createAndLogUser } = await startServerWithClamav({ isInfected: false });
    let { Cookie } = await createAndLogUser("user1@apprentissage.beta.gouv.fr", "password", {
      nom: "Robert",
      prenom: "Henri",
      permissions: { isAdmin: true },
    });

    var form = new FormData();
    form.append("file", fs.createReadStream(__filename), {
      filename: "testFile.pdf",
    });

    const response = await httpClient.post("/api/v1/upload?test=true", form, {
      headers: {
        ...form.getHeaders(),
        cookie: Cookie,
      },
    });

    assert.strictEqual(response.status, 400);
    assert.deepStrictEqual(response.data, { error: "Le fichier n'est pas au bon format" });
  });

  it("Vérifie qu'on ne peut pas uploader un fichier avec un virus", async () => {
    let { httpClient, createAndLogUser } = await startServerWithClamav({ isInfected: true });
    let { Cookie } = await createAndLogUser("user1@apprentissage.beta.gouv.fr", "password", {
      nom: "Robert",
      prenom: "Henri",
      permissions: { isAdmin: true },
    });

    var form = new FormData();
    form.append("file", fs.createReadStream(__filename), {
      filename: "virus.pdf",
      contentType: "application/pdf",
    });

    const response = await httpClient.post("/api/v1/upload?test=true", form, {
      headers: {
        ...form.getHeaders(),
        cookie: Cookie,
      },
    });

    assert.strictEqual(response.status, 400);
    assert.deepStrictEqual(response.data, { error: "Le contenu du fichier est invalide" });
  });
});
