const express = require("express");
const Joi = require("joi");
const Boom = require("boom");
const config = require("../../../config");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const permissionsWorkspaceMiddleware = require("../../middlewares/permissionsWorkspaceMiddleware");
// const { find } = require("lodash");

module.exports = (components) => {
  const router = express.Router();

  const { permissions, roles, workspaces, users, dossiers, cerfas, mailer } = components;

  const buildOwnerResult = async (userId, workspaceId) => {
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

  const buildContributorsResult = async (contributeurEmail, workspaceId) => {
    const userSelectFields = { email: 1, nom: 1, prenom: 1, _id: 0 };
    const permSelectFields = { addedAt: 1, role: 1, acl: 1 };
    const roleSelectFields = { name: 1, description: 1, title: 1, _id: 1 };

    const currentUser = (await users.getUser(contributeurEmail, userSelectFields)) || {
      email: contributeurEmail,
      nom: "",
      prenom: "",
    };

    const currentUserPerm = await permissions.hasPermission(
      { workspaceId, dossierId: null, userEmail: contributeurEmail },
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

  router.get(
    "/entity/:id",
    permissionsWorkspaceMiddleware(components, ["wks/page_espace"]),
    tryCatch(async ({ params, user }, res) => {
      const wks = await workspaces.findWorkspaceById(params.id, {
        description: 1,
        nom: 1,
        siren: 1,
        owner: 1,
        _id: 1,
      });
      const owner = await users.getUserById(wks.owner, { email: 1, nom: 1, prenom: 1, _id: 0 });
      if (!owner) {
        throw Boom.badRequest("Something went wrong");
      }

      res.json({
        ...wks,
        acl: user.currentPermissionAcl,
        owner: {
          ...owner,
        },
      });
    })
  );

  router.get(
    "/dossiers",
    permissionsWorkspaceMiddleware(components, ["wks/page_espace/page_dossiers/voir_liste_dossiers"]),
    tryCatch(async ({ query: { workspaceId } }, res) => {
      const results = await dossiers.findDossiers({ workspaceId });

      return res.json(results);
    })
  );

  router.post(
    "/dossier",
    permissionsWorkspaceMiddleware(components, ["wks/page_espace/page_dossiers/ajouter_nouveau_dossier"]),
    tryCatch(async ({ user }, res) => {
      const result = await dossiers.createDossier(user);
      await cerfas.createCerfa({ dossierId: result._id.toString() });

      return res.json(result);
    })
  );

  router.get(
    "/sharedwithme",
    tryCatch(async ({ user }, res) => {
      const permWorkspaceIds = await permissions.findPermissions(
        { dossierId: null, userEmail: user.email },
        { workspaceId: 1, _id: 0 }
      );
      if (!permWorkspaceIds.length) {
        throw Boom.unauthorized("Accès non autorisé");
      }

      let results = [];
      for (let index = 0; index < permWorkspaceIds.length; index++) {
        const permWorkspaceId = permWorkspaceIds[index].workspaceId;
        const wks = await workspaces.findWorkspaceById(permWorkspaceId, {
          description: 1,
          nom: 1,
          siren: 1,
          owner: 1,
          _id: 1,
        });
        const owner = await users.getUserById(wks.owner, { email: 1, nom: 1, prenom: 1, _id: 0 });
        if (!owner) {
          throw Boom.badRequest("Something went wrong");
        }
        if (owner.email !== user.email) {
          results.push({
            ...wks,
            owner: {
              ...owner,
            },
          });
        }
      }

      res.json(results);
    })
  );

  router.get(
    "/contributors",
    permissionsWorkspaceMiddleware(components, [
      "wks/page_espace/page_parametres",
      "wks/page_espace/page_parametres/gestion_acces",
    ]),
    tryCatch(async ({ query: { workspaceId } }, res) => {
      const wks = await workspaces.findWorkspaceById(workspaceId, { contributeurs: 1, owner: 1 });

      const owner = await buildOwnerResult(wks.owner, workspaceId);
      const contributeurs = [];
      for (let index = 0; index < wks.contributeurs.length; index++) {
        const contributeurEmail = wks.contributeurs[index];
        const contributeur = await buildContributorsResult(contributeurEmail, workspaceId);
        contributeurs.push(contributeur);
      }

      return res.json([{ ...owner, owner: true }, ...contributeurs]);
    })
  );

  router.post(
    "/contributors",
    permissionsWorkspaceMiddleware(components, [
      "wks/page_espace/page_parametres",
      "wks/page_espace/page_parametres/gestion_acces",
    ]),
    tryCatch(async ({ body, user }, res) => {
      let { workspaceId, userEmail, roleId } = await Joi.object({
        workspaceId: Joi.string().required(),
        userEmail: Joi.string().required(),
        roleId: Joi.string().required(),
        acl: Joi.array().items(Joi.string()).default([]), // TODO
      }).validateAsync(body, { abortEarly: false });

      const newUserRole = await roles.findRolePermissionById(roleId);
      if (!newUserRole || !newUserRole.name.includes("wks.")) {
        throw Boom.badRequest("Something went wrong");
      }

      const wks = await workspaces.findWorkspaceById(workspaceId, { contributeurs: 1, owner: 1, nom: 1 });

      const owner = await buildOwnerResult(wks.owner, workspaceId);

      if (owner.email === userEmail) {
        throw Boom.badRequest("Something went wrong");
      }

      const wksContributeurs = await workspaces.addContributeur(wks._id, userEmail, newUserRole.name);

      await mailer.sendEmail(
        userEmail,
        `[${config.env} Contrat publique apprentissage] Invitation à rejoindre l'espace ${wks.nom}`,
        "inviteWorkspace",
        {
          username: user.username,
          wksname: wks.nom,
          user2role: newUserRole.title,
          publicUrl: config.publicUrl,
          tospaceUrl: "",
        }
      );

      const contributeurs = [];
      for (let index = 0; index < wksContributeurs.length; index++) {
        const contributeurEmail = wksContributeurs[index];
        const contributeur = await buildContributorsResult(contributeurEmail, workspaceId);
        contributeurs.push(contributeur);
      }

      return res.json([{ ...owner, owner: true }, ...contributeurs]);
    })
  );

  router.put(
    "/contributors",
    permissionsWorkspaceMiddleware(components, [
      "wks/page_espace/page_parametres",
      "wks/page_espace/page_parametres/gestion_acces",
    ]),
    tryCatch(async ({ body }, res) => {
      let { workspaceId, userEmail, roleId } = await Joi.object({
        workspaceId: Joi.string().required(),
        userEmail: Joi.string().required(),
        roleId: Joi.string().required(),
        acl: Joi.array().items(Joi.string()).default([]), // TODO
      }).validateAsync(body, { abortEarly: false });

      const newUserRole = await roles.findRolePermissionById(roleId);
      if (!newUserRole || !newUserRole.name.includes("wks.")) {
        throw Boom.badRequest("Something went wrong");
      }

      const wks = await workspaces.findWorkspaceById(workspaceId, { contributeurs: 1, owner: 1 });

      const owner = await buildOwnerResult(wks.owner, workspaceId);

      if (owner.email === userEmail) {
        throw Boom.badRequest("Something went wrong");
      }

      await permissions.updatePermission({
        workspaceId,
        dossierId: null,
        userEmail,
        roleId: newUserRole._id,
        //acl,
      });

      const contributeurs = [];
      for (let index = 0; index < wks.contributeurs.length; index++) {
        const contributeurEmail = wks.contributeurs[index];
        const contributeur = await buildContributorsResult(contributeurEmail, workspaceId);
        contributeurs.push(contributeur);
      }

      return res.json([{ ...owner, owner: true }, ...contributeurs]);
    })
  );

  router.delete(
    "/contributors",
    permissionsWorkspaceMiddleware(components, [
      "wks/page_espace/page_parametres",
      "wks/page_espace/page_parametres/gestion_acces",
      "wks/page_espace/page_parametres/gestion_acces/supprimer_contributeur",
    ]),
    tryCatch(async ({ query }, res) => {
      let { workspaceId, userEmail, permId } = await Joi.object({
        workspaceId: Joi.string().required(),
        userEmail: Joi.string().required(),
        permId: Joi.string().required(),
      }).validateAsync(query, { abortEarly: false });

      const wks = await workspaces.findWorkspaceById(workspaceId, { contributeurs: 1, owner: 1 });

      const owner = await buildOwnerResult(wks.owner, workspaceId);

      if (owner.email === userEmail) {
        throw Boom.badRequest("Something went wrong");
      }

      const wksContributeurs = await workspaces.removeContributeur(workspaceId, userEmail, permId);
      const contributeurs = [];
      for (let index = 0; index < wksContributeurs.length; index++) {
        const contributeurEmail = wksContributeurs[index];
        const contributeur = await buildContributorsResult(contributeurEmail, workspaceId);
        contributeurs.push(contributeur);
      }

      return res.json([{ ...owner, owner: true }, ...contributeurs]);
    })
  );

  router.get(
    "/roles_list",
    permissionsWorkspaceMiddleware(components, [
      "wks/page_espace/page_parametres",
      "wks/page_espace/page_parametres/gestion_acces",
    ]),
    tryCatch(async (req, res) => {
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

  return router;
};
