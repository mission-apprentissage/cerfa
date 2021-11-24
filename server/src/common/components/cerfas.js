const { Cerfa } = require("../model/index");
const Joi = require("joi");
const Boom = require("boom");

module.exports = async () => {
  return {
    createCerfa: async (data, user) => {
      let { dossierId } = await Joi.object({
        dossierId: Joi.string().required(),
      }).validateAsync(data, { abortEarly: false });

      let result = null;
      try {
        result = await Cerfa.create({
          draft: true,
          dossierId,
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
    publishCerfa: async (id) => {
      const found = await Cerfa.findById(id).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      // eslint-disable-next-line no-unused-vars
      const { _id, __v, dossierId, ...cerfa } = found;
      const validate = await Cerfa.create({ ...cerfa, dossierId: "619baec6fcdd030ba4e13c41", draft: false });
      await validate.delete();

      return await Cerfa.findOneAndUpdate({ _id: id }, { draft: false }, { new: true });
    },
    unpublishCerfa: async (id) => {
      const found = await Cerfa.findById(id).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      return await Cerfa.findOneAndUpdate({ _id: id }, { draft: true }, { new: true });
    },
    updateDossierId: async (_id, dossierId) => {
      let cerfa = await Cerfa.findById(_id);
      if (!cerfa) {
        throw new Error(`Unable to find cerfa ${_id}`);
      }

      if (!cerfa.draft) {
        throw new Error(`Cerfa ${_id} is not in draft mode`);
      }

      return await Cerfa.findOneAndUpdate({ _id }, { dossierId }, { new: true });
    },
    removeCerfa: async (_id) => {
      return await Cerfa.deleteOne({ _id });
    },
  };
};
