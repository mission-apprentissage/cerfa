const express = require("express");
const Joi = require("joi");
const { createWriteStream } = require("fs");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const { oleoduc, writeData, accumulateData } = require("oleoduc");
const multiparty = require("multiparty");
const { EventEmitter } = require("events");
const { PassThrough } = require("stream");
const logger = require("../../../common/logger");
const permissionsDossierMiddleware = require("../../middlewares/permissionsDossierMiddleware");
const { getS3ObjectAsStream, putS3Object, deleteS3Object } = require("../../../common/utils/S3Utils");
const config = require("../../../config");

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
      if (e) {
        logger.error(e);
        return res.status(400).json({
          error:
            e.message === "Le fichier est trop volumineux"
              ? "Le fichier est trop volumineux"
              : "Le contenu du fichier est invalide",
        });
      }
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

        let path = `contrats/${dossierId}/${part.filename}`;
        let { scanStream, getScanResults } = await clamav.getScanner();
        let { hashStream, getHash } = crypto.checksum();

        await oleoduc(
          part,
          config.env !== "local" ? scanStream : noop(),
          hashStream,
          crypto.isCipherAvailable() ? crypto.cipher(dossierId) : noop(),
          config.storageType === "s3"
            ? accumulateData(
                (acc, value) => {
                  return Buffer.concat([acc, Buffer.from(value)]);
                },
                { accumulator: Buffer.from(new Uint8Array()) }
              )
            : noop(),
          test
            ? noop()
            : writeData((data) => {
                return putS3Object(data, path);
              })
        );

        if (part.byteCount > 10485760) {
          throw new Error("Le fichier est trop volumineux");
        }

        if (config.env !== "local") {
          let { isInfected, viruses } = await getScanResults();
          if (isInfected) {
            if (!test) {
              logger.error(`Uploaded file ${path} is infected by ${viruses.join(",")}. Deleting file from storage...`);
              await deleteS3Object(path);
            }
            throw new Error("Le contenu du fichier est invalide");
          }
        }

        let hash = await getHash();

        await dossiers.addDocument(dossierId, {
          typeDocument,
          hash,
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

      const stream = await getS3ObjectAsStream(document.cheminFichier);

      res.header("Content-Type", "application/pdf");
      res.header("Content-Disposition", `attachment; filename=${document.nomFichier}`);
      res.header("Content-Length", document.tailleFichier);
      res.status(200);
      res.type("pdf");

      await oleoduc(stream, crypto.isCipherAvailable() ? crypto.decipher(dossierId) : noop(), res);
    })
  );

  router.delete(
    "/",
    permissionsDossierMiddleware(components, ["dossier/page_documents/supprimer_un_document"]),
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

      if (config.storageType === "s3") {
        await deleteS3Object(cheminFichier);
      } else {
        await deleteFromStorage(cheminFichier);
      }

      const documents = await dossiers.getDocuments(dossierId);
      return res.json({ documents });
    })
  );

  return router;
};
