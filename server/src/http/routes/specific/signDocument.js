const express = require("express");
// const Joi = require("joi");
// const Boom = require("boom");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const pdfCerfaController = require("../../../logic/controllers/pdfCerfa/pdfCerfaController");
const apiYousign = require("../../../common/apis/yousign/ApiYousign");

module.exports = () => {
  const router = express.Router();

  router.post(
    "/",
    tryCatch(async (req, res) => {
      // TODO HAS RIGHTS

      const name = "cerfa_pdf_empty.pdf";
      const content = await pdfCerfaController.getBase64File();

      const resultFiles = await apiYousign.postFiles({ name, content });
      console.log(resultFiles);

      const resultProcedures = await apiYousign.postProcedures({
        name: "My first procedure",
        description: "Awesome! Here is the description of my first procedure",
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
                // position: "20,149,189,199", // Employeur
                // position: "190,149,360,199", // Apprenti(e)
                position: "358,149,527,199", // Représentant légal de l'apprenti(e) mineur(e)
                // mention: "",
                // mention2: "",
              },
            ],
          },
        ],
      });

      console.log(resultProcedures);

      return res.json({});
    })
  );

  return router;
};
