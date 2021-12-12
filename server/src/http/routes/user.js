const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const Joi = require("joi");
const config = require("../../config");
const path = require("path");
const Boom = require("boom");

const getEmailTemplate = (type = "forgotten-password") => {
  return path.join(__dirname, `../../assets/templates/${type}.mjml.ejs`);
};

module.exports = ({ users, roles, mailer }) => {
  const router = express.Router();

  router.get(
    "/users",
    tryCatch(async (req, res) => {
      let usersList = await users.getUsers();
      for (let index = 0; index < usersList.length; index++) {
        const user = usersList[index];
        for (let j = 0; j < user.roles.length; j++) {
          const roleId = user.roles[j];
          const roleName = await roles.findRoleById(roleId, { name: 1 });
          user.roles[j] = roleName.name;
        }
      }

      return res.json(usersList);
    })
  );

  router.post(
    "/user",
    tryCatch(async ({ body }, res) => {
      const { username, password, options } = await Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        options: Joi.object({
          email: Joi.string().required(),
          roles: Joi.array().required(),
          permissions: Joi.object({
            isAdmin: Joi.boolean().required(),
          }).unknown(),
        }).unknown(),
      }).validateAsync(body, { abortEarly: false });

      const alreadyExists = await users.getUser(username);
      if (alreadyExists) {
        throw Boom.conflict(`Unable to create, user ${username} already exists`);
      }

      const user = await users.createUser(username, password, options);

      await mailer.sendEmail(
        user.email,
        `[${config.env} Contrat publique apprentissage] Bienvenue`,
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

      let rolesId = await roles.findRolesByNames(body.options.roles, { _id: 1 });
      rolesId = rolesId.map(({ _id }) => _id);

      await users.updateUser(username, {
        isAdmin: body.options.permissions.isAdmin,
        email: body.options.email,
        username: body.username,
        roles: rolesId,
        acl: body.options.acl,
        invalided_token: true,
      });

      res.json({ message: `User ${username} updated !` });
    })
  );

  router.delete(
    "/user/:username",
    tryCatch(async ({ params }, res) => {
      const username = params.username;

      await users.removeUser(username);

      res.json({ message: `User ${username} deleted !` });
    })
  );

  return router;
};
