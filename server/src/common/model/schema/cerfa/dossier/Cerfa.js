const employeurCerfaSchema = require("./employeurCerfa");
const apprentiSchema = require("./apprenti");
const maitreApprentissageSchema = require("./maitreApprentissage");
const formationSchema = require("./formation");
const contratSchema = require("./contrat");
const organismeFormationSchema = require("./organismeFormation");

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
};
module.exports = cerfaSchema;
