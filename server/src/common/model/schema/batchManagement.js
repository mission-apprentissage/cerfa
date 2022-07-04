const batchManagementSchema = {
  name: {
    type: String,
    enum: ["agecap_status"],
    default: null,
    description: "Nom du batch",
    required: true,
  },
  dateDebut: {
    type: Date,
    default: null,
    description: "Date de lancement du batch",
  },
  dateFin: {
    type: Date,
    default: Date.now,
    description: "Date de fin du batch",
    required: true,
  },
};

module.exports = batchManagementSchema;
