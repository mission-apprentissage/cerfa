const assert = require("assert");
const dossiers = require("../../../../src/common/components/dossiers");
const users = require("../../../../src/common/components/users");
const { Dossier, Workspace } = require("../../../../src/common/model");

describe("Dossiers component", () => {
  it("Permet de créer un dossier", async () => {
    const { createUser } = await users();
    const testUser = await createUser("user", "password");

    const { createDossier } = await dossiers();

    const created = await createDossier({ sub: testUser.username });

    const wks = await Workspace.findOne({ owner: testUser._id });

    assert.strictEqual(created.workspaceId.toString(), wks._id.toString());
    assert.strictEqual(created.owner.toString(), testUser._id.toString());
    assert.strictEqual(created.draft, true);

    const found = await Dossier.findOne({ workspaceId: wks._id.toString() });
    assert.strictEqual(found.workspaceId.toString(), wks._id.toString());
    assert.strictEqual(found.owner.toString(), testUser._id.toString());
    assert.strictEqual(found.draft, true);
  });
});
