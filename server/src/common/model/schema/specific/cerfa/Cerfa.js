const employeurCerfaSchema = require("./parts/employeurCerfa.part");
const apprentiSchema = require("./parts/apprenti.part");
const maitreApprentissageSchema = require("./parts/maitreApprentissage.part");
const formationSchema = require("./parts/formation.part");
const contratSchema = require("./parts/contrat.part");
const organismeFormationSchema = require("./parts/organismeFormation.part");

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
  draft: {
    type: Boolean,
    default: true,
    required: true,
    description: "Statut interne brouillon",
  },
  dossierId: {
    type: String,
    description: "Identifiant interne du dossier",
    required: true,
    unique: true,
  },
};
module.exports = cerfaSchema;
