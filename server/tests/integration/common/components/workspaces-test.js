const assert = require("assert");
const workspaces = require("../../../../src/common/components/workspaces");
const users = require("../../../../src/common/components/users");
const { Workspace } = require("../../../../src/common/model");
const { mongoose } = require("../../../../src/common/mongodb");

describe("Workspace component", () => {
  it("Permet de créer un workspace", async () => {
    const { createUser } = await users();
    const testUser = await createUser("user", "password", { email: "h@ck.me" });

    const { createWorkspace } = await workspaces();

    const testContributeurId = mongoose.Types.ObjectId().toString();

    const created = await createWorkspace({
      username: testUser.username,
      nom: "Espace test",
      description: "Votre espace test",
      contributeurs: [testContributeurId],
    });

    assert.strictEqual(created.owner.toString(), testUser._id.toString());
    assert.strictEqual(created.nom, "Espace test");
    assert.strictEqual(created.description, "Votre espace test");
    assert.strictEqual(created.siren, null);
    assert.strictEqual(created.contributeurs[0].toString(), testContributeurId);

    const found = await Workspace.findOne({
      owner: testUser._id.toString(),
    });
    assert.strictEqual(found.owner.toString(), testUser._id.toString());
    assert.strictEqual(found.nom, "Espace test");
    assert.strictEqual(found.description, "Votre espace test");
    assert.strictEqual(found.siren, null);
    assert.strictEqual(found.contributeurs[0].toString(), testContributeurId);
  });
});
