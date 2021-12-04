const assert = require("assert");
const { Role } = require("../../../../src/common/model");
const { initComponents } = require("../../../utils/testUtils");

describe("Roles component", () => {
  it("Permet de créer un role", async () => {
    const { testRole } = await initComponents();

    const found = await Role.findOne({
      name: "wks.admin",
    });

    assert.strictEqual(found.name, "wks.admin");
    assert.strictEqual(found._id.toString(), testRole._id.toString());
  });
});
