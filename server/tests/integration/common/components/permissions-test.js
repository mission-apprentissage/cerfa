const assert = require("assert");
const permissions = require("../../../../src/common/components/permissions");
const users = require("../../../../src/common/components/users");
const { Permission } = require("../../../../src/common/model");
const { mongoose } = require("../../../../src/common/mongodb");

describe("Permission component", () => {
  it("Permet de créer une permission", async () => {
    const { createUser } = await users();
    const testUser = await createUser("user", "password", { email: "h@ck.me" });

    const { createPermission } = await permissions();
    const testWorkspaceId = mongoose.Types.ObjectId().toString();
    const testRoleId = mongoose.Types.ObjectId().toString();

    const created = await createPermission({
      workspaceId: testWorkspaceId,
      dossierId: null,
      userEmail: testUser.email,
      role: testRoleId,
    });

    assert.strictEqual(created.workspaceId.toString(), testWorkspaceId);
    assert.strictEqual(created.dossierId, null);
    assert.strictEqual(created.userEmail, testUser.email);
    assert.strictEqual(created.role.toString(), testRoleId);

    const found = await Permission.findOne({
      workspaceId: testWorkspaceId,
      userEmail: testUser.email,
      dossierId: null,
    });
    assert.strictEqual(found.workspaceId.toString(), testWorkspaceId);
    assert.strictEqual(found.dossierId, null);
    assert.strictEqual(found.userEmail, testUser.email);
    assert.strictEqual(found.role.toString(), testRoleId);
  });
  it("Permet de supprimer une permission", async () => {
    const { createUser } = await users();
    const testUser = await createUser("user", "password", { email: "h@ck.me" });

    const { createPermission, removePermission } = await permissions();
    const testWorkspaceId = mongoose.Types.ObjectId().toString();
    const testDossierId = mongoose.Types.ObjectId().toString();
    const testRoleId = mongoose.Types.ObjectId().toString();

    const created = await createPermission({
      workspaceId: testWorkspaceId,
      dossierId: testDossierId,
      userEmail: testUser.email,
      role: testRoleId,
    });

    assert.strictEqual(created.workspaceId.toString(), testWorkspaceId);
    assert.strictEqual(created.dossierId.toString(), testDossierId);
    assert.strictEqual(created.userEmail, testUser.email);
    assert.strictEqual(created.role.toString(), testRoleId);

    await removePermission(created._id);

    const found = await Permission.findOne({
      workspaceId: testWorkspaceId,
      userEmail: testUser.email,
      dossierId: testDossierId,
    });

    assert.equal(found, null);
  });
});
