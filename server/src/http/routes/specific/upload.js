const express = require("express");
const Joi = require("joi");
const { createWriteStream } = require("fs");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const { getFromStorage, uploadToStorage, deleteFromStorage } = require("../../../common/utils/ovhUtils");
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

  function handlePDFMultipartForm(req, res, dossierId, callback) {
    let form = new multiparty.Form();
    const formEvents = new EventEmitter();
    // 'close' event is fired just after the form has been read but before file is scanned and uploaded to storage.
    // So instead of using form.on('close',...) we use a custom event to end response when everything is finished
    formEvents.on("terminated", async (e) => {
      if (e)
        return res.status(400).json({
          error:
            e.message === "Le fichier est trop volumineux"
              ? "Le fichier est trop volumineux"
              : "Le contenu du fichier est invalide",
        });
      const documents = await dossiers.getDocuments(dossierId);
      return res.json({ documents });
    });

    form.on("error", () => {
      return res.status(400).json({ error: "Le contenu du fichier est invalide" });
    });
    form.on("part", async (part) => {
      if (part.headers["content-type"] !== "application/pdf") {
        form.emit("error", new Error("Le fichier n'est pas au bon format"));
        return part.pipe(discard());
      }

      if (!part.filename.endsWith(".pdf")) {
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
      let { dossierId } = await Joi.object({
        dossierId: Joi.string().required(),
      })
        .unknown()
        .validateAsync(req.query, { abortEarly: false });

      handlePDFMultipartForm(req, res, dossierId, async (part) => {
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

        if (part.byteCount > 10485760) {
          throw new Error("Le fichier est trop volumineux");
        }

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
          tailleFichier: test ? 0 : part.byteCount,
          userEmail: req.user.email,
        });
      });
    })
  );

  router.get(
    "/",
    permissionsDossierMiddleware(components, ["dossier/page_documents"]),
    tryCatch(async (req, res) => {
      let { dossierId, path, name } = await Joi.object({
        dossierId: Joi.string().required(),
        path: Joi.string().required(),
        name: Joi.string().required(),
      }).validateAsync(req.query, { abortEarly: false });

      const document = await dossiers.getDocument(dossierId, name, path);

      const stream = await getFromStorage(document.cheminFichier);
      // console.log(stream);
      await oleoduc(stream, crypto.available() ? crypto.decipher(dossierId) : noop(), res);

      // const buff = Buffer.from(stream.buffer, "binary");
      // res.header("Content-Type", "application/pdf");
      // res.header("Content-Disposition", `attachment; filename=${name}.pdf`);
      // res.header("Content-Length", buff.length);
      // res.status(200);
      // res.type("pdf");

      // return res.send(buff);
      // return res.json({});
    })
  );

  router.delete(
    "/",
    permissionsDossierMiddleware(components, ["dossier/page_documents/ajouter_un_document"]),
    tryCatch(async (req, res) => {
      let { dossierId, typeDocument, nomFichier, cheminFichier, tailleFichier } = await Joi.object({
        dossierId: Joi.string().required(),
        tailleFichier: Joi.string().required(),
        cheminFichier: Joi.string().required(),
        nomFichier: Joi.string().required(),
        typeDocument: Joi.string()
          .valid(
            "CONVENTION_FORMATION",
            "CONVENTION_REDUCTION_DUREE",
            "CONVENTION_MOBILITE",
            "FACTURE",
            "CERTIFICAT_REALISATION"
          )
          .required(),
      })
        .unknown()
        .validateAsync(req.query, { abortEarly: false });

      await dossiers.removeDocument(dossierId, {
        typeDocument,
        nomFichier,
        cheminFichier,
        tailleFichier,
      });

      await deleteFromStorage(cheminFichier);

      const documents = await dossiers.getDocuments(dossierId);
      return res.json({ documents });
    })
  );

  return router;
};
