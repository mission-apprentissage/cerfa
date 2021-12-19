const { ConnectionDossier } = require("../model/index");
const Joi = require("joi");

module.exports = async () => {
  return {
    connection: async (data) => {
      let { connectionId, userEmail, dossierId } = await Joi.object({
        connectionId: Joi.string().required(),
        userEmail: Joi.string().required(),
        dossierId: Joi.string().required(),
      }).validateAsync(data, { abortEarly: false });

      let result = null;
      try {
        const conn = {
          _id: connectionId,
          email: userEmail,
          dossierId: dossierId,
        };

        result = await ConnectionDossier.findOneAndUpdate({ _id: conn._id }, conn, {
          upsert: true,
          new: true,
        });
      } catch (error) {
        throw new Error(error);
      }

      return result;
    },
    cleanup: async (data) => {
      let { userEmail, dossierId } = await Joi.object({
        userEmail: Joi.string().required(),
        dossierId: Joi.string().required(),
      }).validateAsync(data, { abortEarly: false });

      try {
        await ConnectionDossier.deleteMany({
          email: userEmail,
          dossierId,
        });
      } catch (error) {
        throw new Error(error);
      }

      return null;
    },
    disconnect: async (data) => {
      let { connectionId } = await Joi.object({
        connectionId: Joi.string().required(),
      }).validateAsync(data, { abortEarly: false });

      let result = null;
      try {
        result = await ConnectionDossier.findOneAndDelete({
          _id: connectionId,
        });
      } catch (error) {
        throw new Error(error);
      }

      return result;
    },
    getConnected: async (dossierId, select = {}) => await ConnectionDossier.find({ dossierId }, select).lean(),
    broadcastToConnections: async (namespace, data) => {
      let { dossierId, event } = await Joi.object({
        dossierId: Joi.string().required(),
        event: Joi.object({
          name: Joi.string().required(),
          payload: Joi.required(),
        }),
      }).validateAsync(data, { abortEarly: false });

      const connections = await ConnectionDossier.find({ dossierId });
      await Promise.allSettled(connections.map(async (c) => namespace.to(c._id).emit(event.name, event.payload)));
    },
    broadcastToRoom: async (namespace, data) => {
      let { dossierId, event } = await Joi.object({
        dossierId: Joi.string().required(),
        event: Joi.object({
          name: Joi.string().required(),
          payload: Joi.required(),
        }),
      }).validateAsync(data, { abortEarly: false });

      namespace.to(`dossier:room:${dossierId}`).emit(event.name, event.payload);
    },
  };
};
