if (process.env.NEXT_PUBLIC_ENV === "production") {
  // use minified verion for production
  module.exports = require("pdfjs-dist/build/pdf.worker.min.js");
} else {
  module.exports = require("pdfjs-dist/build/pdf.worker.js");
}
