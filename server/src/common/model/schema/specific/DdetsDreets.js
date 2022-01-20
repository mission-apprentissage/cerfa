const ddetsDreetsSchema = {
  type: {
    index: true,
    type: String,
    description: "Type de fichier (DREETS | DDETS)",
    required: true,
  },
  SIRET: {
    index: true,
    type: String,
  },
  code_region: {
    index: true,
    type: String,
  },
};
module.exports = ddetsDreetsSchema;
