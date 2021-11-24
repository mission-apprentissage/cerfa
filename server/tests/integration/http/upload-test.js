const assert = require("assert");
const fs = require("fs");
const FormData = require("form-data");
const { startServer } = require("../../utils/testUtils");

describe("[Routes] Upload", () => {
  it("Vérifie qu'on ne peut pas uploader un fichier qui n'a pas le bon content type", async () => {
    let { httpClient, createAndLogUser } = await startServer();
    let { Cookie } = await createAndLogUser("user", "password", {
      email: "user1@apprentissage.beta.gouv.fr",
      permissions: { isAdmin: true },
    });

    var form = new FormData();
    form.append("file", fs.createReadStream(__filename), {
      filename: "testFile.pdf",
    });

    const response = await httpClient.post("/api/v1/upload", form, {
      headers: {
        ...form.getHeaders(),
        cookie: Cookie,
      },
    });

    assert.strictEqual(response.status, 400);
    assert.deepStrictEqual(response.data, { error: "Le fichier n'est pas au bon format" });
  });
});
