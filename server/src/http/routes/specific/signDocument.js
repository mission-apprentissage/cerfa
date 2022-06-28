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

      const operationDetails = {
        operationLevel: "custom",
        operationCustomModes: ["email"],
        // operationModeSmsConfig: {
        //   content: `eSIGNATURE - {{code}} est le code pour signer le contrat ${dossier.nom}.`,
        // },
      };

      // On active la signature avancée uniquement en production
      let operationDetailsAdvanced = {
        operationLevel: "advanced",
      };
      if (config.env !== "production") {
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
          phone: "+33601020304",
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
          phone: "+33601020304",
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
      const dataToSend = {
        name: `Signature du dossier ${dossier.nom}`,
        description: `Le contrat en apprentissage de ${cerfa.apprenti.prenom} ${cerfa.apprenti.nom} pour ${cerfa.employeur.denomination}`,
        start: true,
        members,
        config: {
          email: {
            "procedure.started": [
              {
                subject: `Vous avez été invité à signer un contrat`,
                message:
                  'Bonjour <tag data-tag-type="string" data-tag-name="recipient.firstname"></tag> <tag data-tag-type="string" data-tag-name="recipient.lastname"></tag>, <br><br> Vous avez été invité à signer un contrat en apprentissage, merci de cliquer sur le boutton suivant pour y accéder: <br><br> <tag data-tag-type="button" data-tag-name="url" data-tag-title="Accéder au document">Accéder au document</tag>',
                to: ["@members"],
              },
            ],
          },
          webhook: {
            "member.finished": [
              {
                // Pour tester en dev : aller sur webhook.site et remplacer cette url.
                // Récupérer le retour du webhook et l'envoyer à la PDIGI via Postman (ne pas oublier les headers, l'auth est dedans!)
                // Le faire pour les 2 webhooks ci-dessous
                // url: "https://webhook.site/bb93b16f-ac32-44f6-92a9-16b3c4291cd8",
                url: `${config.publicUrl}/api/v1/sign_document/${dossierId}`,
                method: "POST",
                headers: {
                  "X-authorization": webhookJwtBearer,
                },
              },
            ],
            "procedure.finished": [
              {
                // url: "https://webhook.site/bb93b16f-ac32-44f6-92a9-16b3c4291cd8",
                url: `${config.publicUrl}/api/v1/sign_document/${dossierId}`,
                method: "POST",
                headers: {
                  "X-authorization": webhookJwtBearer,
                },
              },
            ],
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
