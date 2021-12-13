const assert = require("assert");
const { User } = require("../../../../src/common/model");
const { initComponents } = require("../../../utils/testUtils");

describe("users component", () => {
  it("Permet de créer un utilisateur", async () => {
    const { testUser: created } = await initComponents();

    assert.strictEqual(created.username, "user");
    assert.strictEqual(created.isAdmin, false);
    assert.strictEqual(created.password.startsWith("$6$rounds=1001"), true);

    const found = await User.findOne({ username: "user" });
    assert.strictEqual(found.username, "user");
    assert.strictEqual(found.isAdmin, false);
    assert.strictEqual(found.password.startsWith("$6$rounds=1001"), true);
  });

  it("Permet de créer un utilisateur avec les droits d'admin", async () => {
    const { testUser: user } = await initComponents({
      userOpt: {
        username: "userAdmin",
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

    const found = await User.findOne({ username: "userAdmin" });

    assert.strictEqual(user.isAdmin, true);
    assert.strictEqual(found.isAdmin, true);
  });

  it("Permet de supprimer un utilisateur", async () => {
    const { components } = await initComponents({
      userOpt: {
        username: "userToDelete",
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

    await components.users.removeUser("userToDelete");

    const found = await User.findOne({ username: "userToDelete" });
    assert.strictEqual(found, null);
  });

  it("Vérifie que le mot de passe est valide", async () => {
    const { components } = await initComponents({
      userOpt: {
        username: "user",
        password: "password",
        options: { email: "h@ck.me", nom: "hack", prenom: "me", telephone: "+33102030405" },
      },
    });
    const user = await components.users.authenticate("user", "password");

    assert.strictEqual(user.username, "user");
  });

  it("Vérifie que le mot de passe est invalide", async () => {
    const { components } = await initComponents({
      userOpt: {
        username: "user",
        password: "password",
        options: { email: "h@ck.me", nom: "hack", prenom: "me", telephone: "+33102030405" },
      },
    });
    const user = await components.users.authenticate("user", "INVALID");

    assert.strictEqual(user, null);
  });

  it("Vérifie qu'on peut changer le mot de passe d'un utilisateur", async () => {
    const { components } = await initComponents({
      userOpt: {
        username: "user",
        password: "password",
        options: { email: "h@ck.me", nom: "hack", prenom: "me", telephone: "+33102030405" },
      },
    });

    await components.users.changePassword("user", "newPassword");
    const user = await components.users.authenticate("user", "newPassword");

    assert.strictEqual(user.username, "user");
  });
});
