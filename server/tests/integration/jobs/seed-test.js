const assert = require("assert");
const integrationTests = require("../../utils/integrationTests");
const { Sample } = require("../../../src/common/model");
const seed = require("../../../src/jobs/seed/seed");

integrationTests(__filename, ({ getContext }) => {
  it("Vérifie la création d'entité depuis le job", async () => {
    const { db } = await getContext();
    await Sample.deleteMany({});
    await seed(db);

    const results = await Sample.find({ nom: "Test Sample", $and: [{ valeur: "Valeur exemple" }] });
    assert.equal(results.length > 0, true);
  });
});
