const assert = require("assert");
const { History } = require("../../../src/common/model");

describe("History", () => {
  it("Doit créer une historique sur un champ", async () => {
    const history = await History.create({
      idDossier: "619baec6fcdd030ba4e13c40",
      contexte: "organismeFormation.siret",
      history: [
        {
          from: null,
          to: "98765432400070",
          how: "manuel",
          when: Date.now(),
          who: "Antoine Bigard",
        },
        {
          from: "98765432400070",
          to: "98765432400019",
          how: "manuel",
          when: Date.now(),
          who: "Paul Pierre",
        },
      ],
    });

    console.log(history);

    const results = await History.find({ idDossier: "619baec6fcdd030ba4e13c40", contexte: "organismeFormation.siret" });

    assert.equal(results.length === 1, true);
  });
});
