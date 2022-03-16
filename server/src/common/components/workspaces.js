const { Workspace, User } = require("../model/index");
const Boom = require("boom");
const Joi = require("joi");
const permissions = require("./permissions");

module.exports = async () => {
  const buildContributorsResult = async (contributeurEmail, workspaceId, { users, permissions, roles }) => {
    // components avoid circular dependencies

    const userSelectFields = { email: 1, nom: 1, prenom: 1, _id: 0 };
    const permSelectFields = { addedAt: 1, role: 1, acl: 1 };
    const roleSelectFields = { name: 1, description: 1, title: 1, _id: 1 };

    const currentUser = (await users.getUser(contributeurEmail, userSelectFields)) || {
      email: contributeurEmail,
      nom: "",
      prenom: "",
    };

    const currentUserPerm = await permissions.hasPermission(
      { workspaceId, dossierId: null, userEmail: contributeurEmail },
      permSelectFields
    );
    if (!currentUserPerm) {
      throw Boom.badRequest("Something went wrong");
    }
    const currentUserRole = await roles.findRolePermissionById(currentUserPerm.role, roleSelectFields);
    if (!currentUserRole) {
      throw Boom.badRequest("Something went wrong");
    }
    return {
      user: currentUser,
      permission: {
        permId: currentUserPerm._id,
        addedAt: currentUserPerm.addedAt,
        customAcl: currentUserPerm.acl,
        ...currentUserRole,
      },
    };
  };

  return {
    createWorkspace: async (data) => {
      let { email, nom, description, siren, contributeurs } = await Joi.object({
        nom: Joi.string().allow(null),
        description: Joi.string().allow(null),
        siren: Joi.string().allow(null),
        email: Joi.string().required(),
        contributeurs: Joi.array().items(Joi.string().required()).default([]),
      }).validateAsync(data, { abortEarly: false });

      const userDb = await User.findOne({ email });
      if (!userDb) {
        throw new Error("User doesn't exist");
      }

      let result = null;
      try {
        result = await await Workspace.create({
          owner: userDb._id,
          nom,
          description,
          siren,
          contributeurs,
        });
      } catch (error) {
        throw new Error(error);
      }

      const { createPermission } = await permissions();
      await createPermission({
        workspaceId: result._id.toString(),
        dossierId: null,
        userEmail: userDb.email,
        role: "wks.admin",
      });

      return result;
    },
    getUserWorkspace: async (user, select = {}) => await Workspace.findOne({ owner: user._id }, select),
    findWorkspaceById: async (id, select = {}) => await Workspace.findById(id, select).lean(),
    updateWorkspaceInfo: async (workspaceId, nom) => {
      const wksDb = await Workspace.findById(workspaceId);
      if (!wksDb) {
        throw new Error("wks doesn't exist");
      }

      return await Workspace.findOneAndUpdate(
        { _id: wksDb._id },
        {
          nom,
        },
        { new: true }
      );
    },
    addContributeur: async (workspaceId, userEmail, as, acl = []) => {
      const wksDb = await Workspace.findById(workspaceId);
      if (!wksDb) {
        throw new Error("wks doesn't exist");
      }

      const { createPermission } = await permissions();
      await createPermission({
        workspaceId: wksDb._id.toString(),
        dossierId: null,
        userEmail: userEmail.toLowerCase(),
        role: as,
        acl,
      });

      wksDb.contributeurs = [...wksDb.contributeurs, userEmail.toLowerCase()];
      await wksDb.save();
      return wksDb.contributeurs;
    },
    getContributeurs: async (workspaceId, components) => {
      // components avoid circular dependencies

      const wks = await Workspace.findById(workspaceId, { contributeurs: 1, owner: 1 }).lean();
      if (!wks) {
        throw Boom.notFound("Doesn't exist");
      }

      const ownerUser = await components.users.getUserById(wks.owner, { email: 1 });
      if (!ownerUser) {
        throw Boom.badRequest("Something went wrong");
      }
      const owner = await buildContributorsResult(ownerUser.email, workspaceId, components);
      const contributeurs = [];
      for (let index = 0; index < wks.contributeurs.length; index++) {
        const contributeurEmail = wks.contributeurs[index];
        const contributeur = await buildContributorsResult(contributeurEmail, workspaceId, components);
        contributeurs.push(contributeur);
      }
      return [{ ...owner, owner: true }, ...contributeurs];
    },
    removeContributeur: async (workspaceId, userEmail, permId) => {
      const wksDb = await Workspace.findById(workspaceId);
      if (!wksDb) {
        throw new Error("wks doesn't exist");
      }

      const { removePermission } = await permissions();
      await removePermission(permId);

      wksDb.contributeurs = wksDb.contributeurs.filter((contributeur) => contributeur !== userEmail.toLowerCase());

      await wksDb.save();
      return wksDb.contributeurs;
    },
    removeUserWorkspace: async (userid) => {
      const wksDb = await Workspace.findOne({ owner: userid });
      if (!wksDb) {
        throw new Error("wks doesn't exist");
      }

      // TODO Remove dossier where use is Owner

      const { findPermissions, removePermission } = await permissions();
      const perms = await findPermissions({ workspaceId: wksDb._id });
      for (let index = 0; index < perms.length; index++) {
        const perm = perms[index];
        await removePermission(perm._id);
      }

      return await Workspace.deleteOne({ _id: wksDb._id });
    },
  };
};
