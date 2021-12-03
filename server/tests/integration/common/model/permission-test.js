const assert = require("assert");
const { Permission } = require("../../../../src/common/model");
const { mongoose } = require("../../../../src/common/mongodb");

describe("Permission", () => {
  it("Doit créer une permission", async () => {
    await Permission.create({
      workspaceId: mongoose.Types.ObjectId(),
      dossierId: mongoose.Types.ObjectId(),
      userEmail: "energie3000.pro+sss@gmail.com",
      role: mongoose.Types.ObjectId(),
    });

    const results = await Permission.find({});

    assert.equal(results.length === 1, true);
  });
  it("Doit créer une permission avec dossierId null", async () => {
    await Permission.create({
      workspaceId: mongoose.Types.ObjectId(),
      dossierId: null,
      userEmail: "energie3000.pro+sss@gmail.com",
      role: mongoose.Types.ObjectId(),
    });

    const results = await Permission.find({});

    assert.equal(results.length === 1, true);
  });
});
