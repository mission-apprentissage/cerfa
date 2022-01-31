const Joi = require("joi");
const tryCatchSocket = require("../../middlewares/tryCatchWebsocketMiddleware");
const permissionsDossierMiddleware = require("../../middlewares/permissionsDossierMiddleware");

module.exports = async ({ namespace, socket, components }) => {
  const { connectionsDossiers, users } = components;

  const sendLatestConnectedUsers = async (dossierId) => {
    const connectedUsers = await connectionsDossiers.getConnected(dossierId, { email: 1 });

    const liveUsers = (
      await users.getUsersByEmails(
        connectedUsers.map((cu) => cu.email),
        { nom: 1, prenom: 1, email: 1 }
      )
    )
      // eslint-disable-next-line no-unused-vars
      .map(({ _id, ...lu }) => lu); // TODO where user is (eg:context)

    await connectionsDossiers.broadcastToConnections(namespace, {
      dossierId,
      event: {
        name: "dossier:live_users",
        payload: liveUsers,
      },
    });
  };

  socket.use(([, ...[query]], next) =>
    permissionsDossierMiddleware(components, ["dossier"])(
      {
        method: "GET",
        query,
        user: socket.request.user,
      },
      {},
      next
    )
  );

  socket.on("disconnecting", async (reason) => {
    console.log(reason);
    const deletedConnection = await connectionsDossiers.disconnect({
      connectionId: socket.id,
    });
    if (deletedConnection) {
      const { dossierId } = deletedConnection;
      await sendLatestConnectedUsers(dossierId.toString());
    }
  });

  socket.on("disconnect", async (reason) => {
    console.log(reason);
  });

  socket.on(
    "dossier:connect",
    tryCatchSocket(async (payload) => {
      let { dossierId } = await Joi.object({
        dossierId: Joi.string().required(),
      })
        .unknown()
        .validateAsync(payload, { abortEarly: false });

      await connectionsDossiers.cleanup({ userEmail: socket.request.user.email, dossierId });

      await connectionsDossiers.connection({
        connectionId: socket.id,
        userEmail: socket.request.user.email,
        dossierId,
      });

      socket.join(`dossier:room:${dossierId}`);

      await sendLatestConnectedUsers(dossierId);

      return true;
    }, socket)
  );
};
