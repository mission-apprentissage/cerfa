const { Dossier, Cerfa } = require("../model/index");
const Joi = require("joi");
const Boom = require("boom");

module.exports = async () => {
  return {
    createDossier: async (data, user) => {
      let { cerfaId } = await Joi.object({
        cerfaId: Joi.string().required(),
      }).validateAsync(data, { abortEarly: false });

      let result = null;
      try {
        result = await Dossier.create({
          draft: true,
          cerfaId,
          createdBy: user.sub,
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

      await Cerfa.deleteOne({ _id: found.cerfaId });

      return await Dossier.deleteOne({ _id });
    },
  };
};
