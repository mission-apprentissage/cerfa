const express = require("express");
const Joi = require("joi");
const Boom = require("boom");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const permissionsDossierMiddleware = require("../../middlewares/permissionsDossierMiddleware");
const { Dossier, Cerfa } = require("../../../common/model/index");
// const pdfCerfaController = require("../../../logic/controllers/pdfCerfa/pdfCerfaController");
const apiYousign = require("../../../common/apis/yousign/ApiYousign");
// const config = require("../../../config");
const authMiddleware = require("../../middlewares/authMiddleware");
const pageAccessMiddleware = require("../../middlewares/pageAccessMiddleware");
const { uploadToStorage } = require("../../../common/utils/ovhUtils");
const { oleoduc } = require("oleoduc");
const { PassThrough } = require("stream");

function noop() {
  return new PassThrough();
}

module.exports = (components) => {
  const router = express.Router();

  const { dossiers, crypto } = components;

  router.post(
    "/",
    authMiddleware(components),
    pageAccessMiddleware(["signature_beta"]),
    permissionsDossierMiddleware(components, ["dossier/page_signatures/signer"]),
    tryCatch(async (req, res) => {
      let { cerfaId, dossierId, test } = await Joi.object({
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

      const cerfa = await Cerfa.findOne({ _id: cerfaId }).lean();
      if (!cerfa) {
        throw Boom.notFound("Cerfa Doesn't exist");
      }

      // const pdfBytes = await pdfCerfaController.createPdfCerfa(cerfa);

      // const name = `contrat_${dossierId}.pdf`;
      // const content = Buffer.from(pdfBytes).toString("base64");

      // const resultFiles = await apiYousign.postFiles({ name, content });

      // const operationDetails = {
      //   operationLevel: "custom",
      //   operationCustomModes: ["sms"],
      //   operationModeSmsConfig: {
      //     content: `eSIGNATURE - {{code}} est le code pour signer le contrat ${dossier.nom}.`,
      //   },
      // };
      // const positions = {
      //   employeur: "20,149,189,199", // Employeur
      //   apprenti: "190,149,360,199", // Apprenti(e)
      //   legal: "358,149,527,199", // Représentant légal de l'apprenti(e) mineur(e)
      //   cfa: "40,269,173,322", // Cfa
      // };
      // const constantFile = {
      //   file: resultFiles.id,
      //   page: 2,
      // };

      // const resultProcedures = await apiYousign.postProcedures({
      //   name: `Signature du dossier ${dossier.nom}`,
      //   description: `Le contrat en apprentissage de ${cerfa.apprenti.prenom} ${cerfa.apprenti.nom} pour ${cerfa.employeur.denomination}`,
      //   start: true,
      //   members: [
      //     // {
      //     //   firstname: "Employeur",
      //     //   lastname: "Bigard",
      //     //   email: "antoine.bigard+testEmployeur@beta.gouv.fr",
      //     //   phone: "+33612647513",
      //     //   ...operationDetails,
      //     //   fileObjects: [
      //     //     {
      //     //       ...constantFile,
      //     //       position: positions.employeur,
      //     //     },
      //     //   ],
      //     // },
      //     {
      //       firstname: "Apprenti",
      //       lastname: "Bigard",
      //       email: "antoine.bigard@beta.gouv.fr", // +testApprenti
      //       phone: "+33612647513",
      //       ...operationDetails,
      //       fileObjects: [
      //         {
      //           ...constantFile,
      //           position: positions.apprenti,
      //         },
      //       ],
      //     },
      //     // {
      //     //   firstname: "Legal",
      //     //   lastname: "Bigard",
      //     //   email: "antoine.bigard+testLegal@beta.gouv.fr",
      //     //   phone: "+33612647513",
      //     //   ...operationDetails,
      //     //   fileObjects: [
      //     //     {
      //     //       ...constantFile,
      //     //       position: positions.legal,
      //     //     },
      //     //   ],
      //     // },
      //     {
      //       firstname: "Cfa",
      //       lastname: "Bigard",
      //       email: "antoine.bigard@beta.gouv.fr", // +testCfa
      //       phone: "+33612647513",
      //       ...operationDetails,
      //       fileObjects: [
      //         {
      //           ...constantFile,
      //           position: positions.cfa,
      //         },
      //       ],
      //     },
      //   ],
      //   config: {
      //     email: {
      //       "procedure.started": [
      //         {
      //           subject: `Vous avez été invité à signer un contrat`,
      //           message:
      //             'Bonjour <tag data-tag-type="string" data-tag-name="recipient.firstname"></tag> <tag data-tag-type="string" data-tag-name="recipient.lastname"></tag>, <br><br> Vous avez été invité à signer un contrat en apprentissage, merci de cliquer sur le boutton suivant pour y accéder: <br><br> <tag data-tag-type="button" data-tag-name="url" data-tag-title="Accéder au document">Accéder au document</tag>',
      //           to: ["@members"],
      //         },
      //       ],
      //     },
      //     // webhook: {
      //     //   "procedure.finished": [
      //     //     {
      //     //       url: `${config.publicUrl}/api/v1/sign_document/${dossierId}`,
      //     //       method: "POST",
      //     //       // headers: {
      //     //       //   "X-Custom-Header": "Yousign Webhook - Test value",
      //     //       // },
      //     //     },
      //     //   ],
      //     //   "member.finished": [
      //     //     {
      //     //       url: `${config.publicUrl}/api/v1/sign_document/${dossierId}`,
      //     //       method: "POST",
      //     //       // "headers": {
      //     //       //   "X-Custom-Header": "Yousign Webhook - Test value"
      //     //       // }
      //     //     },
      //     //   ],
      //     // },
      //   },
      // });

      // await dossiers.updateEtatDossier(dossierId, "EN_ATTENTE_SIGNATURES");
      // await dossiers.updateSignatures(dossierId, resultProcedures);

      // const file = await apiYousign.getFile("dfa5ffd0-b6b8-4fe6-bd6c-5836ac03060f");
      // console.log(file);
      // createRequestStream(url, {
      //   method: "GET",
      //   headers: {
      //     Accept: "application/json",
      //   },
      // })

      let { hashStream, getHash } = crypto.checksum();
      let filename = "contrat_61ef0eaeb24e2604944cad32.pdf";
      let path = `contrats/${dossierId}/${filename}`;

      await oleoduc(
        await apiYousign.getFile("dfa5ffd0-b6b8-4fe6-bd6c-5836ac03060f"),
        hashStream,
        crypto.isCipherAvailable() ? crypto.cipher(dossierId) : noop(),
        test ? noop() : await uploadToStorage(path, { contentType: "application/pdf" })
      );

      let hash = await getHash();

      await dossiers.addDocument(dossierId, {
        typeDocument: "CONTRAT",
        hash,
        nomFichier: filename,
        cheminFichier: path,
        tailleFichier: 0,
        userEmail: req.user.email,
      });

      return res.json({ success: true });
    })
  );

  // TODO SECURE
  router.post(
    "/:id",
    tryCatch(async ({ body, params }, res) => {
      const dossier = await dossiers.findDossierById(params.id);
      if (!dossier) {
        throw Boom.notFound("Doesn't exist");
      }

      // dossier.files[0].id
      await dossiers.updateSignatures(params.id, body);
      // TODO GET DOCUMENT

      if (body.status === "finished") {
        await dossiers.updateEtatDossier(params.id, "SIGNE");
      }

      res.json({});
    })
  );

  return router;
};
