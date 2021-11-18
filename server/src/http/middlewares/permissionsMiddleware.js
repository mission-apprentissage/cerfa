const { isEqual, pick } = require("lodash");

module.exports = (permissions = {}, acl = []) => {
  return (req, res, next) => {
    const current = pick(req.user, Object.keys(permissions));

    if (!(isEqual(current, permissions) || acl.some((page) => req.session?.passport?.user?.acl?.includes(page)))) {
      return res.status(401).json({ message: "Accès non autorisé" });
    }

    next();
  };
};
