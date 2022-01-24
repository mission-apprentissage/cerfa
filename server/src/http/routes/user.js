const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const Joi = require("joi");
const config = require("../../config");
const Boom = require("boom");

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
      const { password, options } = await Joi.object({
        password: Joi.string().required(),
        options: Joi.object({
          prenom: Joi.string().required(),
          nom: Joi.string().required(),
          email: Joi.string().required(),
          roles: Joi.array().required(),
          permissions: Joi.object({
            isAdmin: Joi.boolean().required(),
          }).unknown(),
        }).unknown(),
      }).validateAsync(body, { abortEarly: false });

      const alreadyExists = await users.getUser(options.email);
      if (alreadyExists) {
        throw Boom.conflict(`Unable to create, user ${options.email} already exists`);
      }

      const user = await users.createUser(options.email, password, options);

      await mailer.sendEmail(user.email, `[${config.env} Contrat publique apprentissage] Bienvenue`, "grettings", {
        username: user.username,
        civility: user.civility,
        tmpPwd: password,
        publicUrl: config.publicUrl,
      });

      return res.json(user);
    })
  );

  router.put(
    "/user/:userid",
    tryCatch(async ({ body, params }, res) => {
      const userid = params.userid;

      let rolesId = await roles.findRolesByNames(body.options.roles, { _id: 1 });
      rolesId = rolesId.map(({ _id }) => _id);

      await users.updateUser(userid, {
        isAdmin: body.options.permissions.isAdmin,
        email: body.options.email,
        prenom: body.options.prenom,
        nom: body.options.nom,
        roles: rolesId,
        acl: body.options.acl,
        invalided_token: true,
      });

      res.json({ message: `User ${userid} updated !` });
    })
  );

  router.delete(
    "/user/:userid",
    tryCatch(async ({ params }, res) => {
      const userid = params.userid;

      await users.removeUser(userid);

      res.json({ message: `User ${userid} deleted !` });
    })
  );

  return router;
};
