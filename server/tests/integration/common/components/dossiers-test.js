const assert = require("assert");
const dossiers = require("../../../../src/common/components/dossiers");
const { Dossier, Workspace } = require("../../../../src/common/model");
const { initComponents } = require("../../../utils/testUtils");

describe("Dossiers component", () => {
  it("Permet de créer un dossier", async () => {
    const { testUser, components } = await initComponents();
    await components.roles.createRole({ name: "dossier.admin", type: "permission", acl: [] });

    const { createDossier } = await dossiers();

    const created = await createDossier({ sub: testUser.email });

    const wks = await Workspace.findOne({ owner: testUser._id });

    assert.strictEqual(created.workspaceId.toString(), wks._id.toString());
    assert.strictEqual(created.owner.toString(), testUser._id.toString());
    assert.strictEqual(created.draft, true);

    const found = await Dossier.findOne({ workspaceId: wks._id.toString() });
    assert.strictEqual(found.workspaceId.toString(), wks._id.toString());
    assert.strictEqual(found.owner.toString(), testUser._id.toString());
    assert.strictEqual(found.draft, true);
  });
  it("Permet de sauvegarder un dossier", async () => {
    const { testUser, components } = await initComponents();
    await components.roles.createRole({ name: "dossier.admin", type: "permission", acl: [] });
    const { createDossier, saveDossier } = await dossiers();

    const created = await createDossier({ sub: testUser.email });

    const saved = await saveDossier(created._id.toString());

    assert.strictEqual(created._id.toString(), saved._id.toString());
    assert.strictEqual(created.saved, false);
    assert.strictEqual(saved.saved, true);
  });
});
