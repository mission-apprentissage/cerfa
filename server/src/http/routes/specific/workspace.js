const express = require("express");
const Joi = require("joi");
const Boom = require("boom");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const permissionsMiddleware = require("../../middlewares/permissionsMiddleware");
const pageAccessMiddleware = require("../../middlewares/pageAccessMiddleware");
// const { find } = require("lodash");

module.exports = ({ permissions, roles, workspaces, users }) => {
  const router = express.Router();

  router.get(
    "/contributors",
    pageAccessMiddleware(["wks/page_espace/page_parametres", "wks/page_espace/page_parametres/gestion_acces"]),
    permissionsMiddleware(),
    tryCatch(async ({ query, user }, res) => {
      let { workspaceId } = await Joi.object({
        workspaceId: Joi.string().required(),
      }).validateAsync(query, { abortEarly: false });

      // TODO to check
      const perm = await permissions.hasPermission({ workspaceId, dossierId: null, userEmail: user.email });
      if (!perm) {
        throw Boom.unauthorized("Accès non autorisé");
      }
      //
      const hasRight = await roles.hasAclsByRoleId(perm.role, [
        "wks/page_espace/page_parametres",
        "wks/page_espace/page_parametres/gestion_acces",
      ]);
      if (!hasRight) {
        throw Boom.badRequest("Accès non autorisé");
      }

      // BL
      const wks = await workspaces.findWorkspaceById(workspaceId, { contributeurs: 1, owner: 1 });

      const buildResult = async (userId, workspaceId) => {
        const userSelectFields = { email: 1, nom: 1, prenom: 1, _id: 0 };
        const permSelectFields = { addedAt: 1, role: 1, acl: 1 };
        const roleSelectFields = { name: 1, description: 1, title: 1, _id: 1 };

        const currentUser = await users.getUserById(userId, userSelectFields);
        if (!currentUser) {
          throw Boom.badRequest("Something went wrong");
        }
        const currentUserPerm = await permissions.hasPermission(
          { workspaceId, dossierId: null, userEmail: currentUser.email },
          permSelectFields
        );
        if (!currentUserPerm) {
          throw Boom.badRequest("Something went wrong");
        }
        const currentUserRole = await roles.findRolePermissionById(currentUserPerm.role, roleSelectFields);
        if (!currentUserRole) {
          throw Boom.badRequest("Something went wrong");
        }
        return {
          user: currentUser,
          permission: {
            permId: currentUserPerm._id,
            addedAt: currentUserPerm.addedAt,
            customAcl: currentUserPerm.acl,
            ...currentUserRole,
          },
        };
      };

      const owner = await buildResult(wks.owner, workspaceId);
      const contributeurs = [];
      for (let index = 0; index < wks.contributeurs.length; index++) {
        const contributeurId = wks.contributeurs[index];
        const contributeur = await buildResult(contributeurId, workspaceId);
        contributeurs.push(contributeur);
      }

      return res.json([{ ...owner, owner: true }, ...contributeurs]);
    })
  );

  router.get(
    "/roles_list",
    pageAccessMiddleware(["wks/page_espace/page_parametres", "wks/page_espace/page_parametres/gestion_acces"]),
    permissionsMiddleware(),
    tryCatch(async ({ query, user }, res) => {
      let { workspaceId } = await Joi.object({
        workspaceId: Joi.string().required(),
      }).validateAsync(query, { abortEarly: false });

      // TODO to check
      const perm = await permissions.hasPermission({ workspaceId, dossierId: null, userEmail: user.email });
      if (!perm) {
        throw Boom.unauthorized("Accès non autorisé");
      }
      //
      const hasRight = await roles.hasAclsByRoleId(perm.role, [
        "wks/page_espace/page_parametres",
        "wks/page_espace/page_parametres/gestion_acces",
      ]);
      if (!hasRight) {
        throw Boom.badRequest("Accès non autorisé");
      }

      // BL
      const rolesList = await roles.findRolePermission({}, { name: 1, description: 1, title: 1, _id: 1, acl: 1 });
      const defaultList = rolesList.filter((role) => role.name.includes("wks."));

      // TODO
      // const custonRole = {
      //   _id: find(defaultList, { name: "wks.readonly" })._id,
      //   name: "wks.custom",
      //   title: "Personalisé",
      //   description: "Permissions personalisé d'espace",
      //   acl: ["wks", "wks/page_espace", "wks/page_espace/page_dossiers"],
      // };
      // return res.json([...defaultList, custonRole]);
      return res.json(defaultList);
    })
  );

  router.put(
    "/contributors",
    pageAccessMiddleware(["wks/page_espace/page_parametres", "wks/page_espace/page_parametres/gestion_acces"]),
    permissionsMiddleware(),
    tryCatch(async ({ body, user }, res) => {
      let { workspaceId, userEmail, roleId, acl } = await Joi.object({
        workspaceId: Joi.string().required(),
        userEmail: Joi.string().required(),
        roleId: Joi.string().required(),
        acl: Joi.array().items(Joi.string()).default([]),
      }).validateAsync(body, { abortEarly: false });

      // TODO to check perm middleware
      const perm = await permissions.hasPermission({ workspaceId, dossierId: null, userEmail: user.email });
      if (!perm) {
        throw Boom.unauthorized("Accès non autorisé");
      }
      //
      const hasRight = await roles.hasAclsByRoleId(perm.role, [
        "wks/page_espace/page_parametres",
        "wks/page_espace/page_parametres/gestion_acces",
      ]);
      if (!hasRight) {
        throw Boom.badRequest("Accès non autorisé");
      }

      // BL
      const newUserRole = await roles.findRolePermissionById(roleId);
      if (!newUserRole) {
        throw Boom.badRequest("Something went wrong");
      }

      const wks = await workspaces.findWorkspaceById(workspaceId, { contributeurs: 1, owner: 1 });

      const buildResult = async (userId, workspaceId) => {
        const userSelectFields = { email: 1, nom: 1, prenom: 1, _id: 0 };
        const permSelectFields = { addedAt: 1, role: 1, acl: 1 };
        const roleSelectFields = { name: 1, description: 1, title: 1, _id: 1 };

        const currentUser = await users.getUserById(userId, userSelectFields);
        if (!currentUser) {
          throw Boom.badRequest("Something went wrong");
        }
        const currentUserPerm = await permissions.hasPermission(
          { workspaceId, dossierId: null, userEmail: currentUser.email },
          permSelectFields
        );
        if (!currentUserPerm) {
          throw Boom.badRequest("Something went wrong");
        }
        const currentUserRole = await roles.findRolePermissionById(currentUserPerm.role, roleSelectFields);
        if (!currentUserRole) {
          throw Boom.badRequest("Something went wrong");
        }
        return {
          user: currentUser,
          permission: {
            permId: currentUserPerm._id,
            addedAt: currentUserPerm.addedAt,
            customAcl: currentUserPerm.acl,
            ...currentUserRole,
          },
        };
      };

      const owner = await buildResult(wks.owner, workspaceId);

      if (owner.email === userEmail) {
        throw Boom.badRequest("Something went wrong");
      }

      await permissions.updatePermission({
        workspaceId,
        dossierId: null,
        userEmail,
        roleId: newUserRole._id,
        acl,
      });

      const contributeurs = [];
      for (let index = 0; index < wks.contributeurs.length; index++) {
        const contributeurId = wks.contributeurs[index];
        const contributeur = await buildResult(contributeurId, workspaceId);
        contributeurs.push(contributeur);
      }

      return res.json([{ ...owner, owner: true }, ...contributeurs]);
    })
  );

  return router;
};
