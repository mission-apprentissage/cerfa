const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const Joi = require("joi");
const Boom = require("boom");

module.exports = ({ users }) => {
  const router = express.Router();

  router.put(
    "/user",
    tryCatch(async ({ body, user }, res) => {
      const { nom, prenom, email, telephone } = await Joi.object({
        prenom: Joi.string().default(null).allow(null),
        nom: Joi.string().default(null).allow(null),
        email: Joi.string().required(),
        telephone: Joi.string().default(null).allow(null),
      }).validateAsync(body, { abortEarly: false });

      if (user.email !== email) {
        throw Boom.badRequest("Accès non autorisé");
      }

      const userDb = await users.getUser(user.email);
      if (!userDb) {
        throw Boom.badRequest("Something went wrong");
      }

      await users.updateUser(userDb._id, {
        prenom: prenom || user.prenom,
        nom: nom || user.nom,
        telephone: telephone || user.telephone,
      });

      res.json({ message: `Profile updated` });
    })
  );

  return router;
};