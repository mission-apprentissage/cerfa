const { Workspace, User } = require("../model/index");
const Joi = require("joi");

module.exports = async () => {
  return {
    createWorkspace: async (data) => {
      let { username, nom, description, siren, contributeurs } = await Joi.object({
        nom: Joi.string().allow(null),
        description: Joi.string().allow(null),
        siren: Joi.string().allow(null),
        username: Joi.string().required(),
        contributeurs: Joi.array().items(Joi.string().required()).default([]),
      }).validateAsync(data, { abortEarly: false });

      const userDb = await User.findOne({ username });
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
      return result;
    },
    // TODO Permission
    // addContributeur: async (data) => {
    //   let { workspaceId, username } = await Joi.object({
    //     username: Joi.string().required(),
    //     workspaceId: Joi.string().required(),
    //   }).validateAsync(data, { abortEarly: false });

    //   const userDb = await User.findOne({ username });
    //   if (!userDb) {
    //     throw new Error("User doesn't exist");
    //   }
    //   //workspaceId
    // },
  };
};
