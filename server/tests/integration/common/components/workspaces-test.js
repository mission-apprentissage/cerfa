const assert = require("assert");
// const workspaces = require("../../../../src/common/components/workspaces");
const { Workspace } = require("../../../../src/common/model");
const { initComponents } = require("../../../utils/testUtils");
// const { mongoose } = require("../../../../src/common/mongodb");

describe("Workspace component", () => {
  it("Permet de créer un workspace", async () => {
    const { testUser } = await initComponents();

    // const { createWorkspace } = await workspaces();

    // const testContributeurId = mongoose.Types.ObjectId().toString();

    // const created = await createWorkspace({
    //   username: testUser.username,
    //   nom: "Espace test",
    //   description: "Votre espace test",
    //   contributeurs: [testContributeurId],
    // });
    const created = await Workspace.findOne({ owner: testUser._id });

    assert.strictEqual(created.owner.toString(), testUser._id.toString());
    assert.strictEqual(created.nom, "Espace - me hack");
    assert.strictEqual(created.description, "L'espace de travail de me hack");
    assert.strictEqual(created.siren, null);
    // assert.strictEqual(created.contributeurs[0].toString(), testContributeurId);

    const found = await Workspace.findOne({
      owner: testUser._id.toString(),
    });
    assert.strictEqual(found.owner.toString(), testUser._id.toString());
    assert.strictEqual(found.nom, "Espace - me hack");
    assert.strictEqual(found.description, "L'espace de travail de me hack");
    assert.strictEqual(found.siren, null);
    // assert.strictEqual(found.contributeurs[0].toString(), testContributeurId);
  });
});
