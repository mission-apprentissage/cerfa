const Joi = require("joi");
const tryCatch = require("./tryCatchMiddleware");

module.exports = () =>
  tryCatch(async ({ method, body, query }, res, next) => {
    const data = method === "GET" ? query : body;

    let { workspaceId } = await Joi.object({
      workspaceId: Joi.string().required(),
    })
      .unknown()
      .validateAsync(data, { abortEarly: false });

    // TODO STUFF PERMISSION
    console.log(workspaceId);

    next();
  });
