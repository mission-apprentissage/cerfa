const Joi = require("joi");
const tryCatchSocket = require("../middlewares/tryCatchWebsocketMiddleware");
const permissionsDossierMiddleware = require("../middlewares/permissionsDossierMiddleware");

module.exports = ({ socket, components }) => {
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

  socket.on(
    "dossier:whereIs",
    tryCatchSocket(async (payload) => {
      // eslint-disable-next-line no-unused-vars
      let { dossierId } = await Joi.object({
        dossierId: Joi.string().required(),
      })
        .unknown()
        .validateAsync(payload, { abortEarly: false });

      // TODO Get users etc..

      return [
        {
          context: "formation.rncp",
          user: {
            email: "user@domain.com",
            nom: "user",
            prenom: "domain",
          },
        },
      ];
    }, socket)
  );
};
