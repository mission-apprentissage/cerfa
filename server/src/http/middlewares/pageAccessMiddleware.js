const { isEqual, pick } = require("lodash");

module.exports = (acl = []) => {
  return ({ user }, res, next) => {
    const permissions = { isAdmin: true };
    const current = pick(user?.permissions, Object.keys(permissions));
    if (!(isEqual(current, permissions) || acl.some((page) => user?.acl?.includes(page)))) {
      return res.status(401).json({ message: "Accès non autorisé" });
    }

    next();
  };
};
