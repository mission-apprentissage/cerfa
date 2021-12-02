const { PDFDocument, rgb, grayscale } = require("pdf-lib");
const { spaced } = require("./spacingUtils");

const fieldsPositions = {
  employeur: {
    denomination: {
      x: 28,
      y: 685,
      r: 0,
    },
  },
};

const buildFieldDraw = (value, position) => {
  const parts = value.split(" ");
  // TODO
  console.log(parts);

  return [{ title: value, ...position }];
};

module.exports = async (pdfCerfaEmpty, cerfa) => {
  const pdfDoc = await PDFDocument.load(pdfCerfaEmpty);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const secondPage = pages[1];
  const pdfPageOneArray = [
    { title: "X", x: 413, y: 732, r: 1 },

    //TODO EMPLOYEUR
    { title: "X", x: 233, y: 713, r: 1 },
    { title: "X", x: 391, y: 713, r: 1 },
    ...buildFieldDraw(cerfa.employeur.denomination, fieldsPositions.employeur.denomination),
    // { title: "s", x: 110, y: 685, r: 2, cases: 13 },
    { title: "122", x: 50, y: 649, r: 2 },
    { title: "3", x: 155, y: 649, r: 2 },
    { title: "4", x: 100, y: 630, r: 2 },
    { title: "zd", x: 97, y: 610, r: 1 },
    { title: "zd", x: 89, y: 592, r: 2 },
    { title: "0788983398", x: 90, y: 574, r: 2 },
    { title: "34503941600085", x: 305, y: 685, r: 2 },
    { title: "zd", x: 400, y: 669, r: 1 },
    { title: "zd", x: 418, y: 648, r: 0 },
    { title: "zd", x: 480, y: 630, r: 0 },
    { title: "zd", x: 305, y: 597, r: 0 },
    { title: "zd", x: 305, y: 560, r: 0 },
    { title: "zd", x: 452, y: 530, r: 0 },
    { title: "X", x: 473, y: 513, r: 0 },

    // //TODO APPRENTI(E)
    { title: "test", x: 216, y: 481, r: 0 },
    { title: "test", x: 160, y: 464, r: 0 },
    { title: "test", x: 137, y: 445, r: 0 },
    { title: "123", x: 39, y: 394, r: 2 },
    { title: "test", x: 110, y: 395, r: 2 },
    { title: "test", x: 100, y: 376, r: 0 },
    { title: "test", x: 96, y: 359, r: 0 },
    { title: "test", x: 88, y: 341, r: 0 },
    { title: "0788983398", x: 90, y: 324, r: 2 },
    { title: "test", x: 28, y: 240, r: 0 },
    { title: "123", x: 39, y: 213, r: 2 },
    { title: "test", x: 110, y: 214, r: 2 },
    { title: "test", x: 100, y: 196, r: 0 },
    { title: "91330", x: 96, y: 178, r: 2 },
    { title: "test", x: 89, y: 160, r: 0 },
    { title: "1988-02-02", x: 405, y: 442, r: 0 },
    { title: "X", x: 338, y: 424, r: 1 },
    { title: "X", x: 365, y: 424, r: 1 },
    { title: "nan", x: 445, y: 406, r: 0 },
    { title: "nan", x: 304, y: 373, r: 0 },
    { title: "X", x: 365, y: 355, r: 1 },
    { title: "X", x: 472, y: 355, r: 1 },
    { title: "X", x: 304, y: 316, r: 1 },
    { title: "X", x: 358, y: 316, r: 1 },
    { title: "X", x: 364, y: 286, r: 1 },
    { title: "X", x: 418, y: 286, r: 1 },
    { title: "na", x: 438, y: 268, r: 0 },
    { title: "na", x: 468, y: 251, r: 0 },
    { title: "na", x: 460, y: 233, r: 0 },
    { title: "nan", x: 304, y: 203, r: 0 },
    { title: "na", x: 491, y: 185, r: 0 },

    // //TODO Maitre d'aprentissage
    { title: "na", x: 27, y: 98, r: 0 },
    { title: "na", x: 27, y: 68, r: 0 },
    { title: "1988-02-02", x: 128, y: 50, r: 0 },
    { title: "na", x: 27, y: 98, r: 277 },
    { title: "na", x: 27, y: 68, r: 277 },
    { title: "1988-02-02", x: 128, y: 50, r: 277 },
    { title: "X", x: 23, y: 25, r: 1 },
  ];

  const pdfPageTwoArray = [
    //TODO Le Contrat
    { title: "na", x: 182, y: 804, r: 0 },
    { title: "na", x: 406, y: 801, r: 0 },
    { title: "na", x: 373, y: 774, r: 0 },
    { title: "1988-02-02", x: 28, y: 731, r: 0 },
    { title: "1988-02-02", x: 188, y: 729, r: 0 },
    { title: "1988-02-02", x: 28, y: 729, r: 357 },
    { title: "1988-02-02", x: 115, y: 691, r: 0 },
    { title: "10", x: 304, y: 691, r: 2 },
    { title: "10", x: 367, y: 691, r: 2 },
    { title: "X", x: 397, y: 669, r: 1 },
    { title: "X", x: 452, y: 669, r: 1 },
    { title: "1988-02-02", x: 80, y: 632, r: 0 },
    { title: "10000", x: 27, y: 559, r: 2 },
    { title: "nan", x: 304, y: 559, r: 277 },
    { title: "10", x: 250, y: 538, r: 2 },
    { title: "10", x: 406, y: 538, r: 2 },
    { title: "X", x: 555, y: 538, r: 1 },

    //TODO La Formation
    { title: "X", x: 122, y: 503, r: 1 },
    { title: "X", x: 176, y: 503, r: 1 },
    { title: "na", x: 122, y: 503, r: 357 },
    { title: "na", x: 27, y: 476, r: 0 },
    { title: "na", x: 27, y: 476, r: 277 },
    { title: "na", x: 110, y: 462, r: 0 },
    { title: "na", x: 110, y: 462, r: 286 },
    { title: "na", x: 109, y: 448, r: 0 },
    { title: "na", x: 109, y: 448, r: 267 },
    { title: "123", x: 39, y: 415, r: 2 },
    { title: "na", x: 39, y: 415, r: 70 },
    { title: "na", x: 99, y: 398, r: 0 },
    { title: "91330", x: 95, y: 380, r: 2 },
    { title: "nan", x: 87, y: 362, r: 0 },
    { title: "1988-02-02", x: 304, y: 402, r: 0 },
    { title: "1988-02-02", x: 304, y: 370, r: 0 },
    { title: "nan", x: 419, y: 356, r: 0 },
    { title: "X", x: 27, y: 251, r: 1 },
    { title: "nan", x: 64, y: 230, r: 0 },

    //TODO CADRE
    { title: "nan", x: 27, y: 105, r: 0 },
    { title: "1988-02-02", x: 27, y: 105, r: 276 },
    { title: "1988-02-02", x: 27, y: 75, r: 0 },
    { title: "1988-02-02", x: 27, y: 75, r: 276 },
    { title: "nan", x: 95, y: 57, r: 0 },
    { title: "nan", x: 95, y: 57, r: 308 },
  ];

  const emailStr = "hello@gmail.com";
  let emailSplit = emailStr.split("@");
  firstPage.moveTo(27, 544);
  firstPage.drawText(spaced(emailSplit[0], 1), {
    size: 12,
    color: rgb(0.9, 0.4, 0.3),
  });
  firstPage.moveRight(emailSplit[0].length * 11);
  firstPage.drawText(spaced("@", 1), { size: 13, color: rgb(0, 0, 0) });
  firstPage.moveRight(17);
  firstPage.drawText(spaced(emailSplit[1], 1), {
    size: 12,
    color: rgb(0.9, 0.4, 0.3),
  });

  pdfPageOneArray.map(({ title, x, y, r, spacing }) => {
    firstPage.moveTo(x, y);
    firstPage.moveRight(r);
    const slicedString = isNaN(title) ? (title.length > 13 ? title.slice(0, 5) : title) : title;
    firstPage.drawText(spaced(slicedString, spacing), {
      size: 12,
      color: rgb(0.9, 0.4, 0.3),
    });
    for (let index = 0; index < slicedString.length; ++index) {
      firstPage.drawRectangle({
        x: index != 0 ? (isNaN(title) ? (x += 15) : (x += 13.4)) : x,
        y: y - 3,
        width: 10,
        height: 14,
        borderWidth: 0.5,
        borderColor: grayscale(0.7),
        opacity: 0.1,
        borderOpacity: 0.1,
      });
    }
  });

  pdfPageTwoArray.map(({ title, x, y, r, spacing }) => {
    secondPage.moveTo(x, y);
    secondPage.moveRight(r);
    const slicedString = isNaN(title) ? (title.length > 13 ? title.slice(0, 5) : title) : title;
    secondPage.drawText(spaced(slicedString, spacing), {
      size: 12,
      color: rgb(0.9, 0.4, 0.3),
    });
    for (let index = 0; index < slicedString.length; ++index) {
      pdfPageOneArray.map(({ title, x, y, r, spacing }) => {
        firstPage.moveTo(x, y);
        firstPage.moveRight(r);
        const slicedString = isNaN(title) ? (title.length > 13 ? title.slice(0, 5) : title) : title;
        firstPage.drawText(spaced(slicedString, spacing), {
          size: 12,
          color: rgb(0.9, 0.4, 0.3),
        });
        for (let index = 0; index < slicedString.length; ++index) {
          firstPage.drawRectangle({
            x: index != 0 ? (isNaN(title) ? (x += 15) : (x += 13.4)) : x,
            y: y - 3,
            width: 10,
            height: 14,
            borderWidth: 0.5,
            borderColor: grayscale(0.7),
            opacity: 0.1,
            borderOpacity: 0.1,
          });
        }
      });
      pdfPageTwoArray.map(({ title, x, y, r, spacing }) => {
        secondPage.moveTo(x, y);
        secondPage.moveRight(r);
        const slicedString = isNaN(title) ? (title.length > 13 ? title.slice(0, 5) : title) : title;
        secondPage.drawText(spaced(slicedString, spacing), {
          size: 12,
          color: rgb(0.9, 0.4, 0.3),
        });
        for (let index = 0; index < slicedString.length; ++index) {
          secondPage.drawRectangle({
            x: index != 0 ? (isNaN(title) ? (x += 15) : (x += 13.4)) : x,
            y: y - 3,
            width: 10,
            height: 14,
            borderWidth: 0.5,
            borderColor: grayscale(0.7),
            opacity: 0.1,
            borderOpacity: 0.1,
          });
        }
      });
      secondPage.drawRectangle({
        x: index != 0 ? (isNaN(title) ? (x += 15) : (x += 13.4)) : x,
        y: y - 3,
        width: 10,
        height: 14,
        borderWidth: 0.5,
        borderColor: grayscale(0.7),
        opacity: 0.1,
        borderOpacity: 0.1,
      });
    }
  });
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
