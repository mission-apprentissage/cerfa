const { Permission, Role } = require("../model/index");
const Joi = require("joi");
const Boom = require("boom");

module.exports = async () => {
  return {
    createPermission: async (data) => {
      let { workspaceId, dossierId, userEmail, role } = await Joi.object({
        workspaceId: Joi.string().required(),
        dossierId: Joi.string().allow(null),
        userEmail: Joi.string().required(),
        role: Joi.string().required(),
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
          userEmail,
          role: roleDb._id,
        });
      } catch (error) {
        throw new Error(error);
      }
      return result;
    },
    findPermissions: async ({ workspaceId, dossierId, userEmail }) =>
      await Permission.find({ workspaceId, dossierId, userEmail }),
    removePermission: async (_id) => {
      const found = await Permission.findById(_id).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      return await Permission.deleteOne({ _id });
    },
  };
};
