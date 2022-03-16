const { Permission, Role } = require("../model/index");
const Joi = require("joi");

module.exports = async () => {
  return {
    createPermission: async (data) => {
      let { workspaceId, dossierId, userEmail, role, acl } = await Joi.object({
        workspaceId: Joi.string().required(),
        dossierId: Joi.string().allow(null),
        userEmail: Joi.string().required(),
        role: Joi.string().required(),
        acl: Joi.array().items(Joi.string()).default([]),
      }).validateAsync(data, { abortEarly: false });

      const roleDb = await Role.findOne({ name: role });
      if (!roleDb) {
        throw new Error("Role doesn't exist");
      }

      let result = null;
      try {
        result = await Permission.create({
          workspaceId,
          dossierId,
          userEmail: userEmail.toLowerCase(),
          role: roleDb._id,
          acl,
        });
      } catch (error) {
        throw new Error(error);
      }
      return result;
    },
    findPermissions: async (query, select = {}) => await Permission.find(query, select).lean(),
    hasPermission: async ({ workspaceId, dossierId, userEmail }, select = {}) =>
      await Permission.findOne({ workspaceId, dossierId, userEmail }, select).lean(),
    updatePermission: async ({ workspaceId, dossierId, userEmail, roleId, acl = [] }) => {
      const found = await Permission.findOne({ workspaceId, dossierId, userEmail });

      if (!found) {
        throw new Error("Role doesn't exist");
      }

      found.role = roleId;
      found.acl = acl;

      return await found.save();
    },
    removePermission: async (_id) => {
      const found = await Permission.findById(_id).lean();

      if (!found) {
        throw new Error("Role doesn't exist");
      }

      return await Permission.deleteOne({ _id });
    },
  };
};
