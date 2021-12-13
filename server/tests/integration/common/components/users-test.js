const assert = require("assert");
const { User } = require("../../../../src/common/model");
const { initComponents } = require("../../../utils/testUtils");

describe("users component", () => {
  it("Permet de créer un utilisateur", async () => {
    const { testUser: created } = await initComponents();

    assert.strictEqual(created.email, "h@ck.me");
    assert.strictEqual(created.isAdmin, false);
    assert.strictEqual(created.password.startsWith("$6$rounds=1001"), true);

    const found = await User.findOne({ email: "h@ck.me" });
    assert.strictEqual(found.email, "h@ck.me");
    assert.strictEqual(found.isAdmin, false);
    assert.strictEqual(found.password.startsWith("$6$rounds=1001"), true);
  });

  it("Permet de créer un utilisateur avec les droits d'admin", async () => {
    const { testUser: user } = await initComponents({
      userOpt: {
        email: "h@ck.me",
        password: "password",
        options: {
          email: "h@ck.me",
          nom: "hack",
          prenom: "me",
          telephone: "+33102030405",
          permissions: { isAdmin: true },
        },
      },
    });

    const found = await User.findOne({ email: "h@ck.me" });

    assert.strictEqual(user.isAdmin, true);
    assert.strictEqual(found.isAdmin, true);
  });

  it("Permet de supprimer un utilisateur", async () => {
    const { components, testUser } = await initComponents({
      userOpt: {
        email: "h@ck.me",
        password: "password",
        options: {
          email: "h@ck.me",
          nom: "hack",
          prenom: "me",
          telephone: "+33102030405",
          permissions: { isAdmin: true },
        },
      },
    });

    await components.users.removeUser(testUser._id);

    const found = await User.findOne({ email: "h@ck.me" });
    assert.strictEqual(found, null);
  });

  it("Vérifie que le mot de passe est valide", async () => {
    const { components } = await initComponents({
      userOpt: {
        email: "h@ck.me",
        password: "password",
        options: { email: "h@ck.me", nom: "hack", prenom: "me", telephone: "+33102030405" },
      },
    });
    const user = await components.users.authenticate("h@ck.me", "password");

    assert.strictEqual(user.email, "h@ck.me");
  });

  it("Vérifie que le mot de passe est invalide", async () => {
    const { components } = await initComponents({
      userOpt: {
        email: "h@ck.me",
        password: "password",
        options: { email: "h@ck.me", nom: "hack", prenom: "me", telephone: "+33102030405" },
      },
    });
    const user = await components.users.authenticate("h@ck.me", "INVALID");

    assert.strictEqual(user, null);
  });

  it("Vérifie qu'on peut changer le mot de passe d'un utilisateur", async () => {
    const { components } = await initComponents({
      userOpt: {
        email: "h@ck.me",
        password: "password",
        options: { email: "h@ck.me", nom: "hack", prenom: "me", telephone: "+33102030405" },
      },
    });

    await components.users.changePassword("h@ck.me", "newPassword");
    const user = await components.users.authenticate("h@ck.me", "newPassword");

    assert.strictEqual(user.email, "h@ck.me");
  });
});
