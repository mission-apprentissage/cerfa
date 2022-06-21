const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const Joi = require("joi");
const Boom = require("boom");
const { addContributor } = require("../../logic/controllers/addContributor");

module.exports = (components) => {
  const router = express.Router();

  const { dossiers, roles, permissions } = components;

  router.post(
    "/assistanceDossier",
    tryCatch(async ({ body, user }, res) => {
      let { dossierId } = await Joi.object({
        dossierId: Joi.string().required(),
      }).validateAsync(body, { abortEarly: false });

      const dossier = await dossiers.findDossierById(dossierId);
      if (!dossier) {
        throw Boom.notFound("Doesn't exist");
      }

      const currentUserPerm = await permissions.hasPermission({
        workspaceId: dossier.workspaceId,
        dossierId,
        userEmail: user.email,
      });

      if (currentUserPerm) {
        throw Boom.badRequest("Already shared");
      }

      await addContributor({ dossiers, roles, userEmail: user.email, dossierId });

      return res.json({ success: true });
    })
  );

  return router;
};
