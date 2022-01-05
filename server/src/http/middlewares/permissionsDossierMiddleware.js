const Joi = require("joi");
const Boom = require("boom");
const tryCatch = require("./tryCatchMiddleware");

module.exports = ({ permissions, roles, dossiers }, acls) =>
  tryCatch(async ({ method, body, query, user, baseUrl }, res, next) => {
    if (user.account_status !== "CONFIRMED") {
      throw Boom.unauthorized("Accès non autorisé");
    }

    const data =
      baseUrl === "/api/v1/upload" && method === "POST"
        ? query
        : method === "GET" || method === "DELETE"
        ? query
        : body;

    let { dossierId } = await Joi.object({
      dossierId: Joi.string().required(),
    })
      .unknown()
      .validateAsync(data, { abortEarly: false });

    const hasRightsTo = async (role, acls) => {
      const hasRight = await roles.hasAclsByRoleId(role, acls);
      if (!hasRight) {
        throw Boom.badRequest("Accès non autorisé");
      }
    };

    const dossier = await dossiers.findDossierById(dossierId, {
      workspaceId: 1,
    });
    if (!dossier) {
      throw Boom.badRequest("Something went wrong");
    }

    const workspacePermission = await permissions.hasPermission({
      workspaceId: dossier.workspaceId,
      dossierId: null,
      userEmail: user.email,
    });
    const dossierPermission = await permissions.hasPermission({
      workspaceId: dossier.workspaceId,
      dossierId,
      userEmail: user.email,
    });

    if (!dossierPermission && !workspacePermission) {
      throw Boom.unauthorized("Accès non autorisé");
    }

    let roleId = null;

    if (!dossierPermission) {
      let hierarchyChildRole = "";
      const workspaceRole = await roles.findRolePermissionById(workspacePermission.role);
      switch (workspaceRole.name) {
        case "wks.admin":
          hierarchyChildRole = "dossier.admin";
          break;
        case "wks.member":
          hierarchyChildRole = "dossier.member";
          break;
        case "wks.readonly":
          hierarchyChildRole = "dossier.readonly";
          break;
        default:
          break;
      }
      if (hierarchyChildRole === "") {
        throw Boom.badRequest("Accès non autorisé");
      }

      const childRole = await roles.findRolesByNames([hierarchyChildRole]);
      if (childRole.length !== 1) {
        throw Boom.badRequest("Accès non autorisé");
      }
      roleId = childRole[0]._id;
    } else {
      roleId = dossierPermission.role;
    }

    await hasRightsTo(roleId, acls);

    const currentPermissionRole = await roles.findRolePermissionById(roleId, { acl: 1 });
    if (!currentPermissionRole) {
      throw Boom.badRequest("Something went wrong");
    }

    user.currentPermissionAcl = currentPermissionRole.acl;

    next();
  });
