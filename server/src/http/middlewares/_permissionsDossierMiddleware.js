const Joi = require("joi");
const Boom = require("boom");
const tryCatch = require("./tryCatchMiddleware");

module.exports = ({ permissions, roles }, acls) =>
  tryCatch(async ({ method, body, query, user }, res, next) => {
    const data = method === "GET" || method === "DELETE" ? query : body;

    let { workspaceId } = await Joi.object({
      workspaceId: Joi.string().required(),
    })
      .unknown()
      .validateAsync(data, { abortEarly: false });

    const hasRightsTo = async (role, acls) => {
      const hasRight = await roles.hasAclsByRoleId(role, acls);
      if (!hasRight) {
        throw Boom.badRequest("Accès non autorisé");
      }
    };

    const permission = await permissions.hasPermission({ workspaceId, dossierId: null, userEmail: user.email });

    if (!permission) {
      throw Boom.unauthorized("Accès non autorisé");
    }
    await hasRightsTo(permission.role, acls);

    const currentPermissionRole = await roles.findRolePermissionById(permission.role, { acl: 1 });
    if (!currentPermissionRole) {
      throw Boom.badRequest("Something went wrong");
    }

    user.currentPermissionAcl = currentPermissionRole.acl;

    next();
  });
