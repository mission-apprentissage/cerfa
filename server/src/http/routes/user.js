const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const Joi = require("joi");
const config = require("config");
const path = require("path");
const Boom = require("boom");

const userSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  options: Joi.object({
    email: Joi.string().required(),
    academie: Joi.string().required(),
    roles: Joi.array().required(),
    permissions: Joi.object({
      isAdmin: Joi.boolean().required(),
    }).unknown(),
  }).unknown(),
});

const getEmailTemplate = (type = "forgotten-password") => {
  return path.join(__dirname, `../../assets/templates/${type}.mjml.ejs`);
};

const closeSessionsOfThisUser = async (db, username) =>
  new Promise((resolve, reject) => {
    db.collection("sessions", function (err, collection) {
      collection.find({}).toArray(function (err, data) {
        const sessionIdToDelete = [];
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          const session = JSON.parse(element.session);
          if (session.passport.user.sub === username) {
            sessionIdToDelete.push(element._id);
          }
        }
        collection.deleteMany({ _id: { $in: sessionIdToDelete } }, function (err, r) {
          if (err) {
            return reject(err);
          }
          resolve(r);
        });
      });
    });
  });

module.exports = ({ users, mailer, db: { db } }) => {
  const router = express.Router();

  router.get(
    "/users",
    tryCatch(async (req, res) => {
      const usersList = await users.getUsers();
      return res.json(usersList);
    })
  );

  router.post(
    "/user",
    tryCatch(async ({ body }, res) => {
      await userSchema.validateAsync(body, { abortEarly: false });

      const { username, password, options } = body;

      const alreadyExists = await users.getUser(username);
      if (alreadyExists) {
        throw Boom.conflict(`Unable to create, user ${username} already exists`);
      }

      const user = await users.createUser(username, password, options);

      await mailer.sendEmail(
        user.email,
        `[${config.env} Catalogue apprentissage] Bienvenue`,
        getEmailTemplate("grettings"),
        {
          username,
          tmpPwd: password,
          publicUrl: config.publicUrl,
        }
      );

      return res.json(user);
    })
  );

  router.put(
    "/user/:username",
    tryCatch(async ({ body, params }, res) => {
      const username = params.username;

      await users.updateUser(username, {
        isAdmin: body.options.permissions.isAdmin,
        email: body.options.email,
        academie: body.options.academie,
        username: body.username,
        roles: body.options.roles,
        acl: body.options.acl,
      });

      await closeSessionsOfThisUser(db, username);

      res.json({ message: `User ${username} updated !` });
    })
  );

  router.delete(
    "/user/:username",
    tryCatch(async ({ params }, res) => {
      const username = params.username;

      await users.removeUser(username);

      await closeSessionsOfThisUser(db, username);

      res.json({ message: `User ${username} deleted !` });
    })
  );

  return router;
};
