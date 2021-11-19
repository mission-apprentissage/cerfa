const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const Joi = require("joi");
const { Role } = require("../../common/model");

const roleSchema = Joi.object({
  name: Joi.string().required(),
  acl: Joi.array().required(),
});

module.exports = ({ users }) => {
  const router = express.Router();

  router.get(
    "/roles",
    tryCatch(async (req, res) => {
      const rolesList = await Role.find({}).lean();
      return res.json(rolesList || []);
    })
  );

  router.post(
    "/role",
    tryCatch(async ({ body }, res) => {
      await roleSchema.validateAsync(body, { abortEarly: false });

      const { name, acl } = body;

      const role = new Role({
        name,
        acl,
      });

      await role.save();

      return res.json(role.toObject());
    })
  );

  router.put(
    "/role/:name",
    tryCatch(async ({ body, params }, res) => {
      const name = params.name;

      let role = await Role.findOne({ name });
      if (!role) {
        throw new Error(`Unable to find Rôle ${role}`);
      }

      await Role.findOneAndUpdate(
        { _id: role._id },
        {
          acl: body.acl,
        },
        { new: true }
      );

      const allRoleUsers = await users.getUsers({ roles: { $in: [name] } });
      for (let index = 0; index < allRoleUsers.length; index++) {
        const user = allRoleUsers[index];
        await users.updateUser(user.username, { invalided_token: true });
      }

      res.json({ message: `Rôle ${name} updated !` });
    })
  );

  router.delete(
    "/role/:name",
    tryCatch(async ({ params }, res) => {
      const name = params.name;

      let role = await Role.findOne({ name });
      if (!role) {
        throw new Error(`Unable to find Rôle ${role}`);
      }

      await role.deleteOne({ name });

      const allRoleUsers = await users.getUsers({ roles: { $in: [name] } });
      for (let index = 0; index < allRoleUsers.length; index++) {
        const user = allRoleUsers[index];
        const roles = user.roles.filter((r) => r !== name);
        await users.updateUser(user.username, { invalided_token: true, roles });
      }

      res.json({ message: `Rôle ${name} deleted !` });
    })
  );

  return router;
};
