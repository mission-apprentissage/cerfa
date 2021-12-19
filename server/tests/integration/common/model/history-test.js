const assert = require("assert");
const { History } = require("../../../../src/common/model");

describe("History", () => {
  it("Doit créer une historique sur un champ", async () => {
    await History.create({
      dossierId: "619baec6fcdd030ba4e13c40",
      context: "organismeFormation.siret",
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

    const results = await History.find({
      dossierId: "619baec6fcdd030ba4e13c40",
      context: "organismeFormation.siret",
    });

    assert.equal(results.length === 1, true);
  });
});
