const employeurCerfaSchema = require("./employeurCerfa");
const apprentiSchema = require("./apprenti");
const maitreApprentissageSchema = require("./maitreApprentissage");
const formationSchema = require("./formation");
const contratSchema = require("./contrat");
const organismeFormationSchema = require("./organismeFormation");

const CerfaSchema = {
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
  numeroExterne: {
    type: String,
    description: "Identifiant externe ou numéro de dossier (utilisé dans les communications entre le CFA et l'OPCO)",
    nullable: true,
    default: null,
  },
  numeroInterne: {
    type: String,
    description: "Identifiant interne ou technique (utilisé uniquement dans le SI de l'OPCO)",
    nullable: true,
    default: null,
  },
  numeroDeca: {
    type: String,
    description: "Numéro DECA du dossier\r\n<br />Obsolète : Ce champ est redondant avec le champ contrat.noContrat",
    nullable: true,
    default: null,
  },
  etat: {
    enum: ["TRANSMIS", "EN_COURS_INSTRUCTION", "ENGAGE", "ANNULE", "REFUSE", "RUTPURE", "SOLDE", null],
    type: String,
    default: null,
    nullable: true,
    description:
      "**Etat du contrat** :\r\n<br />TRANSMIS\r\n<br />EN_COURS_INSTRUCTION\r\n<br />ENGAGE\r\n<br />ANNULE\r\n<br />REFUSE\r\n<br />RUPTURE\r\n<br />SOLDE",
  },
};
module.exports = CerfaSchema;
