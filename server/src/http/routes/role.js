const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const Joi = require("joi");
const { Role } = require("../../common/model");

const roleSchema = Joi.object({
  name: Joi.string().required(),
  acl: Joi.array().required(),
});

const closeSessionsOfThisRole = async (db, name) =>
  new Promise((resolve, reject) => {
    db.collection("sessions", function (err, collection) {
      collection.find({}).toArray(function (err, data) {
        const sessionIdToDelete = [];
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          const session = JSON.parse(element.session);
          if (session.passport.user.roles?.includes(name)) {
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

module.exports = ({ db: { db } }) => {
  const router = express.Router();

  router.get(
    "/roles",
    tryCatch(async (req, res) => {
      const rolesList = await Role.find({}).lean();
      console.log(rolesList);
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

      await closeSessionsOfThisRole(db, name);

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

      await closeSessionsOfThisRole(db, name);

      res.json({ message: `Rôle ${name} deleted !` });
    })
  );

  return router;
};
