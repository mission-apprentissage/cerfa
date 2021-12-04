const express = require("express");
const Joi = require("joi");
const Boom = require("boom");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const { Dossier, Cerfa } = require("../../../common/model/index");
const pdfCerfaController = require("../../../logic/controllers/pdfCerfa/pdfCerfaController");
const apiYousign = require("../../../common/apis/yousign/ApiYousign");

module.exports = () => {
  const router = express.Router();

  router.post(
    "/",
    tryCatch(async (req, res) => {
      let { cerfaId, dossierId } = await Joi.object({
        dossierId: Joi.string().required(),
        cerfaId: Joi.string().required(),
      })
        .unknown()
        .validateAsync(req.body, { abortEarly: false });
      // TODO HAS RIGHTS

      const dossier = await Dossier.findById(dossierId).lean();
      if (!dossier) {
        throw Boom.notFound("Dossier Doesn't exist");
      }

      const cerfa = await Cerfa.findOne({ _id: cerfaId }).lean();

      if (!cerfa) {
        throw Boom.notFound("Cerfa Doesn't exist");
      }
      // TODO HAS RIGHTS

      const pdfBytes = await pdfCerfaController.createPdfCerfa(cerfa);

      const name = `contrat_${cerfaId}.pdf`;
      const content = Buffer.from(pdfBytes).toString("base64");

      const resultFiles = await apiYousign.postFiles({ name, content });
      console.log(resultFiles);

      const resultProcedures = await apiYousign.postProcedures({
        name: `Signature du dossier ${dossier}`,
        description: `Le contrat en apprentissage de .... pour .....`,
        members: [
          {
            firstname: "Antoine",
            lastname: "Bigard",
            email: "antoine.bigard@beta.gouv.fr",
            phone: "+33612647513",
            fileObjects: [
              {
                file: resultFiles.id,
                page: 2,
                position: "20,149,189,199", // Employeur
                // position: "190,149,360,199", // Apprenti(e)
                // position: "358,149,527,199", // Représentant légal de l'apprenti(e) mineur(e)
                // mention: "",
                // mention2: "",
              },
            ],
          },
        ],
      });

      console.log(resultProcedures);

      return res.json({ sucess: true });
    })
  );

  return router;
};
