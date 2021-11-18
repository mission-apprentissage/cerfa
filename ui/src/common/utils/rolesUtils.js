export const isUserAdmin = (auth) => auth && auth.permissions && auth.permissions.isAdmin;

export const hasAccessTo = (auth, aclRef) => {
  return isUserAdmin(auth) || auth.acl?.includes(aclRef);
};
