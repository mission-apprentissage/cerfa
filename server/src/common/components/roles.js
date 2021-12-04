const { Role } = require("../model/index");
const Joi = require("joi");

module.exports = async () => {
  return {
    createRole: async (data) => {
      let { name, acl } = await Joi.object({
        name: Joi.string().required(),
        acl: Joi.array().items(Joi.string()).default([]),
      }).validateAsync(data, { abortEarly: false });

      let result = null;
      try {
        result = await await Role.create({
          name,
          acl,
        });
      } catch (error) {
        throw new Error(error);
      }

      return result;
    },
  };
};
