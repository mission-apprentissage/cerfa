const express = require("express");
const Joi = require("joi");
// const Boom = require("boom");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const permissionsDossierMiddleware = require("../../middlewares/permissionsDossierMiddleware");

const { getDataFromCP } = require("../../../logic/handlers/geoHandler");

module.exports = (components) => {
  const router = express.Router();

  router.post(
    "/cp",
    permissionsDossierMiddleware(components, ["dossier/page_formulaire"]),
    tryCatch(async ({ body }, res) => {
      const { codePostal } = await Joi.object({
        codePostal: Joi.string().pattern(new RegExp("^[0-9]{5}$")),
      })
        .unknown()
        .validateAsync(body, { abortEarly: false });

      const result = await getDataFromCP(codePostal);

      // const { data } = await apiTco.findCfd(cfd);
      // if (data.messages.error) {
      //   throw Boom.notFound(data.messages.error);
      // }
      return res.json(result);

      // return res.status(404).json({ message: "Something went wrong" });
    })
  );

  return router;
};
