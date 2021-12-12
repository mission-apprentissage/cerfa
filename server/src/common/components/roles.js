const { Role } = require("../model/index");
const Joi = require("joi");

module.exports = async () => {
  return {
    createRole: async (data) => {
      let { name, acl, type } = await Joi.object({
        name: Joi.string().required(),
        type: Joi.string().required(),
        acl: Joi.array().items(Joi.string()).default([]),
      }).validateAsync(data, { abortEarly: false });

      let result = null;
      try {
        result = await await Role.create({
          name,
          type,
          acl,
        });
      } catch (error) {
        throw new Error(error);
      }

      return result;
    },
    findRolePermission: async (query, select = {}) => await Role.find({ ...query, type: "permission" }, select),
    findRolePermissionById: async (id, select = {}) =>
      await Role.findOne({ _id: id, type: "permission" }, select).lean(),
    findRolesByNames: async (names, select = {}) => await Role.find({ name: { $in: names } }, select).lean(),
    findRoleById: async (id, select = {}) => await Role.findById(id, select).lean(),
    hasAclsByRoleId: async (id, acl) => {
      const roleDb = await Role.findById(id).lean();
      if (!roleDb) {
        throw new Error("Role doesn't exist");
      }

      return acl.every((page) => roleDb.acl.includes(page));
    },
  };
};
