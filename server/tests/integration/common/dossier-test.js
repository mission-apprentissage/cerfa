const assert = require("assert");
const { Dossier } = require("../../../src/common/model");
const { mongoose } = require("../../../src/common/mongodb");

describe("Dossier", () => {
  it("Doit créer un dossier NON-DRAFT", async () => {
    await Dossier.create({
      draft: false,
      cerfaId: "619baec6fcdd030ba4e13c40",
      documents: [
        {
          typeDocument: "CONVENTION_FORMATION",
          typeFichier: "pdf",
          nomFichier: "conventionFormation",
          cheminFichier: "/upload/xxxxx/conventionFormation.pdf",
          quiMiseAJour: "test-user",
        },
      ],
      etat: "TRANSMIS",
      owner: mongoose.Types.ObjectId(),
      workspaceId: mongoose.Types.ObjectId(),
    });

    const results = await Dossier.find({});

    assert.equal(results.length === 1, true);
  });
  it("Doit créer un dossier DRAFT", async () => {
    await Dossier.create({
      draft: true,
      cerfaId: "619baec6fcdd030ba4e13c40",
      owner: mongoose.Types.ObjectId(),
      workspaceId: mongoose.Types.ObjectId(),
    });

    const results = await Dossier.find({});

    assert.equal(results.length === 1, true);
  });
});
