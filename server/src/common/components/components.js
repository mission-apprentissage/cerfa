const { connectToMongo } = require("../mongodb");
const createUsers = require("./users");
const createMailer = require("../../common/mailer");
const config = require("config");

module.exports = async (options = {}) => {
  const users = options.users || (await createUsers());

  const db = options.db || (await connectToMongo()).db;

  return {
    users,
    db,
    mailer: options.mailer || createMailer({ smtp: { ...config.smtp, secure: false } }),
  };
};
