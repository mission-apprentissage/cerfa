const mailer = require("../../src/common/mailer");
const crypto = require("crypto");

module.exports = (options = {}) => {
  let calls = options.calls || [];
  let registerCall = (parameters) => {
    if (options.fail) {
      let err = new Error("Unable to send email");
      return Promise.reject(err);
    } else {
      calls.push(parameters[0]);
      return Promise.resolve({ messageId: crypto.randomBytes(16).toString("hex") });
    }
  };

  let transporter = {
    sendMail: (...args) => {
      return registerCall(args);
    },
  };

  return mailer(transporter);
};
