const { User, Role } = require("../model/index");
const sha512Utils = require("../utils/sha512Utils");
const { pick, uniq, random } = require("lodash");
const workspaces = require("./workspaces");

const rehashPassword = (user, password) => {
  user.password = sha512Utils.hash(password);
  return user.save();
};

module.exports = async () => {
  return {
    authenticate: async (email, password) => {
      const user = await User.findOne({ email });

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
    getUser: async (email) => await User.findOne({ email }).lean(),
    getUserById: async (id, select = {}) => await User.findById(id, select).lean(),
    getUserByUsername: async (username, select = {}) => await User.findOne({ username }, select).lean(),
    getUsers: async (filters = {}) => await User.find(filters, { password: 0, __v: 0 }).lean(),
    getUsersByEmails: async (emails, select = {}) => await User.find({ email: { $in: emails } }, select).lean(),
    createUser: async (userEmail, password, options = {}) => {
      const hash = options.hash || sha512Utils.hash(password);
      const permissions = options.permissions || {};

      let rolesDb = [];
      if (options.roles && options.roles.length > 0) {
        rolesDb = await Role.find({ name: { $in: options.roles } }, { _id: 1 });
        if (!rolesDb.length === 0) {
          throw new Error("Roles doesn't exist");
        }
      }

      let username = options.prenom[0] + options.nom;

      const exist = await User.findOne({ username });
      if (exist) {
        username += random(1, 1000);
      }

      const user = await User.create({
        username,
        password: hash,
        isAdmin: !!permissions.isAdmin,
        email: userEmail,
        nom: options.nom,
        prenom: options.prenom,
        telephone: options.telephone || null,
        roles: rolesDb,
        acl: options.acl || [],
        siret: options.siret || null,
        civility: options.civility || null,
        confirmed: options.confirmed || false,
        account_status: options.account_status || "FORCE_RESET_PASSWORD",
        orign_register: options.orign_register || "ORIGIN",
      });

      const { createWorkspace } = await workspaces();
      await createWorkspace({
        email: userEmail,
        nom: `Espace - ${options.prenom} ${options.nom}`,
        description: `L'espace de travail de ${options.prenom} ${options.nom}`,
      });

      return user;
    },
    removeUser: async (userid) => {
      const user = await User.findOne({ _id: userid });
      if (!user) {
        throw new Error(`Unable to find user ${userid}`);
      }

      const { removeUserWorkspace } = await workspaces();
      await removeUserWorkspace(userid);

      return await User.deleteOne({ _id: userid });
    },
    updateUser: async (userid, data) => {
      let user = await User.findById(userid);
      if (!user) {
        throw new Error(`Unable to find user ${userid}`);
      }

      const result = await User.findOneAndUpdate({ _id: user._id }, data, { new: true });

      return result.toObject();
    },
    finalizePdsUser: async (userid, data) => {
      let user = await User.findById(userid);
      if (!user) {
        throw new Error(`Unable to find user ${userid}`);
      }

      if (user.orign_register !== "PDS") {
        throw new Error(`User has not been registered through PDS`);
      }

      let rolesDb = [];
      if (data.roles && data.roles.length > 0) {
        rolesDb = await Role.find({ name: { $in: data.roles } }, { _id: 1 });
        if (!rolesDb.length === 0) {
          throw new Error("Roles doesn't exist");
        }
      }

      const result = await User.findOneAndUpdate(
        { _id: user._id },
        {
          siret: data.siret,
          roles: rolesDb,
          account_status: "CONFIRMED",
        },
        { new: true }
      );

      return result.toObject();
    },
    activate: async (email) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error(`Unable to find user ${email}`);
      }

      user.confirmed = true;
      await user.save();

      return user.toObject();
    },
    changePassword: async (email, newPassword) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error(`Unable to find user ${email}`);
      }

      if (user.account_status === "FORCE_RESET_PASSWORD") {
        user.account_status = "CONFIRMED";
        user.confirmed = true;
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
        sub: user.email.toLowerCase(),
        email: user.email.toLowerCase(),
        username: user.username,
        nom: user.nom,
        prenom: user.prenom,
        civility: user.civility,
        account_status: user.account_status,
        roles: rolesList,
        acl: uniq([...rolesAcl, ...user.acl]),
        workspaceId: workspace?._id.toString(),
        siret: user.siret || null,
        confirmed: user.confirmed || false,
        orign_register: user.orign_register,
        telephone: user.telephone,
        cgu: user.has_accept_cgu,
        beta: user.beta_test,
      };
      return structure;
    },
    loggedInUser: (email) =>
      User.findOneAndUpdate({ email }, { last_connection: new Date(), $push: { connection_history: new Date() } }),
  };
};
