const express = require("express");
const Joi = require("joi");
const Boom = require("boom");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const permissionsDossierMiddleware = require("../../middlewares/permissionsDossierMiddleware");
const apiTco = require("../../../common/apis/ApiTco");

module.exports = (components) => {
  const router = express.Router();

  router.post(
    "/",
    permissionsDossierMiddleware(components, ["dossier/page_formulaire"]),
    tryCatch(async ({ body }, res) => {
      const { cfd, rncp } = await Joi.object({
        cfd: Joi.string().pattern(new RegExp("^[0-9A-Z]{8}[A-Z]?$")),
        rncp: Joi.string().pattern(new RegExp("^(RNCP)?[0-9]{2,5}$")),
      })
        .unknown()
        .validateAsync(body, { abortEarly: false });

      if (!cfd && !rncp) {
        return res.json({ error: "Cfd ou rncp doivent être défini et formaté" });
      }

      if (cfd) {
        const { data } = await apiTco.findCfd(cfd);
        if (data.messages.error) {
          throw Boom.notFound(data.messages.error);
        }
        return res.json(data);
      } else if (rncp) {
        const { data } = await apiTco.findRncp(rncp);
        if (data.messages.error) {
          throw Boom.notFound(data.messages.error);
        }
        return res.json(data);
      }

      return res.status(404).json({ message: "Something went wrong" });
    })
  );

  return router;
};
