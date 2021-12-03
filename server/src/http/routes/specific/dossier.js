const express = require("express");
const Joi = require("joi");
const Boom = require("boom");
const { Dossier } = require("../../../common/model/index");
const tryCatch = require("../../middlewares/tryCatchMiddleware");

module.exports = ({ cerfas, dossiers }) => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    let { query } = await Joi.object({
      query: Joi.string().default("{}"),
    }).validateAsync(req.query, { abortEarly: false });

    let json = JSON.parse(query);
    const results = await Dossier.find(json);

    // TODO HAS RIGHTS

    return res.json(results);
  });

  router.get(
    "/:id",
    tryCatch(async ({ params }, res) => {
      const dossier = await Dossier.findById(params.id);
      if (!dossier) {
        throw Boom.notFound("Doesn't exist");
      }

      // TODO HAS RIGHTS

      res.json(dossier);
    })
  );

  router.post(
    "/",
    tryCatch(async ({ body, user }, res) => {
      let { workspaceId } = await Joi.object({
        workspaceId: Joi.string().required(),
      }).validateAsync(body, { abortEarly: false });

      const result = await dossiers.createDossier({ workspaceId }, user);
      await cerfas.createCerfa({ dossierId: result._id });

      return res.json(result);
    })
  );

  router.put(
    "/:id",
    tryCatch(async ({ body, params }, res) => {
      const data = await Joi.object({
        documents: Joi.array().items({
          typeDocument: Joi.string(),
          typeFichier: Joi.string(),
          nomFichier: Joi.string(),
          cheminFichier: Joi.string(),
        }),
        numeroExterne: Joi.string(),
        numeroInterne: Joi.string(),
        numeroDeca: Joi.string(),
        etat: Joi.string(),
        saved: Joi.string(),
      }).validateAsync(body, { abortEarly: false });

      // TODO HAS RIGHTS

      const result = await Dossier.findOneAndUpdate({ _id: params.id }, data, {
        new: true,
      });

      return res.json(result);
    })
  );

  router.put(
    "/:id/publish",
    tryCatch(async ({ params }, res) => {
      // TODO HAS RIGHTS
      await dossiers.publishDossier(params.id);

      return res.json({ publish: true });
    })
  );

  router.put(
    "/:id/unpublish",
    tryCatch(async ({ params }, res) => {
      // TODO HAS RIGHTS
      await dossiers.unpublishDossier(params.id);

      return res.json({ publish: false });
    })
  );

  router.delete(
    "/:id",
    tryCatch(async ({ params }, res) => {
      // TODO HAS RIGHTS
      const result = await dossiers.removeDossier(params.id);
      return res.json(result);
    })
  );

  return router;
};
