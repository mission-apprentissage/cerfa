const { Workspace, Dossier, Cerfa, User } = require("../model/index");
const Boom = require("boom");
const moment = require("moment");
moment.locale("fr-FR");

module.exports = async () => {
  return {
    createDossier: async (user) => {
      const userDb = await User.findOne({ username: user.sub });
      if (!userDb) {
        throw new Error("User doesn't exist");
      }

      const wks = await Workspace.findOne({ owner: userDb._id });
      if (!wks) {
        throw new Error("Something went wrong");
      }

      let result = null;
      try {
        result = await Dossier.create({
          nom: `Dossier ${moment(new Date()).add(1, "hour").format("DD MMM YYYY à HH:mm")}`,
          draft: true,
          workspaceId: wks._id,
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
    findDossiers: async (query, select = {}) => await Dossier.find(query, select).lean(),
    saveDossier: async (id) => {
      const found = await Dossier.findById(id).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      return await Dossier.findOneAndUpdate(
        { _id: id },
        {
          saved: true,
          lastModified: Date.now(),
        },
        { new: true }
      );
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
