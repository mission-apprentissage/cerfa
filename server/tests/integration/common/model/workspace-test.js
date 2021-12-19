const assert = require("assert");
const { Workspace } = require("../../../../src/common/model");
const { mongoose } = require("../../../../src/common/mongodb");

describe("Workspace", () => {
  it("Doit créer un workspace", async () => {
    await Workspace.create({
      owner: mongoose.Types.ObjectId(),
    });

    const results = await Workspace.find({});

    assert.equal(results.length === 1, true);
  });
});
