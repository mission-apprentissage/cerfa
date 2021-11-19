const XLSX = require("xlsx");

const readXLSXFile = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath, { codepage: 65001 });

    return { sheet_name_list: workbook.SheetNames, workbook };
  } catch (error) {
    return null;
  }
};

const getJsonFromXlsxFile = (filePath) => {
  try {
    const { sheet_name_list, workbook } = readXLSXFile(filePath);
    const worksheet = workbook.Sheets[sheet_name_list[0]];
    const json = XLSX.utils.sheet_to_json(worksheet, { raw: false });

    return json;
  } catch (err) {
    return null;
  }
};

const createXlsxFromJson = (data, filePath, tabName = "tab") => {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data), tabName);

  XLSX.writeFileAsync(filePath, workbook, { compression: true }, (e) => {
    if (e) {
      console.log(e);
      throw new Error("La génération du fichier excel à échoué : ", e);
    }
  });
};

module.exports = { createXlsxFromJson, getJsonFromXlsxFile };
