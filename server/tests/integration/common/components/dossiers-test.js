const assert = require("assert");
const dossiers = require("../../../../src/common/components/dossiers");
const users = require("../../../../src/common/components/users");
const { Dossier } = require("../../../../src/common/model");
const { mongoose } = require("../../../../src/common/mongodb");

describe("Dossiers component", () => {
  it("Permet de créer un dossier", async () => {
    const { createUser } = await users();
    const testUser = await createUser("user", "password");

    const { createDossier } = await dossiers();
    const testWorkspaceId = mongoose.Types.ObjectId().toString();

    const created = await createDossier({ workspaceId: testWorkspaceId }, { sub: testUser.username });

    assert.strictEqual(created.workspaceId.toString(), testWorkspaceId);
    assert.strictEqual(created.owner.toString(), testUser._id.toString());
    assert.strictEqual(created.draft, true);

    const found = await Dossier.findOne({ workspaceId: testWorkspaceId });
    assert.strictEqual(found.workspaceId.toString(), testWorkspaceId);
    assert.strictEqual(found.owner.toString(), testUser._id.toString());
    assert.strictEqual(found.draft, true);
  });
});
