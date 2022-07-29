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
    youSignWebhook: {
      jwtSecret: env.get("CERFA_AUTH_YOUSIGN_WEBHOOK_JWT_SECRET").asString(),
      expiresIn: "30 days",
    },
  },
  log: {
    level: env.get("CERFA_LOG_LEVEL").default("info").asString(),
    destinations: env.get("CERFA_LOG_DESTINATIONS").default("stdout").asArray(),
    format: env.get("CERFA_LOG_FORMAT").default("pretty").asString(),
  },
  teamsWebhookUrl: env.get("CERFA_TEAMS_WEBHOOK_URL").asString(),
  outputDir: env.get("CERFA_OUTPUT_DIR").default(".local/output").asString(),
  smtp: {
    host: env.get("CERFA_SMTP_HOST").asString(),
    port: env.get("CERFA_SMTP_PORT").asString(),
    auth: {
      user: env.get("CERFA_SMTP_AUTH_USER").asString(),
      pass: env.get("CERFA_SMTP_AUTH_PASS").asString(),
    },
  },
  objectStorage: {
    encryptionKey: env.get("CERFA_OBJECTSTORAGE_ENCRYPTION_KEY").asString(),
    aws: {
      Bucket: env.get("CERFA_AWS_BUCKET_NAME").asString(),
      BasePath: env.get("CERFA_AWS_BASE_PATH").asString(),
      AccessKeyId: env.get("CERFA_AWS_ACCESS_KEY_ID").asString(),
      SecretAccessKey: env.get("CERFA_AWS_SECRET_ACCES_KEY").asString(),
      region: env.get("CERFA_AWS_REGION").asString(),
      s3ForcePathStyle: env.get("CERFA_AWS_S3FORCEPATHSTYLE").default("true").asBoolStrict(),
      signatureVersion: env.get("CERFA_AWS_SIGNATURE_VERSION").default("v4").asString(),
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
    pdsUrl: env.get("CERFA_PDS_URL").asString(),
    clientId: env.get("CERFA_PDS_CLIENT_ID").asString(),
    clientSecret: env.get("CERFA_PDS_CLIENT_SECRET").asString(),
  },
  agecap_passphrase: env.get("CERFA_AGECAP_PASSPHRASE").asString(),
  agecap: {
    url: env.get("CERFA_API_AGECAP_URL").asString(),
    key: env.get("CERFA_API_AGECAP_KEY").asString(),
  },
};
