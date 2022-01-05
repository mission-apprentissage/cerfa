const express = require("express");
const Joi = require("joi");
const { createWriteStream } = require("fs");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const { uploadToStorage, deleteFromStorage } = require("../../../common/utils/ovhUtils");
const { oleoduc } = require("oleoduc");
const multiparty = require("multiparty");
const { EventEmitter } = require("events");
const { PassThrough } = require("stream");
const logger = require("../../../common/logger");
const permissionsDossierMiddleware = require("../../middlewares/permissionsDossierMiddleware");

function discard() {
  return createWriteStream("/dev/null");
}

function noop() {
  return new PassThrough();
}

module.exports = (components) => {
  const router = express.Router();

  const { clamav, crypto, dossiers } = components;

  function handlePDFMultipartForm(req, res, callback) {
    let form = new multiparty.Form();
    const formEvents = new EventEmitter();
    // 'close' event is fired just after the form has been read but before file is scanned and uploaded to storage.
    // So instead of using form.on('close',...) we use a custom event to end response when everything is finished
    formEvents.on("terminated", (e) => (e ? res.status(400).json({ error: e.message }) : res.json({})));

    form.on("error", (e) => {
      return res.status(400).json({ error: e.message || "Une erreur est survenue lors de l'envoi du fichier" });
    });
    form.on("part", async (part) => {
      if (part.headers["content-type"] !== "application/pdf") {
        form.emit("error", new Error("Le fichier n'est pas au bon format"));
        return part.pipe(discard());
      }

      callback(part)
        .then(() => {
          if (!form.bytesExpected || form.bytesReceived === form.bytesExpected) {
            formEvents.emit("terminated");
          }
          part.resume();
        })
        .catch((e) => {
          formEvents.emit("terminated", e);
        });
    });

    form.parse(req);
  }

  router.post(
    "/",
    permissionsDossierMiddleware(components, ["dossier/page_documents/ajouter_un_document"]),
    tryCatch(async (req, res) => {
      // TODO add size limitations
      handlePDFMultipartForm(req, res, async (part) => {
        let { test, dossierId, typeDocument } = await Joi.object({
          test: Joi.boolean(),
          dossierId: Joi.string().required(),
          typeDocument: Joi.string()
            .valid(
              "CONVENTION_FORMATION",
              "CONVENTION_REDUCTION_DUREE",
              "CONVENTION_MOBILITE",
              "FACTURE",
              "CERTIFICAT_REALISATION"
            )
            .required(),
        }).validateAsync(req.query, { abortEarly: false });

        let contratId = dossierId;
        let path = `contrats/${contratId}/${part.filename}`;
        let scanner = await clamav.getScanner();

        await oleoduc(
          part,
          scanner.scanStream,
          crypto.available() ? crypto.cipher(contratId) : noop(),
          test ? noop() : await uploadToStorage(path, { contentType: part.headers["content-type"] })
        );

        let { isInfected, viruses } = await scanner.getScanResults();
        if (isInfected) {
          if (!test) {
            logger.error(`Uploaded file ${path} is infected by ${viruses.join(",")}. Deleting file from storage...`);
            await deleteFromStorage(path);
          }
          throw new Error("Le contenu du fichier est invalide");
        }
        await dossiers.addDocument(dossierId, {
          typeDocument,
          nomFichier: part.filename,
          cheminFichier: path,
          userEmail: req.user.email,
        });
      });
    })
  );

  return router;
};
