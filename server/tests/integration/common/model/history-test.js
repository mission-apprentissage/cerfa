const assert = require("assert");
const { CerfaHistory } = require("../../../../src/common/model");

describe("CerfaHistory", () => {
  it("Doit créer un historique pour un cerfa", async () => {
    await CerfaHistory.create({
      cerfaId: "619baec6fcdd030ba4e13c40",
      history: {
        employeur: {
          siret: {
            from: "123",
            to: "456",
            how: "manuel",
            when: Date.now(),
            who: "1Jnkljn123KNJ",
          },
        },
      },
    });

    const results = await CerfaHistory.find({
      cerfaId: "619baec6fcdd030ba4e13c40",
    });

    assert.equal(results.length === 1, true);
  });
});
