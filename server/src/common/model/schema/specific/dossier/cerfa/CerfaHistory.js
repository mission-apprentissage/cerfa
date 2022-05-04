const mongoose = require("mongoose");

const historySchema = {
  cerfaId: {
    type: String,
    description: "Identifiant interne du cerfa",
    required: true,
  },
  history: {
    type: mongoose.Schema.Types.Mixed,
  },
};

module.exports = historySchema;
