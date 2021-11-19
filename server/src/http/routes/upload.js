const express = require("express");
const multer = require("multer");
const { mkdirp, move } = require("fs-extra");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const path = require("path");
const logger = require("../../common/logger");

module.exports = () => {
  const router = express.Router();

  const UPLOAD_DIR = "/data/uploads";

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      mkdirp(UPLOAD_DIR, (err) => cb(err, UPLOAD_DIR));
    },
    filename: function (req, file, cb) {
      cb(null, `tmp-${file.originalname}`);
    },
  });

  const upload = multer({ storage: storage }).single("file");

  router.post(
    "/",
    tryCatch(async (req, res) => {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(500).json(err);
        }

        const src = path.join(UPLOAD_DIR, `tmp-${req.file.originalname}`);
        const dest = path.join(UPLOAD_DIR, req.file.originalname);

        let callback;

        switch (req.file.originalname) {
          case "testFile.pdf": {
            // TODO implement
            try {
              // SOME TESTS
              // return res.status(400).json({
              //   error: `Erreur`,
              // });
            } catch (e) {
              logger.error(e);
              // return res.status(400).json({
              //   error: `Erreur`,
              // });
            }
            break;
          }
          default:
            return res.status(400).json({ error: `Le type de fichier est invalide` });
        }

        // success, move the file
        await move(src, dest, { overwrite: true }, (err) => {
          if (err) return logger.error(err);

          // launch cb if any
          callback?.();
        });

        return res.status(200).send(req.file);
      });
    })
  );

  return router;
};
