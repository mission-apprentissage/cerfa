const express = require("express");
const { MaitreApprentissage } = require("../../common/model/index");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const PdfUtils = require("../../common/utils/pdf/pdfUtils");

module.exports = () => {
  const router = express.Router();
  router.get("/maitreApprentissage", async (req, res) => {
    const result = await MaitreApprentissage.find({});
    PdfUtils();
    return res.json(result);
  });

  router.post(
    "/maitreApprentissage",
    tryCatch(async ({ body }, res) => {
      const { nom, prenom, dateNaissance } = body;

      const newMaitreApprentissage = new MaitreApprentissage({
        nom,
        prenom,
        dateNaissance,
        time: new Date(),
      });
      await newMaitreApprentissage.save();

      return res.json(newMaitreApprentissage);
    })
  );

  return router;
};
