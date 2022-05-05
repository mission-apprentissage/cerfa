const mongoose = require("mongoose");

const historySchema = {
  cerfaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cerfa",
    unique: true,
    description: "Identifiant interne du cerfa",
    required: true,
  },
  history: {
    type: mongoose.Schema.Types.Mixed,
  },
};

module.exports = historySchema;
