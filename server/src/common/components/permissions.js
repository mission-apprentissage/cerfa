const { Permission } = require("../model/index");
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

      let result = null;
      try {
        result = await Permission.create({
          workspaceId,
          dossierId,
          userEmail,
          role,
        });
      } catch (error) {
        throw new Error(error);
      }
      return result;
    },
    removePermission: async (_id) => {
      const found = await Permission.findById(_id).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      return await Permission.deleteOne({ _id });
    },
  };
};
