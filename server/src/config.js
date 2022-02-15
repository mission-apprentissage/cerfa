const env = require("env-var");

module.exports = {
  appName: env.get("CERFA_NAME").default("Cerfa App").asString(),
  env: env.get("CERFA_ENV").default("local").asString(),
  isOffline: env.get("CERFA_IS_OFFLINE").default("true").asBoolStrict(),
  publicUrl: env.get("CERFA_PUBLIC_URL").default("http://localhost").asString(),
  mongodb: {
    uri: env.get("CERFA_MONGODB_URI").default("mongodb://127.0.0.1:27017/cerfa?retryWrites=true&w=majority").asString(),
  },
  apiKey: env.get("CERFA_API_KEY").asString(),
  auth: {
    passwordHashRounds: env.get("CERFA_AUTH_PASSWORD_HASH_ROUNDS").asString(),
    user: {
      jwtSecret: env.get("CERFA_AUTH_USER_JWT_SECRET").asString(),
      expiresIn: "24h",
    },
    pds: {
      jwtSecret: env.get("CERFA_AUTH_PDS_JWT_SECRET").asString(),
      expiresIn: "24h",
    },
    activation: {
      jwtSecret: env.get("CERFA_AUTH_ACTIVATION_JWT_SECRET").asString(),
      expiresIn: "96h",
    },
    password: {
      jwtSecret: env.get("CERFA_AUTH_PASSWORD_JWT_SECRET").asString(),
      expiresIn: "1h",
    },
  },
  log: {
    level: env.get("CERFA_LOG_LEVEL").default("info").asString(),
    destinations: env.get("CERFA_LOG_DESTINATIONS").default("stdout").asString(),
  },
  slackWebhookUrl: env.get("CERFA_SLACK_WEBHOOK_URL").asString(),
  outputDir: env.get("CERFA_OUTPUT_DIR").default(".local/output").asString(),
  smtp: {
    host: env.get("CERFA_SMTP_HOST").asString(),
    port: env.get("CERFA_SMTP_PORT").asString(),
    auth: {
      user: env.get("CERFA_SMTP_AUTH_USER").asString(),
      pass: env.get("CERFA_SMTP_AUTH_PASS").asString(),
    },
  },
  ovh: {
    storage: {
      encryptionKey: env.get("CERFA_OVH_STORAGE_ENCRYPTION_KEY").asString(),
      uri: env.get("CERFA_OVH_STORAGE_URI").asString(),
      storageName: env.get("CERFA_OVH_STORAGE_NAME").default("mna-cerfa").asString(),
    },
  },
  apiEntreprise: env.get("CERFA_API_ENTREPRISE_KEY").asString(),
  apiYousign: {
    url: env.get("CERFA_API_YOUSIGN_URL").asString(),
    key: env.get("CERFA_API_YOUSIGN_KEY").asString(),
  },
  clamav: {
    uri: env.get("CERFA_CLAMAV_URI").default("127.0.0.1:3310").asString(),
  },
  pds: {
    clientId: env.get("CERFA_PDS_CLIENT_ID").asString(),
    clientSecret: env.get("CERFA_PDS_CLIENT_SECRET").asString(),
  },
  agecap_passphrase: env.get("CERFA_AGECAP_PASSPHRASE").asString(),
  agecap: {
    url: env.get("CERFA_API_AGECAP_URL").asString(),
    key: env.get("CERFA_API_AGECAP_KEY").asString(),
  },
};
