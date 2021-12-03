const { Dossier, Cerfa, User } = require("../model/index");
const Joi = require("joi");
const Boom = require("boom");

module.exports = async () => {
  return {
    createDossier: async (data, user) => {
      let { workspaceId } = await Joi.object({
        workspaceId: Joi.string().required(),
      }).validateAsync(data, { abortEarly: false });

      const userDb = await User.findOne({ username: user.sub });
      if (!userDb) {
        throw new Error("User doesn't exist");
      }

      // TODO Workspace Id

      let result = null;
      try {
        result = await Dossier.create({
          draft: true,
          workspaceId,
          owner: userDb._id,
        });
      } catch (error) {
        const { code, name, message } = error;
        if (name === "MongoError" && code === 11000 && message.includes("dossierId_1 dup key")) {
          throw Boom.conflict("Already exist");
        } else {
          throw new Error(error);
        }
      }
      return result;
    },
    publishDossier: async (id) => {
      const found = await Dossier.findById(id).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      return await Dossier.findOneAndUpdate({ _id: id }, { draft: false }, { new: true });
    },
    unpublishDossier: async (id) => {
      const found = await Dossier.findById(id).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      return await Dossier.findOneAndUpdate({ _id: id }, { draft: true }, { new: true });
    },
    removeDossier: async (_id) => {
      const found = await Dossier.findById(_id).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      await Cerfa.deleteOne({ dossierId: found._id });

      return await Dossier.deleteOne({ _id });
    },
  };
};
