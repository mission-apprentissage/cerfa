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

  it("Vérifie qu'on peut uploader un fichier", async () => {
    let { httpClient, createAndLogUser } = await startServerWithClamav({ isInfected: false });
    let { Cookie, testDossier } = await createAndLogUser("user1@apprentissage.beta.gouv.fr", "password", {
      nom: "Robert",
      prenom: "Henri",
      permissions: { isAdmin: true },
      account_status: "CONFIRMED",
    });

    var form = new FormData();
    form.append("file", fs.createReadStream(__filename), {
      filename: "testFile.pdf",
      contentType: "application/pdf",
    });

    const response = await httpClient.post(
      `/api/v1/upload?test=true&dossierId=${testDossier._id.toString()}&typeDocument=CONVENTION_FORMATION`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          cookie: Cookie,
        },
      }
    );

    assert.strictEqual(response.status, 200);
    // eslint-disable-next-line no-unused-vars
    const { dateAjout, dateMiseAJour, ...restData } = response.data.documents[0];
    assert.deepStrictEqual(restData, {
      cheminFichier: `contrats/${testDossier._id.toString()}/testFile.pdf`,
      nomFichier: "testFile.pdf",
      quiMiseAJour: "user1@apprentissage.beta.gouv.fr",
      tailleFichier: 0,
      typeDocument: "CONVENTION_FORMATION",
      typeFichier: "pdf",
    });
  });

  it("Vérifie qu'on ne peut pas uploader un fichier qui n'a pas le bon content type", async () => {
    let { httpClient, createAndLogUser } = await startServerWithClamav({ isInfected: false });
    let { Cookie, testDossier } = await createAndLogUser("user1@apprentissage.beta.gouv.fr", "password", {
      nom: "Robert",
      prenom: "Henri",
      permissions: { isAdmin: true },
      account_status: "CONFIRMED",
    });

    var form = new FormData();
    form.append("file", fs.createReadStream(__filename), {
      filename: "testFile.pdf",
    });

    const response = await httpClient.post(
      `/api/v1/upload?test=true&dossierId=${testDossier._id.toString()}&typeDocument=CONVENTION_FORMATION`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          cookie: Cookie,
        },
      }
    );

    assert.strictEqual(response.status, 400);
    assert.deepStrictEqual(response.data, { error: "Le contenu du fichier est invalide" });
  });

  it("Vérifie qu'on ne peut pas uploader un fichier qui n'a pas la bonne extension", async () => {
    let { httpClient, createAndLogUser } = await startServerWithClamav({ isInfected: false });
    let { Cookie, testDossier } = await createAndLogUser("user1@apprentissage.beta.gouv.fr", "password", {
      nom: "Robert",
      prenom: "Henri",
      permissions: { isAdmin: true },
      account_status: "CONFIRMED",
    });

    var form = new FormData();
    form.append("file", fs.createReadStream(__filename), {
      filename: "testFile.EXE",
    });

    const response = await httpClient.post(
      `/api/v1/upload?test=true&dossierId=${testDossier._id.toString()}&typeDocument=CONVENTION_FORMATION`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          cookie: Cookie,
        },
      }
    );

    assert.strictEqual(response.status, 400);
    assert.deepStrictEqual(response.data, { error: "Le contenu du fichier est invalide" });
  });

  it("Vérifie qu'on ne peut pas uploader un fichier avec un virus", async () => {
    let { httpClient, createAndLogUser } = await startServerWithClamav({ isInfected: true });
    let { Cookie, testDossier } = await createAndLogUser("user1@apprentissage.beta.gouv.fr", "password", {
      nom: "Robert",
      prenom: "Henri",
      permissions: { isAdmin: true },
      account_status: "CONFIRMED",
    });

    var form = new FormData();
    form.append("file", fs.createReadStream(__filename), {
      filename: "virus.pdf",
      contentType: "application/pdf",
    });

    const response = await httpClient.post(
      `/api/v1/upload?test=true&dossierId=${testDossier._id.toString()}&typeDocument=CONVENTION_FORMATION`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          cookie: Cookie,
        },
      }
    );

    assert.strictEqual(response.status, 400);
    assert.deepStrictEqual(response.data, { error: "Le contenu du fichier est invalide" });
  });
});
