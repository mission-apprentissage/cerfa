const employeurCerfaSchema = require("./employeurCerfa");
const apprentiSchema = require("./apprenti");

const contratsSchema = {
  employeur: {
    ...employeurCerfaSchema,
  },
  apprenti: {
    ...apprentiSchema,
  },
  // maitre1: {},
  // maitre2: {},
  // formation: {},
  // contrat: {},
  // organismeFormation: {},
  //       numeroExterne: {
  //         type: "string",
  //         description:
  //           "Identifiant externe ou numéro de dossier (utilisé dans les communications entre le CFA et l'OPCO)",
  //         nullable: true,
  //       },
  //       numeroInterne: {
  //         type: "string",
  //         description: "Identifiant interne ou technique (utilisé uniquement dans le SI de l'OPCO)",
  //         nullable: true,
  //       },
  //       numeroDeca: {
  //         type: "string",
  //         description:
  //           "Numéro DECA du dossier\r\n<br />Obsolète : Ce champ est redondant avec le champ contrat.noContrat",
  //         nullable: true,
  //         deprecated: true,
  //       },
  etat: {
    enum: ["TRANSMIS", "EN_COURS_INSTRUCTION", "ENGAGE", "ANNULE", "REFUSE", "RUTPURE", "SOLDE", null],
    type: String,
    default: null,
    nullable: true,
    description:
      "**Etat du contrat** :\r\n<br />TRANSMIS\r\n<br />EN_COURS_INSTRUCTION\r\n<br />ENGAGE\r\n<br />ANNULE\r\n<br />REFUSE\r\n<br />RUPTURE\r\n<br />SOLDE",
  },
};
module.exports = contratsSchema;
