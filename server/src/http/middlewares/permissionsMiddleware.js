const Joi = require("joi");
const tryCatch = require("./tryCatchMiddleware");

module.exports = () =>
  tryCatch(async ({ method, body, query, user }, res, next) => {
    const data = method === "GET" ? query : body;

    let { workspaceId } = await Joi.object({
      workspaceId: Joi.string().required(),
    })
      .unknown()
      .validateAsync(data, { abortEarly: false });

    // TODO Check perms
    if (workspaceId !== user.workspaceId) {
      return res.status(401).json({ message: "Accès non autorisé" });
    }

    next();
  });
