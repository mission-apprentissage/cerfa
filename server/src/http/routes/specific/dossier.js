const express = require("express");
const Joi = require("joi");
const Boom = require("boom");
const config = require("../../../config");
const { Dossier } = require("../../../common/model/index");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const permissionsDossierMiddleware = require("../../middlewares/permissionsDossierMiddleware");

module.exports = (components) => {
  const router = express.Router();
  const { dossiers, users, roles, permissions, mailer, cerfas } = components;

  const buildDossierResult = async (dossier, user) => {
    const owner = await users.getUserById(dossier.owner, { email: 1, nom: 1, prenom: 1, _id: 0 });
    if (!owner) {
      throw Boom.badRequest("Something went wrong");
    }
    const cerfa = await cerfas.findCerfaByDossierId(dossier._id);

    const contributors = await dossiers.getContributeurs(dossier._id, components);

    // TODO CLEAN THIS
    let apprentiStatus = "EN_ATTENTE_SIGNATURE";
    let employeurStatus = "EN_ATTENTE_SIGNATURE";
    let cfaStatus = "EN_ATTENTE_SIGNATURE";

    let signataires = {
      employeur: null,
      apprenti: {
        firstname: cerfa.apprenti.prenom,
        lastname: cerfa.apprenti.nom,
        email: cerfa.apprenti.courriel,
        phone: cerfa.apprenti.telephone,
        status: apprentiStatus,
      },
      legal: null,
      cfa: null,
    };
    for (let index = 0; index < contributors.length; index++) {
      const contributor = contributors[index];
      if (contributor.permission.name === "dossier.signataire") {
        if (contributor.user.type === "entreprise") {
          signataires.employeur = {
            firstname: contributor.user.prenom,
            lastname: contributor.user.nom,
            email: contributor.user.email,
            phone: contributor.user.telephone,
            status: employeurStatus,
          };
        } else if (contributor.user.type === "cfa") {
          signataires.cfa = {
            firstname: contributor.user.prenom,
            lastname: contributor.user.nom,
            email: contributor.user.email,
            phone: contributor.user.telephone,
            status: cfaStatus,
          };
        }
      }
    }

    if (dossier.signatures) {
      const { procedure } = dossier.signatures;
      const doneMembers = procedure.members.filter(({ status }) => status === "done");
      for (let index = 0; index < doneMembers.length; index++) {
        const doneMember = doneMembers[index];
        if (doneMember.email === signataires.apprenti.email && doneMember.phone === signataires.apprenti.phone) {
          signataires.apprenti.status = "SIGNE";
        } else if (
          doneMember.email === signataires.employeur?.email &&
          doneMember.phone === signataires.employeur?.phone
        ) {
          signataires.employeur.status = "SIGNE";
        } else if (doneMember.email === signataires.cfa?.email && doneMember.phone === signataires.cfa?.phone) {
          signataires.cfa.status = "SIGNE";
        }
      }
    }

    return {
      ...dossier,
      contributeurs: contributors,
      signataires,
      acl: user.currentPermissionAcl,
      owner: {
        ...owner,
      },
      cerfaId: cerfa._id,
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

      const results = await buildDossierResult(dossier, user);

      res.json(results);
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
    "/entity/:id/mode",
    permissionsDossierMiddleware(components, ["dossier/publication"]),
    tryCatch(async ({ body, params, user }, res) => {
      const { mode } = await Joi.object({
        mode: Joi.string()
          .valid("NOUVEAU_CONTRAT_SIGNATURE_ELECTRONIQUE", "NOUVEAU_CONTRAT_SIGNATURE_PAPIER")
          .required(),
      })
        .unknown()
        .validateAsync(body, { abortEarly: false });

      if (mode === "NOUVEAU_CONTRAT_SIGNATURE_PAPIER") {
        await dossiers.updateEtatDossier(params.id, "DOSSIER_TERMINE_SANS_SIGNATURE");
      } else {
        await dossiers.updateEtatDossier(params.id, "EN_ATTENTE_DECLENCHEMENT_SIGNATURES");
      }

      const updatedDossier = await dossiers.updateModeDossier(params.id, mode);

      const result = await buildDossierResult(updatedDossier._doc, user);

      return res.json(result);
    })
  );

  router.put(
    "/entity/:id/publish",
    permissionsDossierMiddleware(components, ["dossier/publication"]),
    tryCatch(async ({ params }, res) => {
      const cerfa = await cerfas.findCerfaByDossierId(params.id);

      await dossiers.updateDreetsDdets(
        params.id,
        parseInt(cerfa.employeur.adresse.region),
        cerfa.employeur.adresse.departement
      );

      await cerfas.publishCerfa(cerfa._id);
      const dossier = await dossiers.publishDossier(params.id);

      return res.json({ publish: true, dossier, cerfa });
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
        return res.json([]);
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
        if (!dossier) {
          throw Boom.badRequest("Something went wrong");
        }
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

      return res.json(results);
    })
  );

  router.get(
    "/contributors",
    permissionsDossierMiddleware(components, ["dossier/page_parametres", "dossier/page_parametres/gestion_acces"]),
    tryCatch(async ({ query: { dossierId } }, res) => {
      const contributors = await dossiers.getContributeurs(dossierId, components);

      return res.json(contributors);
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

      const owner = await users.getUserById(dossier.owner, { email: 1 });

      if (owner.email === userEmail) {
        throw Boom.badRequest("Something went wrong");
      }

      await dossiers.addContributeur(dossier._id, userEmail, newUserRole.name);

      await mailer.sendEmail(
        userEmail,
        `[${config.env} Contrat publique apprentissage] Invitation à participer au dossier "${dossier.nom}"`,
        "inviteDossier",
        {
          username: user.username,
          civility: user.civility,
          dossiernom: dossier.nom,
          user2role: newUserRole.title,
          publicUrl: config.publicUrl,
          tospaceUrl: `partages-avec-moi/espaces/${dossier.workspaceId}/dossiers/${dossier._id}/cerfa`,
        }
      );

      const contributors = await dossiers.getContributeurs(dossier._id, components);

      return res.json(contributors);
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

      const owner = await users.getUserById(dossier.owner, { email: 1 });

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

      const contributors = await dossiers.getContributeurs(dossier._id, components);
      return res.json(contributors);
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

      const owner = await users.getUserById(dossier.owner, { email: 1 });

      if (owner.email === userEmail) {
        throw Boom.badRequest("Something went wrong");
      }

      await dossiers.removeContributeur(dossierId, userEmail, permId);

      const contributors = await dossiers.getContributeurs(dossier._id, components);
      return res.json(contributors);
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
