const express = require("express");
const Joi = require("joi");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const permissionsDossierMiddleware = require("../../middlewares/permissionsDossierMiddleware");
const apiNaf = require("../../../common/apis/ApiNaf");

module.exports = (components) => {
  const router = express.Router();

  router.post(
    "/",
    permissionsDossierMiddleware(components, ["dossier/page_formulaire"]),
    tryCatch(async ({ body }, res) => {
      const { naf } = await Joi.object({
        naf: Joi.string().pattern(new RegExp("^.{1,6}$")),
      })
        .unknown()
        .validateAsync(body, { abortEarly: false });

      const resp = await apiNaf.getFromCode(naf);
      if (!resp) {
        res.json({ error: "Ce code naf n'existe pas" });
      }
      // eslint-disable-next-line no-unused-vars
      const { noteLiteral, ...result } = resp;
      return res.json(result);
    })
  );

  return router;
};
