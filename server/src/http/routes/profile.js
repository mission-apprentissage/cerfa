const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const Joi = require("joi");
const Boom = require("boom");

module.exports = ({ users }) => {
  const router = express.Router();

  router.put(
    "/user",
    tryCatch(async ({ body, user }, res) => {
      const { nom, prenom, email, telephone, beta } = await Joi.object({
        prenom: Joi.string().default(null).allow(null),
        nom: Joi.string().default(null).allow(null),
        email: Joi.string().required(),
        telephone: Joi.string().default(null).allow(null),
        beta: Joi.string().default(null).allow(null),
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
        beta_test: beta || user.beta,
      });

      res.json({ message: `Profile updated` });
    })
  );

  router.put(
    "/acceptCgu",
    tryCatch(async ({ body, user }, res) => {
      const { cguVersion } = await Joi.object({
        cguVersion: Joi.string().required(),
      }).validateAsync(body, { abortEarly: false });

      const userDb = await users.getUser(user.email);
      if (!userDb) {
        throw Boom.badRequest("Something went wrong");
      }

      const updatedUser = await users.updateUser(userDb._id, {
        has_accept_cgu: cguVersion || null,
      });

      const payload = await users.structureUser(updatedUser);

      return res.json(payload);
    })
  );

  router.put(
    "/becomeBeta",
    tryCatch(async ({ body, user }, res) => {
      const { beta } = await Joi.object({
        beta: Joi.string().required(),
      }).validateAsync(body, { abortEarly: false });

      const userDb = await users.getUser(user.email);
      if (!userDb) {
        throw Boom.badRequest("Something went wrong");
      }

      const updatedUser = await users.updateUser(userDb._id, {
        beta_test: beta,
      });

      const payload = await users.structureUser(updatedUser);

      return res.json(payload);
    })
  );

  return router;
};
