const assert = require("assert");
const cerfas = require("../../../../src/common/components/cerfas");
const { Cerfa } = require("../../../../src/common/model");
const { mongoose } = require("../../../../src/common/mongodb");

describe("Cerfas component", () => {
  it("Permet de créer un cerfa", async () => {
    const { createCerfa } = await cerfas();

    const testDossierId = mongoose.Types.ObjectId().toString();
    const created = await createCerfa({ dossierId: testDossierId });

    assert.strictEqual(created.dossierId.toString(), testDossierId);
    assert.strictEqual(created.draft, true);

    const found = await Cerfa.findOne({ dossierId: testDossierId });
    assert.strictEqual(found.dossierId.toString(), testDossierId);
    assert.strictEqual(found.draft, true);
  });
});
