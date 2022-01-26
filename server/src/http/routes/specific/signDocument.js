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
const pageAccessMiddleware = require("../../middlewares/pageAccessMiddleware");

module.exports = (components) => {
  const router = express.Router();

  const { dossiers } = components;

  router.post(
    "/",
    authMiddleware(components),
    pageAccessMiddleware(["signature_beta"]),
    permissionsDossierMiddleware(components, ["dossier/page_signatures/signer"]),
    tryCatch(async (req, res) => {
      let { cerfaId, dossierId } = await Joi.object({
        dossierId: Joi.string().required(),
        cerfaId: Joi.string().required(),
      })
        .unknown()
        .validateAsync(req.body, { abortEarly: false });

      const dossier = await Dossier.findById(dossierId).lean();
      if (!dossier) {
        throw Boom.notFound("Dossier Doesn't exist");
      }

      const cerfa = await Cerfa.findOne({ _id: cerfaId }).lean();
      if (!cerfa) {
        throw Boom.notFound("Cerfa Doesn't exist");
      }

      const pdfBytes = await pdfCerfaController.createPdfCerfa(cerfa);

      const name = `contrat_${dossierId}.pdf`;
      const content = Buffer.from(pdfBytes).toString("base64");

      const resultFiles = await apiYousign.postFiles({ name, content });
      console.log(resultFiles);

      const resultProcedures = await apiYousign.postProcedures({
        name: `Signature du dossier ${dossier.nom}`,
        description: `Le contrat en apprentissage de .... pour .....`,
        start: true,
        members: [
          // {
          //   firstname: "Employeur",
          //   lastname: "Bigard",
          //   email: "antoine.bigard+testEmployeur@beta.gouv.fr",
          //   phone: "+33612647513",
          //   operationLevel: "custom",
          //   operationCustomModes: ["sms"],
          //   operationModeSmsConfig: {
          //     content: `eSIGNATURE - {{code}} est le code pour signer le contrat ${dossier.nom}.`,
          //   },
          //   fileObjects: [
          //     {
          //       file: resultFiles.id,
          //       page: 2,
          //       position: "20,149,189,199", // Employeur
          //       // position: "190,149,360,199", // Apprenti(e)
          //       // position: "358,149,527,199", // Représentant légal de l'apprenti(e) mineur(e)
          //       // position: "40,269,173,322", // Cfa
          //       // mention: "",
          //       // mention2: "",
          //     },
          //   ],
          // },
          {
            firstname: "Apprenti",
            lastname: "Bigard",
            email: "antoine.bigard+testApprenti@beta.gouv.fr",
            phone: "+33612647513",
            operationLevel: "custom",
            operationCustomModes: ["sms"],
            operationModeSmsConfig: {
              content: `eSIGNATURE - {{code}} est le code pour signer le contrat ${dossier.nom}.`,
            },
            fileObjects: [
              {
                file: resultFiles.id,
                page: 2,
                // position: "20,149,189,199", // Employeur
                position: "190,149,360,199", // Apprenti(e)
                // position: "358,149,527,199", // Représentant légal de l'apprenti(e) mineur(e)
                // position: "40,269,173,322", // Cfa
                // mention: "",
                // mention2: "",
              },
            ],
          },
          // {
          //   firstname: "Legal",
          //   lastname: "Bigard",
          //   email: "antoine.bigard+testLegal@beta.gouv.fr",
          //   phone: "+33612647513",
          //   operationLevel: "custom",
          //   operationCustomModes: ["sms"],
          //   operationModeSmsConfig: {
          //     content: `eSIGNATURE - {{code}} est le code pour signer le contrat ${dossier.nom}.`,
          //   },
          //   fileObjects: [
          //     {
          //       file: resultFiles.id,
          //       page: 2,
          //       // position: "20,149,189,199", // Employeur
          //       // position: "190,149,360,199", // Apprenti(e)
          //       position: "358,149,527,199", // Représentant légal de l'apprenti(e) mineur(e)
          //       // position: "40,269,173,322", // Cfa
          //       // mention: "",
          //       // mention2: "",
          //     },
          //   ],
          // },
          // {
          //   firstname: "Cfa",
          //   lastname: "Bigard",
          //   email: "antoine.bigard+testCfa@beta.gouv.fr",
          //   phone: "+33612647513",
          //   operationLevel: "custom",
          //   operationCustomModes: ["sms"],
          //   operationModeSmsConfig: {
          //     content: `eSIGNATURE - {{code}} est le code pour signer le contrat ${dossier.nom}.`,
          //   },
          //   fileObjects: [
          //     {
          //       file: resultFiles.id,
          //       page: 2,
          //       // position: "20,149,189,199", // Employeur
          //       // position: "190,149,360,199", // Apprenti(e)
          //       // position: "358,149,527,199", // Représentant légal de l'apprenti(e) mineur(e)
          //       position: "40,269,173,322", // Cfa
          //       // mention: "",
          //       // mention2: "",
          //     },
          //   ],
          // },
        ],
        config: {
          email: {
            "member.started": [
              {
                subject: `Vous avez été invité à signer un contrat`,
                message:
                  'Hello <tag data-tag-type="string" data-tag-name="recipient.firstname"></tag> <tag data-tag-type="string" data-tag-name="recipient.lastname"></tag>, <br><br> Vous avez été invité à signer un contrat en apprentissage, merci de cliquer sur le boutton suivant pour y accéder: <tag data-tag-type="button" data-tag-name="url" data-tag-title="Accéder au document">Accéder au document</tag>',
                to: ["@member"],
              },
            ],
            "procedure.started": [
              {
                subject: `Vous avez été invité à signer un contrat`,
                message:
                  'Hello <tag data-tag-type="string" data-tag-name="recipient.firstname"></tag> <tag data-tag-type="string" data-tag-name="recipient.lastname"></tag>, <br><br> Vous avez été invité à signer un contrat en apprentissage, merci de cliquer sur le boutton suivant pour y accéder: <tag data-tag-type="button" data-tag-name="url" data-tag-title="Accéder au document">Accéder au document</tag>',
                to: ["@member"],
              },
            ],
          },
          webhook: {
            "procedure.finished": [
              {
                url: `${config.publicUrl}/api/v1/sign_document/${dossierId}`,
                method: "GET",
                // headers: {
                //   "X-Custom-Header": "Yousign Webhook - Test value",
                // },
              },
            ],
          },
        },
      });

      await dossiers.updateEtatDossier(dossierId, "EN_ATTENTE_SIGNATURES");
      await dossiers.updateSignatures(dossierId, {
        ...resultProcedures,
        webhook: {
          "procedure.finished": [
            {
              url: `${config.publicUrl}/api/v1/sign_document/${dossierId}`,
              method: "GET",
              // headers: {
              //   "X-Custom-Header": "Yousign Webhook - Test value",
              // },
            },
          ],
        },
      });

      return res.json(resultProcedures);
    })
  );

  // TODO SECURE
  router.get(
    "/:id",
    tryCatch(async ({ params }, res) => {
      const dossier = await dossiers.findDossierById(params.id);
      if (!dossier) {
        throw Boom.notFound("Doesn't exist");
      }

      await dossiers.updateEtatDossier(params.id, "SIGNE");
      // TODO GET DOCUMENT

      res.json({});
    })
  );

  return router;
};
