const express = require("express");
const Joi = require("joi");
const Boom = require("boom");
const config = require("../../../config");
const { Dossier } = require("../../../common/model/index");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const permissionsDossierMiddleware = require("../../middlewares/permissionsDossierMiddleware");

module.exports = (components) => {
  const router = express.Router();
  const { dossiers, users, roles, permissions, mailer } = components;

  const buildOwnerResult = async (userId, workspaceId, dossierId) => {
    const userSelectFields = { email: 1, nom: 1, prenom: 1, _id: 0, roles: 1 };
    const permSelectFields = { addedAt: 1, role: 1, acl: 1 };
    const roleSelectFields = { name: 1, description: 1, title: 1, _id: 1 };

    const currentUser = await users.getUserById(userId, userSelectFields);
    if (!currentUser) {
      throw Boom.badRequest("Something went wrong");
    }

    const currentUserPerm = await permissions.hasPermission(
      { workspaceId, dossierId, userEmail: currentUser.email },
      permSelectFields
    );
    if (!currentUserPerm) {
      throw Boom.badRequest("Something went wrong");
    }
    const currentUserRole = await roles.findRolePermissionById(currentUserPerm.role, roleSelectFields);
    if (!currentUserRole) {
      throw Boom.badRequest("Something went wrong");
    }
    const type = await roles.findRoleById(currentUser.roles[0]);
    return {
      user: { ...currentUser, type: type?.name || null },
      permission: {
        permId: currentUserPerm._id,
        addedAt: currentUserPerm.addedAt,
        customAcl: currentUserPerm.acl,
        ...currentUserRole,
      },
    };
  };

  const buildContributorsResult = async (contributeurEmail, workspaceId, dossierId) => {
    const userSelectFields = { email: 1, nom: 1, prenom: 1, _id: 0, roles: 1 };
    const permSelectFields = { addedAt: 1, role: 1, acl: 1 };
    const roleSelectFields = { name: 1, description: 1, title: 1, _id: 1 };

    const currentUser = (await users.getUser(contributeurEmail, userSelectFields)) || {
      email: contributeurEmail,
      nom: "",
      prenom: "",
    };

    const currentUserPerm = await permissions.hasPermission(
      { workspaceId, dossierId, userEmail: contributeurEmail },
      permSelectFields
    );
    if (!currentUserPerm) {
      throw Boom.badRequest("Something went wrong");
    }
    const currentUserRole = await roles.findRolePermissionById(currentUserPerm.role, roleSelectFields);
    if (!currentUserRole) {
      throw Boom.badRequest("Something went wrong");
    }
    const type = currentUser && currentUser.roles ? await roles.findRoleById(currentUser?.roles[0]) : null;
    return {
      user: { ...currentUser, type: type?.name || null },
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
    permissionsDossierMiddleware(components, ["dossier"]),
    tryCatch(async ({ user, params }, res) => {
      const dossier = await dossiers.findDossierById(params.id);
      if (!dossier) {
        throw Boom.notFound("Doesn't exist");
      }

      const owner = await users.getUserById(dossier.owner, { email: 1, nom: 1, prenom: 1, _id: 0 });
      if (!owner) {
        throw Boom.badRequest("Something went wrong");
      }

      res.json({
        ...dossier,
        acl: user.currentPermissionAcl,
        owner: {
          ...owner,
        },
      });
    })
  );

  router.put(
    "/entity/:id",
    permissionsDossierMiddleware(components, ["dossier/sauvegarder"]),
    tryCatch(async ({ body, params }, res) => {
      const data = await Joi.object({
        documents: Joi.array().items({
          typeDocument: Joi.string(),
          typeFichier: Joi.string(),
          nomFichier: Joi.string(),
          cheminFichier: Joi.string(),
        }),
        numeroExterne: Joi.string(),
        numeroInterne: Joi.string(),
        numeroDeca: Joi.string(),
        etat: Joi.string(),
        saved: Joi.string(),
      }).validateAsync(body, { abortEarly: false });

      const result = await Dossier.findOneAndUpdate({ _id: params.id }, data, {
        new: true,
      });

      return res.json(result);
    })
  );

  router.put(
    "/entity/:id/saved",
    permissionsDossierMiddleware(components, ["dossier/sauvegarder"]),
    tryCatch(async ({ params }, res) => {
      const saved = await dossiers.saveDossier(params.id);

      return res.json(saved);
    })
  );

  router.put(
    "/entity/:id/publish",
    permissionsDossierMiddleware(components, ["dossier/publication"]),
    tryCatch(async ({ params }, res) => {
      await dossiers.publishDossier(params.id);

      return res.json({ publish: true });
    })
  );

  router.put(
    "/entity/:id/unpublish",
    permissionsDossierMiddleware(components, ["dossier/publication"]),
    tryCatch(async ({ params }, res) => {
      await dossiers.unpublishDossier(params.id);

      return res.json({ publish: false });
    })
  );

  router.delete(
    "/entity/:id",
    permissionsDossierMiddleware(components, ["dossier/supprimer"]),
    tryCatch(async ({ params }, res) => {
      const result = await dossiers.removeDossier(params.id);
      return res.json(result);
    })
  );

  router.get(
    "/sharedwithme",
    tryCatch(async ({ user }, res) => {
      const permDossierIds = await permissions.findPermissions(
        { dossierId: { $ne: null }, userEmail: user.email },
        { dossierId: 1, workspaceId: 1, _id: 0 }
      );
      if (!permDossierIds.length) {
        res.json([]);
      }

      let results = [];
      for (let index = 0; index < permDossierIds.length; index++) {
        const permDossierId = permDossierIds[index].dossierId;
        const dossier = await dossiers.findDossierById(permDossierId, {
          nom: 1,
          owner: 1,
          _id: 1,
          workspaceId: 1,
        });
        const owner = await users.getUserById(dossier.owner, { email: 1, nom: 1, prenom: 1, _id: 0 });
        if (!owner) {
          throw Boom.badRequest("Something went wrong");
        }
        if (owner.email !== user.email) {
          results.push({
            ...dossier,
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
    permissionsDossierMiddleware(components, ["dossier/page_parametres", "dossier/page_parametres/gestion_acces"]),
    tryCatch(async ({ query: { dossierId } }, res) => {
      const dossier = await dossiers.findDossierById(dossierId, { contributeurs: 1, owner: 1, workspaceId: 1 });
      if (!dossier) {
        throw Boom.notFound("Doesn't exist");
      }

      const owner = await buildOwnerResult(dossier.owner, dossier.workspaceId, dossierId);
      const contributeurs = [];
      for (let index = 0; index < dossier.contributeurs.length; index++) {
        const contributeurEmail = dossier.contributeurs[index];
        const contributeur = await buildContributorsResult(contributeurEmail, dossier.workspaceId, dossierId);
        contributeurs.push(contributeur);
      }

      return res.json([{ ...owner, owner: true }, ...contributeurs]);
    })
  );

  router.post(
    "/contributors",
    permissionsDossierMiddleware(components, ["dossier/page_parametres", "dossier/page_parametres/gestion_acces"]),
    tryCatch(async ({ body, user }, res) => {
      let { dossierId, userEmail, roleId } = await Joi.object({
        dossierId: Joi.string().required(),
        userEmail: Joi.string().required(),
        roleId: Joi.string().required(),
        acl: Joi.array().items(Joi.string()).default([]), // TODO
      }).validateAsync(body, { abortEarly: false });

      const newUserRole = await roles.findRolePermissionById(roleId);
      if (!newUserRole || !newUserRole.name.includes("dossier.")) {
        throw Boom.badRequest("Something went wrong");
      }

      const dossier = await dossiers.findDossierById(dossierId, { nom: 1, contributeurs: 1, owner: 1, workspaceId: 1 });
      if (!dossier) {
        throw Boom.notFound("Doesn't exist");
      }

      const owner = await buildOwnerResult(dossier.owner, dossier.workspaceId, dossierId);

      if (owner.email === userEmail) {
        throw Boom.badRequest("Something went wrong");
      }

      const wksContributeurs = await dossiers.addContributeur(dossier._id, userEmail, newUserRole.name);

      await mailer.sendEmail(
        userEmail,
        `[${config.env} Contrat publique apprentissage] Invitation à participer au dossier "${dossier.nom}"`,
        "inviteDossier",
        {
          username: user.username,
          dossiernom: dossier.nom,
          user2role: newUserRole.title,
          publicUrl: config.publicUrl,
          tospaceUrl: `partages-avec-moi/espaces/${dossier.workspaceId}/dossiers/${dossier._id}/cerfa`,
        }
      );

      const contributeurs = [];
      for (let index = 0; index < wksContributeurs.length; index++) {
        const contributeurEmail = wksContributeurs[index];
        const contributeur = await buildContributorsResult(contributeurEmail, dossier.workspaceId, dossierId);
        contributeurs.push(contributeur);
      }

      return res.json([{ ...owner, owner: true }, ...contributeurs]);
    })
  );

  router.put(
    "/contributors",
    permissionsDossierMiddleware(components, ["dossier/page_parametres", "dossier/page_parametres/gestion_acces"]),
    tryCatch(async ({ body }, res) => {
      let { dossierId, userEmail, roleId } = await Joi.object({
        dossierId: Joi.string().required(),
        userEmail: Joi.string().required(),
        roleId: Joi.string().required(),
        acl: Joi.array().items(Joi.string()).default([]), // TODO
      }).validateAsync(body, { abortEarly: false });

      const newUserRole = await roles.findRolePermissionById(roleId);
      if (!newUserRole || !newUserRole.name.includes("dossier.")) {
        throw Boom.badRequest("Something went wrong");
      }

      const dossier = await dossiers.findDossierById(dossierId, { contributeurs: 1, owner: 1, workspaceId: 1 });
      if (!dossier) {
        throw Boom.notFound("Doesn't exist");
      }

      const owner = await buildOwnerResult(dossier.owner, dossier.workspaceId, dossierId);

      if (owner.email === userEmail) {
        throw Boom.badRequest("Something went wrong");
      }

      await permissions.updatePermission({
        workspaceId: dossier.workspaceId,
        dossierId,
        userEmail,
        roleId: newUserRole._id,
        //acl,
      });

      const contributeurs = [];
      for (let index = 0; index < dossier.contributeurs.length; index++) {
        const contributeurEmail = dossier.contributeurs[index];
        const contributeur = await buildContributorsResult(contributeurEmail, dossier.workspaceId, dossierId);
        contributeurs.push(contributeur);
      }

      return res.json([{ ...owner, owner: true }, ...contributeurs]);
    })
  );

  router.delete(
    "/contributors",
    permissionsDossierMiddleware(components, ["dossier/page_parametres", "dossier/page_parametres/gestion_acces"]),
    tryCatch(async ({ query }, res) => {
      let { dossierId, userEmail, permId } = await Joi.object({
        dossierId: Joi.string().required(),
        userEmail: Joi.string().required(),
        permId: Joi.string().required(),
      }).validateAsync(query, { abortEarly: false });

      const dossier = await dossiers.findDossierById(dossierId, { contributeurs: 1, owner: 1, workspaceId: 1 });
      if (!dossier) {
        throw Boom.notFound("Doesn't exist");
      }

      const owner = await buildOwnerResult(dossier.owner, dossier.workspaceId, dossierId);

      if (owner.email === userEmail) {
        throw Boom.badRequest("Something went wrong");
      }

      const wksContributeurs = await dossiers.removeContributeur(dossierId, userEmail, permId);

      const contributeurs = [];
      for (let index = 0; index < wksContributeurs.length; index++) {
        const contributeurEmail = wksContributeurs[index];
        const contributeur = await buildContributorsResult(contributeurEmail, dossier.workspaceId, dossierId);
        contributeurs.push(contributeur);
      }

      return res.json([{ ...owner, owner: true }, ...contributeurs]);
    })
  );

  router.get(
    "/roles_list",
    permissionsDossierMiddleware(components, ["dossier/page_parametres", "dossier/page_parametres/gestion_acces"]),
    tryCatch(async (req, res) => {
      const rolesList = await roles.findRolePermission({}, { name: 1, description: 1, title: 1, _id: 1, acl: 1 });
      const defaultList = rolesList.filter((role) => role.name.includes("dossier."));

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
