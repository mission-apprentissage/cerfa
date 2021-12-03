const pdfCerfaController = require("../controllers/pdfCerfa/pdfCerfaController");
const { Cerfa } = require("../../common/model/index");

// eslint-disable-next-line no-unused-vars
const pdfCerfaHandler = async (cerfaId) => {
  // TODO find Cerfa by id cerfaId
  const cerfa = await Cerfa.findOne({ dossierId: "619baec6fcdd030ba4e13c40" }).lean();

  await pdfCerfaController.createPdfCerfa(cerfa);

  return {
    success: true,
  };
};
module.exports.pdfCerfaHandler = pdfCerfaHandler;
