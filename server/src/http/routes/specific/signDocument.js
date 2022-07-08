const express = require("express");
const Joi = require("joi");
const Boom = require("boom");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const permissionsDossierMiddleware = require("../../middlewares/permissionsDossierMiddleware");
const { Dossier, Cerfa } = require("../../../common/model/index");
const pdfCerfaController = require("../../../logic/controllers/pdfCerfa/pdfCerfaController");
const apiYousign = require("../../../common/apis/yousign/ApiYousign");
const config = require("../../../config");
const authMiddleware = require("../../middlewares/authMiddleware");
const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const { createYouSignWebhookToken } = require("../../../common/utils/jwtUtils");
const { DateTime } = require("luxon");

module.exports = (components) => {
  const router = express.Router();

  const { dossiers, yousign } = components;

  router.post(
    "/",
    authMiddleware(components),
    permissionsDossierMiddleware(components, ["dossier/page_signatures/signature_electronique"]),
    tryCatch(async (req, res) => {
      let { cerfaId, dossierId } = await Joi.object({
        test: Joi.boolean(),
        dossierId: Joi.string().required(),
        cerfaId: Joi.string().required(),
      })
        .unknown()
        .validateAsync(req.body, { abortEarly: false });

      const dossier = await Dossier.findById(dossierId).lean();
      if (!dossier) {
        throw Boom.notFound("Dossier Doesn't exist");
      }

      const signataires = dossier.signataires;

      if (!signataires.complete) {
        throw Boom.badRequest("Something went wrong");
      }

      const cerfa = await Cerfa.findOne({ _id: cerfaId }).lean();
      if (!cerfa) {
        throw Boom.notFound("Cerfa Doesn't exist");
      }

      const pdfBytes = await pdfCerfaController.createPdfCerfa(cerfa);

      const name = `contrat_${dossierId}.pdf`;

      let pdfBuffer = Buffer.from(pdfBytes);

      // TODO to remove after fix from Yousign, mitagation solution until 1 mai flatten pdf
      let flat = null;
      try {
        const flattener = require("pdf-flatten");
        flat = await flattener.flatten(pdfBuffer, { density: 500 });

        pdfBuffer = flat;
      } catch (error) {
        console.log(error);
      }

      const content = pdfBuffer.toString("base64");

      const resultFiles = await apiYousign.postFiles({ name, content });

      const assistanceUrl = config.publicUrl + "/assistance";

      const operationDetails = {
        operationLevel: "custom",
        operationCustomModes: ["email"],
        operationModeEmailConfig: {
          subject: `Signature du contrat d'apprentissage - ${cerfa.apprenti.prenom} ${cerfa.apprenti.nom} - Votre code confidentiel`,
          content:
            'Bonjour <tag data-tag-type="string" data-tag-name="recipient.firstname"></tag> <tag data-tag-type="string" data-tag-name="recipient.lastname"></tag>,' +
            "<br><br>" +
            `Voici votre code confidentiel afin de compléter la signature électronique du contrat d'apprentissage de ${cerfa.apprenti.prenom} ${cerfa.apprenti.nom} :` +
            "<br><br>" +
            "{{code}}" +
            "<br><br>" +
            "Cet email a été envoyé automatiquement, merci de ne pas répondre." +
            "<br><br>" +
            `Pour toutes questions relatives à la procédure de signature électronique, merci de contacter <a href="${assistanceUrl}">l'assistance</a>.` +
            "<br><br><br>" +
            "Cordialement<br>" +
            "Equipe Alternance du Ministère du Travail, du Plein Emploi et de l'Insertion",
        },
      };

      let operationDetailsAdvanced = {
        ...operationDetails,
        operationLevel: "advanced",
      };

      // On n'active pas la signature avancée en dev
      if (config.env === "dev") {
        operationDetailsAdvanced = operationDetails;
      }

      const positions = {
        employeur: "20,149,189,199", // Employeur
        apprenti: "190,149,360,199", // Apprenti(e)
        legal: "358,149,527,199", // Représentant légal de l'apprenti(e) mineur(e)
        cfa: "40,269,173,322", // Cfa
      };
      const constantFile = {
        file: resultFiles.id,
        page: 2,
      };

      const members = [
        {
          firstname: signataires.employeur.firstname,
          lastname: signataires.employeur.lastname,
          email: signataires.employeur.email,
          phone: "+33601020304",
          ...operationDetails,
          fileObjects: [
            {
              ...constantFile,
              position: positions.employeur,
            },
          ],
        },
        {
          firstname: signataires.apprenti.firstname,
          lastname: signataires.apprenti.lastname,
          email: signataires.apprenti.email,
          phone: signataires.apprenti.phone,
          ...operationDetailsAdvanced,
          fileObjects: [
            {
              ...constantFile,
              position: positions.apprenti,
            },
          ],
        },
        {
          firstname: signataires.cfa.firstname,
          lastname: signataires.cfa.lastname,
          email: signataires.cfa.email,
          phone: "+33601020304",
          ...operationDetails,
          fileObjects: [
            {
              ...constantFile,
              position: positions.cfa,
            },
          ],
        },
      ];
      if (signataires.legal) {
        members.push({
          firstname: signataires.legal.firstname,
          lastname: signataires.legal.lastname,
          email: signataires.legal.email,
          phone: signataires.legal.phone,
          ...operationDetailsAdvanced,
          fileObjects: [
            {
              ...constantFile,
              position: positions.legal,
            },
          ],
        });
      }
      const webhookJwtBearer = createYouSignWebhookToken({ payload: { dossierId } });

      // Pour tester en dev : aller sur webhook.site et remplacer cette url.
      // Récupérer le retour du webhook et l'envoyer à la PDIGI via Postman (ne pas oublier les headers, l'auth est dedans!)
      const webhookUrl =
        config.env === "dev"
          ? "https://webhook.site/bb93b16f-ac32-44f6-92a9-16b3c4291cd8"
          : `${config.publicUrl}/api/v1/sign_document/${dossierId}`;

      let webhook = {
        url: webhookUrl,
        method: "POST",
        headers: {
          "X-authorization": webhookJwtBearer,
        },
      };
      const dataToSend = {
        name: `Signature du dossier ${dossier.nom}`,
        description: `Le contrat en apprentissage de ${cerfa.apprenti.prenom} ${cerfa.apprenti.nom} pour ${cerfa.employeur.denomination}`,
        start: true,
        members,
        config: {
          email: {
            "procedure.started": [
              {
                subject: `Signature du contrat d'apprentissage - ${cerfa.apprenti.prenom} ${cerfa.apprenti.nom}`,
                message:
                  'Bonjour <tag data-tag-type="string" data-tag-name="recipient.firstname"></tag> <tag data-tag-type="string" data-tag-name="recipient.lastname"></tag>,' +
                  "<br><br>" +
                  "Vous êtes invité à signer un contrat d&apos;apprentissage via la plateform YouSign." +
                  "<br><br>" +
                  '<tag data-tag-type="button" data-tag-name="url" data-tag-title="Accéder au document">Accéder au document</tag>' +
                  "Détails du contrat: " +
                  "<br>" +
                  `- Employeur : ${cerfa.employeur.denomination}, SIRET: ${cerfa.employeur.siret}<br>` +
                  `- Apprenti(e) : ${cerfa.apprenti.prenom} ${cerfa.apprenti.nom}<br>` +
                  `- Date de début de contrat : ${DateTime.fromJSDate(cerfa.contrat.dateDebutContrat).toFormat(
                    "dd/MM/y"
                  )}<br>` +
                  `- CFA : ${cerfa.organismeFormation.denomination}` +
                  "<br><br>" +
                  "Quelles sont les prochaines étapes pour signer électroniquement le contrat ? <br>" +
                  "  1. Cliquez le contrat en cliquant sur le bouton ci-dessus<br>" +
                  "  2. Signez le contrat en utilisant votre code confidentiel que vous allez recevoir par mail de la part de yousign<br>" +
                  "  3. Joignez votre pièce d'identité (apprenti-e)" +
                  "<br><br>" +
                  "Lorsque le contrat est signé par l'ensemble des parties, et visé par le CFA, vous recevrez une notification par email." +
                  "<br><br>" +
                  `Pour toutes questions relatives à la procédure de signature électronique, merci de contacter <a href="${assistanceUrl}">l'assistance</a>.` +
                  "<br><br><br>" +
                  "Cordialement<br>" +
                  "Equipe Alternance du Ministère du Travail, du Plein Emploi et de l'Insertion",
                to: ["@members"],
              },
            ],
            "procedure.finished": [
              {
                subject: `Contrat d'apprentissage signé - ${cerfa.apprenti.prenom} ${cerfa.apprenti.nom}`,
                message:
                  `Nous vous informons que votre contrat d'apprentissage entre ${cerfa.apprenti.prenom} ${cerfa.apprenti.nom} et l'employeur ${cerfa.employeur.denomination} a été signé.` +
                  "<br><br>" +
                  "Il a été télétransmis au service administratif en charge de son instruction et de son dépôt." +
                  "<br><br>" +
                  "Vous pouvez consulter et télécharger votre contrat signé en suivant le lien ci-dessous :" +
                  "<br><br>" +
                  '<tag data-tag-type="button" data-tag-name="url" data-tag-title="Accéder au document">Consulter le document</tag>' +
                  "Ce lien restera actif pendant un mois à partir de ce jour. Nous vous invitons à télécharger et conserver votre contrat d'apprentissage dès à présent." +
                  "<br><br>" +
                  `Pour toutes questions relatives à la procédure de signature électronique, merci de contacter <a href="${assistanceUrl}">l'assistance</a>.` +
                  "<br><br><br>" +
                  "Cordialement<br>" +
                  "Equipe Alternance du Ministère du Travail, du Plein Emploi et de l'Insertion",
                to: ["@members"],
              },
            ],
            "procedure.refused": [
              {
                subject: `Signature du contrat d'apprentissage - ${cerfa.apprenti.prenom} ${cerfa.apprenti.nom} - Refus de signature`,
                message:
                  "La procédure de signature électronique n'a pas abouti. Vous pouvez consulter la procédure concernée et le motif en cliquant sur le lien ci-dessous :" +
                  "<br><br>" +
                  '<tag data-tag-type="button" data-tag-name="url" data-tag-title="Accéder au document">Consulter le document</tag>' +
                  "Cordialement<br>" +
                  "Equipe Alternance du Ministère du Travail, du Plein Emploi et de l'Insertion",
                to: ["@members"],
              },
            ],
          },
          webhook: {
            "member.finished": [webhook],
            "procedure.finished": [webhook],
            "procedure.refused": [webhook],
          },
        },
      };
      const resultProcedures = await apiYousign.postProcedures(dataToSend);

      await dossiers.updateEtatDossier(dossierId, "EN_ATTENTE_SIGNATURES");
      await dossiers.updateSignatures(dossierId, { procedure: resultProcedures });

      return res.json({ success: true });
    })
  );

  passport.use(
    "jwt-yousign-webhook",
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromHeader("x-authorization"),
        secretOrKey: config.auth.youSignWebhook.jwtSecret,
        passReqToCallback: true,
      },
      (req, jwt_payload, done) => {
        if (jwt_payload.dossierId === req.params.id) {
          done(null, true);
        } else {
          done(new Error("Unauthorized"));
        }
      }
    )
  );

  router.post(
    "/:id",
    passport.authenticate("jwt-yousign-webhook", { session: false, failWithError: true }),
    // eslint-disable-next-line no-unused-vars
    tryCatch(async ({ body, params, user }, res) => {
      await yousign.handleRetourYouSign({ body, params });

      res.json({});
    })
  );

  return router;
};
