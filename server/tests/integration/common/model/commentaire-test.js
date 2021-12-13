const assert = require("assert");
const { Commentaire } = require("../../../../src/common/model");

describe("Commentaire", () => {
  it("Doit créer un commentaire", async () => {
    await Commentaire.create({
      dossierId: "619baec6fcdd030ba4e13c40",
      contexte: "organismeFormation.siret",
      discussions: [
        {
          resolve: false,
          feed: [
            {
              contenu: "Je ne sais pas remplir ce champ. Pourriez-vous m'aider svp?",
              dateAjout: Date.now(),
              createdBy: "Antoine Bigard",
              notify: ["Paul Pierre"],
            },
          ],
        },
      ],
    });

    const results = await Commentaire.find({});

    assert.equal(results.length === 1, true);
  });
});
