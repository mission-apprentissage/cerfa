const express = require("express");
const config = require("../../../config");
const mongoose = require("mongoose");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const { putObjectIntoStorage } = require("../../../common/utils/ovhUtils");
const { compose } = require("oleoduc");
const multiparty = require("multiparty");
const { cipher } = require("../../../common/utils/cryptoUtils");

module.exports = () => {
  const router = express.Router();
  const encryptionKey = config.ovh.storage.encryptionKey;

  /**
   * FIXME Fake implementation
   * @returns {*}
   */
  function getContratIdForUser() {
    return mongoose.Types.ObjectId().toString();
  }

  router.post(
    "/",
    tryCatch(async (req, res) => {
      // TODO HAS RIGHTS

      let contratId = getContratIdForUser();

      let form = new multiparty.Form();
      form.on("close", () => res.json({}));
      form.on("error", (e) => {
        return res.status(400).json({ error: e.message || "Une erreur est survenue lors de l'envoi du fichier" });
      });
      form.on("part", async (part) => {
        if (part.headers["content-type"] !== "application/pdf") {
          form.emit("error", new Error("Le fichier n'est pas au bon format"));
        }

        let encryptedStream = compose(part, cipher(encryptionKey, contratId));
        await putObjectIntoStorage(`contrats/${contratId}/${part.filename}`, encryptedStream, {
          contentType: part.headers["content-type"],
        });

        part.resume();
      });

      form.parse(req);
    })
  );

  return router;
};
