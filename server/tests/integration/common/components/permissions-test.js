const assert = require("assert");
const permissions = require("../../../../src/common/components/permissions");
const { Permission } = require("../../../../src/common/model");
const { mongoose } = require("../../../../src/common/mongodb");
const { initComponents } = require("../../../utils/testUtils");

describe("Permission component", () => {
  it("Permet de créer une permission", async () => {
    const { testUser, testRole } = await initComponents();

    const { createPermission } = await permissions();
    const testWorkspaceId = mongoose.Types.ObjectId().toString();

    const created = await createPermission({
      workspaceId: testWorkspaceId,
      dossierId: null,
      userEmail: testUser.email,
      role: testRole.name,
    });

    assert.strictEqual(created.workspaceId.toString(), testWorkspaceId);
    assert.strictEqual(created.dossierId, null);
    assert.strictEqual(created.userEmail, testUser.email);
    assert.strictEqual(created.role.toString(), testRole._id.toString());

    const found = await Permission.findOne({
      workspaceId: testWorkspaceId,
      userEmail: testUser.email,
      dossierId: null,
    });
    assert.strictEqual(found.workspaceId.toString(), testWorkspaceId);
    assert.strictEqual(found.dossierId, null);
    assert.strictEqual(found.userEmail, testUser.email);
    assert.strictEqual(found.role.toString(), testRole._id.toString());
  });
  it("Permet de supprimer une permission", async () => {
    const { testUser, testRole } = await initComponents();

    const { createPermission, removePermission } = await permissions();
    const testWorkspaceId = mongoose.Types.ObjectId().toString();
    const testDossierId = mongoose.Types.ObjectId().toString();

    const created = await createPermission({
      workspaceId: testWorkspaceId,
      dossierId: testDossierId,
      userEmail: testUser.email,
      role: testRole.name,
    });

    assert.strictEqual(created.workspaceId.toString(), testWorkspaceId);
    assert.strictEqual(created.dossierId.toString(), testDossierId);
    assert.strictEqual(created.userEmail, testUser.email);
    assert.strictEqual(created.role.toString(), testRole._id.toString());

    await removePermission(created._id);

    const found = await Permission.findOne({
      workspaceId: testWorkspaceId,
      userEmail: testUser.email,
      dossierId: testDossierId,
    });

    assert.equal(found, null);
  });
});
