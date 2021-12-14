const nodemailer = require("nodemailer");
const { omit } = require("lodash");
const htmlToText = require("nodemailer-html-to-text").htmlToText;
const mjml = require("mjml");
const { promisify } = require("util");
const ejs = require("ejs");
const config = require("../config");
const renderFile = promisify(ejs.renderFile);
const path = require("path");

const layoutPath = path.join(__dirname, `../assets/templates/layout.mjml.ejs`);

const createTransporter = (smtp) => {
  let needsAuthentication = !!smtp.auth.user;

  let transporter = nodemailer.createTransport(needsAuthentication ? smtp : omit(smtp, ["auth"]));
  transporter.use("compile", htmlToText({ ignoreImage: true }));
  return transporter;
};

const getEmailTemplatePath = (type = "forgotten-password", data) => {
  let title = "Bienvenue sur le Contrat publique Apprentissage";
  switch (type) {
    case "inviteWorkspace":
      title = `Invitation à rejoindre l'espace ${data.wksname}`;
      break;
    case "forgotten-password":
      title = "Réinitialiser votre mot de passe";
      break;

    default:
      break;
  }
  return {
    title,
    path: path.join(__dirname, `../assets/templates/${type}.mjml.ejs`),
  };
};

module.exports = (transporter = createTransporter({ ...config.smtp, secure: false })) => {
  let renderEmail = async (buffer) => {
    let { html } = mjml(buffer.toString());
    return html;
  };

  return {
    renderEmail,
    sendEmail: async (to, subject, templateName, data, attachments) => {
      const emailTemplate = getEmailTemplatePath(templateName, data);

      let buffer = await renderFile(emailTemplate.path, {
        data,
      });
      const emailTemplateContent = await renderFile(layoutPath, {
        data: { content: buffer, title: emailTemplate.title },
      });

      return transporter.sendMail({
        from: "no-reply@apprentissage.beta.gouv.fr",
        to,
        subject,
        html: await renderEmail(emailTemplateContent),
        list: {},
        attachments,
      });
    },
  };
};
