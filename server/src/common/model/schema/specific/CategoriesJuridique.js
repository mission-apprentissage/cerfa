const categoriesJuridiqueSchema = {
  CATEGJURID: {
    type: String,
    index: true,
    default: null,
    description: "CATEGJURID",
  },
  LIBELLE: {
    type: String,
    default: null,
    description: "LIBELLE",
  },
  SIASP: {
    type: String,
    default: null,
    description: "SIASP",
  },
  EXCEPTIONS: {
    type: String,
    default: [],
    description: "EXCEPTIONS",
  },
};

module.exports = categoriesJuridiqueSchema;
