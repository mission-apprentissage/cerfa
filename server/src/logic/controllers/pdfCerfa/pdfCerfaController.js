const fs = require("fs");
const path = require("path");
const PdfUtils = require("./utils/pdfUtils");

let PATH_EMPTY_CERFA_PDF = path.join(__dirname, "../../assets/cerfa_pdf_empty.pdf");
class PdfCerfaController {
  constructor() {}

  async createPdfCerfa(cerfa) {
    const pdfCerfaEmpty = fs.readFileSync(PATH_EMPTY_CERFA_PDF);

    const pdfCerfaFilled = await PdfUtils(pdfCerfaEmpty, cerfa);

    // TODO destination
    fs.writeFileSync(__dirname + "/test.pdf", pdfCerfaFilled, { encoding: "base64" });

    return true;
  }

  async getBase64File() {
    return fs.readFileSync(PATH_EMPTY_CERFA_PDF, { encoding: "base64" });
  }
}

const pdfCerfaController = new PdfCerfaController();
module.exports = pdfCerfaController;
