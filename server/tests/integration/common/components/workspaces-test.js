const assert = require("assert");
const { Workspace } = require("../../../../src/common/model");
const { initComponents } = require("../../../utils/testUtils");

describe("Workspace component", () => {
  it("Permet de créer un workspace", async () => {
    const { testUser } = await initComponents();

    const created = await Workspace.findOne({ owner: testUser._id });

    assert.strictEqual(created.owner.toString(), testUser._id.toString());
    assert.strictEqual(created.nom, "Espace - me hack");
    assert.strictEqual(created.description, "L'espace de travail de me hack");
    assert.strictEqual(created.siren, null);

    const found = await Workspace.findOne({
      owner: testUser._id.toString(),
    });
    assert.strictEqual(found.owner.toString(), testUser._id.toString());
    assert.strictEqual(found.nom, "Espace - me hack");
    assert.strictEqual(found.description, "L'espace de travail de me hack");
    assert.strictEqual(found.siren, null);
  });

  it("Permet d'ajouter un contributeur à l'espace", async () => {
    const { testUser, components } = await initComponents();
    const testUserWks = await Workspace.findOne({ owner: testUser._id });

    await components.workspaces.addContributeur(testUserWks._id, "test.Entreprise@beta.gouv.fr", "wks.admin");

    const found = await Workspace.findOne({
      owner: testUser._id.toString(),
    });
    assert.strictEqual(found.owner.toString(), testUser._id.toString());
    assert.strictEqual(found.contributeurs.length === 1, true);
    assert.strictEqual(found.contributeurs[0], "test.Entreprise@beta.gouv.fr");
  });

  it("Permet de retirer un contributeur à l'espace", async () => {
    const { testUser, components } = await initComponents();
    const testUserWks = await Workspace.findOne({ owner: testUser._id });

    await components.workspaces.addContributeur(testUserWks._id, "test.Entreprise@beta.gouv.fr", "wks.admin");

    const perm = await components.permissions.hasPermission({
      workspaceId: testUserWks._id,
      dossierId: null,
      userEmail: "test.Entreprise@beta.gouv.fr",
    });

    await components.workspaces.removeContributeur(testUserWks._id, "test.Entreprise@beta.gouv.fr", perm._id);

    const found = await Workspace.findOne({
      owner: testUser._id.toString(),
    });
    assert.strictEqual(found.owner.toString(), testUser._id.toString());
    assert.strictEqual(found.contributeurs.length === 0, true);
  });
});
