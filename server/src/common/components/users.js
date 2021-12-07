const { User, Role } = require("../model/index");
const sha512Utils = require("../utils/sha512Utils");
const { pick, uniq } = require("lodash");
const workspaces = require("./workspaces");

const rehashPassword = (user, password) => {
  user.password = sha512Utils.hash(password);
  return user.save();
};

module.exports = async () => {
  return {
    authenticate: async (username, password) => {
      const user = await User.findOne({ username });

      if (!user) {
        return null;
      }

      const current = user.password;
      if (sha512Utils.compare(password, current)) {
        if (sha512Utils.isTooWeak(current)) {
          await rehashPassword(user, password);
        }
        return user.toObject();
      }
      return null;
    },
    getUser: async (username) => await User.findOne({ username }),
    getUserByEmail: async (email) => await User.findOne({ email }),
    getUsers: async (filters = {}) => await User.find(filters, { password: 0, _id: 0, __v: 0 }).lean(),
    createUser: async (username, password, options = {}) => {
      const hash = options.hash || sha512Utils.hash(password);
      const permissions = options.permissions || {};

      let rolesDb = [];
      if (options.roles && options.roles.length > 0) {
        rolesDb = await Role.find({ name: { $in: options.roles } }, { _id: 1 });
        if (!rolesDb.length === 0) {
          throw new Error("Roles doesn't exist");
        }
      }

      const user = await User.create({
        username,
        password: hash,
        isAdmin: !!permissions.isAdmin,
        email: options.email || "",
        roles: rolesDb,
        acl: options.acl || [],
      });

      const { createWorkspace } = await workspaces();
      await createWorkspace({
        username,
        nom: "Votre espace",
        description: "Votre espace de travail",
      });

      return user;
    },
    removeUser: async (username) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error(`Unable to find user ${username}`);
      }

      return await user.deleteOne({ username });
    },
    updateUser: async (username, data) => {
      let user = await User.findOne({ username });
      if (!user) {
        throw new Error(`Unable to find user ${username}`);
      }

      const result = await User.findOneAndUpdate({ _id: user._id }, data, { new: true });

      return result.toObject();
    },
    changePassword: async (username, newPassword) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error(`Unable to find user ${username}`);
      }

      if (user.account_status === "FORCE_RESET_PASSWORD") {
        user.account_status = "CONFIRMED";
      }

      user.password = sha512Utils.hash(newPassword);
      await user.save();

      return user.toObject();
    },
    structureUser: async (user) => {
      const permissions = pick(user, ["isAdmin"]);

      const rolesList = await Role.find({ _id: { $in: user.roles } }).lean();
      const rolesAcl = rolesList.reduce((acc, { acl }) => [...acc, ...acl], []);

      const { getUserWorkspace } = await workspaces();
      const workspace = await getUserWorkspace(user);

      const structure = {
        permissions,
        sub: user.username,
        email: user.email,
        account_status: user.account_status,
        roles: permissions.isAdmin ? ["admin", ...rolesList] : rolesList,
        acl: uniq([...rolesAcl, ...user.acl]),
        workspaceId: workspace?._id.toString(),
      };
      return structure;
    },
    registerUser: (email) =>
      User.findOneAndUpdate({ email }, { last_connection: new Date(), $push: { connection_history: new Date() } }),
  };
};
