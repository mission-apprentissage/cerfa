/* eslint-disable */

db.getSiblingDB("{{ vault.DB_SIBLING_NAME }}").createUser({
  user: "{{ vault[env_type].CERFA_MONGODB_USER }}",
  pwd: "{{ vault[env_type].CERFA_MONGODB_USER_PASSWORD }}",
  roles: [{ role: "readWrite", db: "{{ vault.DB_NAME }}" }],
});

db.getSiblingDB("{{ vault.DB_SIBLING_NAME }}").createUser({
  user: "{{ vault[env_type].CERFA_MONGODB_ADMIN_USER }}",
  pwd: "{{ vault[env_type].CERFA_MONGODB_ADMIN_PASSWORD }}",
  roles: [
    { role: "userAdminAnyDatabase", db: "{{ vault.DB_ADMIN_NAME }}" },
    { role: "readWriteAnyDatabase", db: "{{ vault.DB_ADMIN_NAME }}" },
    { role: "dbAdminAnyDatabase", db: "{{ vault.DB_ADMIN_NAME }}" },
    { role: "clusterAdmin", db: "{{ vault.DB_ADMIN_NAME }}" },
  ],
});

db.getSiblingDB("{{ vault.DB_SIBLING_NAME }}").createUser({
  user: "{{ vault[env_type].CERFA_MONGODB_BACKUP_USER }}",
  pwd: "{{ vault[env_type].CERFA_MONGODB_BACKUP_PASSWORD }}",
  roles: [
    { role: "backup", db: "{{ vault.DB_ADMIN_NAME }}" },
    { role: "restore", db: "{{ vault.DB_ADMIN_NAME }}" },
  ],
});
