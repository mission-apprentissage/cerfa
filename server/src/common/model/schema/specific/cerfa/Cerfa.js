const { mongoose } = require("../../../../mongodb");
const employeurCerfaSchema = require("./parts/employeurCerfa.part");
const apprentiSchema = require("./parts/apprenti.part");
const maitreApprentissageSchema = require("./parts/maitreApprentissage.part");
const formationSchema = require("./parts/formation.part");
const contratSchema = require("./parts/contrat.part");
const organismeFormationSchema = require("./parts/organismeFormation.part");
const fieldLockedSchema = require("./parts/fieldLocked.part");

const cerfaSchema = {
  employeur: {
    ...employeurCerfaSchema,
  },
  apprenti: {
    ...apprentiSchema,
  },
  maitre1: {
    ...maitreApprentissageSchema,
  },
  maitre2: {
    ...maitreApprentissageSchema,
  },
  formation: {
    ...formationSchema,
  },
  contrat: {
    ...contratSchema,
  },
  organismeFormation: {
    ...organismeFormationSchema,
  },
  isLockedField: {
    ...fieldLockedSchema,
  },
  draft: {
    type: Boolean,
    default: true,
    required: true,
    description: "Statut interne brouillon",
  },
  dossierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "dossier",
    required: true,
    unique: true,
    description: "Identifiant interne du dossier",
  },
};
module.exports = cerfaSchema;
