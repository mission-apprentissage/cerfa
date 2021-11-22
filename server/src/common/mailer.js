const nodemailer = require("nodemailer");
const { omit } = require("lodash");
const htmlToText = require("nodemailer-html-to-text").htmlToText;
const mjml = require("mjml");
const { promisify } = require("util");
const ejs = require("ejs");
const config = require("config");
const renderFile = promisify(ejs.renderFile);

const createTransporter = (smtp) => {
  let needsAuthentication = !!smtp.auth.user;

  let transporter = nodemailer.createTransport(needsAuthentication ? smtp : omit(smtp, ["auth"]));
  transporter.use("compile", htmlToText({ ignoreImage: true }));
  return transporter;
};

module.exports = (transporter = createTransporter({ ...config.smtp, secure: false })) => {
  let renderEmail = async (template, data = {}) => {
    let buffer = await renderFile(template, {
      data,
    });
    let { html } = mjml(buffer.toString(), { minify: true });
    return html;
  };

  return {
    renderEmail,
    sendEmail: async (to, subject, template, data, attachments) => {
      return transporter.sendMail({
        from: "no-reply@apprentissage.beta.gouv.fr",
        to,
        subject,
        html: await renderEmail(template, data),
        list: {},
        attachments,
      });
    },
  };
};
