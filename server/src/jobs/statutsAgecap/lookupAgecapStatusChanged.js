const { DateTime } = require("luxon");
const { runScript } = require("../scriptWrapper");
const ApiAgecap = require("../../common/apis/ApiAgecap");
const { Dossier } = require("../../common/model/index");
const { asyncForEach } = require("../../common/utils/asyncUtils");

const STATUS_AGECAP = {
  "Transmis au gestionnaire": "TRANSMIS",
  "En cours d'instruction": "EN_COURS_INSTRUCTION",
  "Non déposable": "INCOMPLET",
  // eslint-disable-next-line prettier/prettier
  Déposé: "DEPOSE",
};

const lookupAgecapStatusChanged = async ({ crypto }) => {
  const apiAgecap = new ApiAgecap(crypto);
  await apiAgecap.authenticate();

  const dateDebut = DateTime.fromISO("2021-12-01").setLocale("fr-FR").toFormat("yyyy-MM-dd hh:mm:ss"); // TODO Should be rotate
  const dateFin = DateTime.now().setLocale("fr-FR").toFormat("yyyy-MM-dd hh:mm:ss");
  const { contrats } = await apiAgecap.statut({ dateDebut, dateFin });

  await asyncForEach(contrats, async (contrat) => {
    const dossier = await Dossier.find({ _id: contrat.numTeletransmission });
    if (dossier) {
      if (contrat.numDepot) {
        dossier.numeroDeca = contrat.numDepot;
      }
      if (contrat.numDepot) {
        const etat = STATUS_AGECAP[contrat.statut];
        if (etat) {
          dossier.etat = contrat.numDepot;
        }
      }
      dossier.statutAgecap = [...dossier.statutAgecap, contrat];
      await dossier.save();
    }
  });
};

module.exports = lookupAgecapStatusChanged;

if (process.env.standaloneJobs) {
  runScript(async ({ crypto }) => {
    await lookupAgecapStatusChanged({ crypto });
  });
}

// BELOW SAMPLE DATA

// resp.contrats = [
//   {
//     numTeletransmission: "620a6c551091c5002af67d61",
//     statut: "Transmis au gestionnaire",
//     dateMiseAJourStatut: "2022-02-14",
//     numDepot: null,
//     numAvenant: null,
//     libelleMotifNonDepot: null,
//     commentaireMotifNonDepot: null,
//   },

//   {
//     numTeletransmission: "620b68b2f798d1002a873c65",
//     statut: "Déposé",
//     dateMiseAJourStatut: "2022-02-15",
//     numDepot: "075202202000004",
//     numAvenant: null,
//     libelleMotifNonDepot: null,
//     commentaireMotifNonDepot: null,
//   },

//   {
//     numTeletransmission: "62277cf99c435d002a459a2e",
//     statut: "Transmis au gestionnaire",
//     dateMiseAJourStatut: "2022-03-08",
//     numDepot: null,
//     numAvenant: null,
//     libelleMotifNonDepot: null,
//     commentaireMotifNonDepot: null,
//   },

//   {
//     numTeletransmission: "6203cf839320d4002afa76cd",
//     statut: "Transmis au gestionnaire",
//     dateMiseAJourStatut: "2022-02-14",
//     numDepot: null,
//     numAvenant: null,
//     libelleMotifNonDepot: null,
//     commentaireMotifNonDepot: null,
//   },

//   {
//     numTeletransmission: "620e2231568e2a002a9854bb",
//     statut: "Transmis au gestionnaire",
//     dateMiseAJourStatut: "2022-02-17",
//     numDepot: null,
//     numAvenant: null,
//     libelleMotifNonDepot: null,
//     commentaireMotifNonDepot: null,
//   },

//   {
//     numTeletransmission: "6220d6fb5576cc002b93f23b",
//     statut: "Transmis au gestionnaire",
//     dateMiseAJourStatut: "2022-03-08",
//     numDepot: null,
//     numAvenant: null,
//     libelleMotifNonDepot: null,
//     commentaireMotifNonDepot: null,
//   },

//   {
//     numTeletransmission: "620b5fc1156557002c16223c",
//     statut: "Déposé",
//     dateMiseAJourStatut: "2022-02-15",
//     numDepot: "095202202000003",
//     numAvenant: null,
//     libelleMotifNonDepot: null,
//     commentaireMotifNonDepot: null,
//   },

//   {
//     numTeletransmission: "621cea175576cc002b93ac7e",
//     statut: "Non déposable",
//     dateMiseAJourStatut: "2022-03-31",
//     numDepot: null,
//     numAvenant: null,
//     libelleMotifNonDepot: "Incomplétude",
//     commentaireMotifNonDepot: "",
//   },

//   {
//     numTeletransmission: "620b6596f798d1002a872d6e",
//     statut: "Déposé",
//     dateMiseAJourStatut: "2022-03-31",
//     numDepot: "075202203000193",
//     numAvenant: null,
//     libelleMotifNonDepot: null,
//     commentaireMotifNonDepot: null,
//   },

//   {
//     numTeletransmission: "6239c40fd0c39f002a8f07ae",
//     statut: "En cours d'instruction",
//     dateMiseAJourStatut: "2022-03-31",
//     numDepot: null,
//     numAvenant: null,
//     libelleMotifNonDepot: null,
//     commentaireMotifNonDepot: null,
//   },

//   {
//     numTeletransmission: "JBU6",
//     statut: "Transmis au gestionnaire",
//     dateMiseAJourStatut: "2022-03-30",
//     numDepot: null,
//     numAvenant: null,
//     libelleMotifNonDepot: null,
//     commentaireMotifNonDepot: null,
//   },

//   {
//     numTeletransmission: "6214eaa9b7063f002cde9a01",
//     statut: "Transmis au gestionnaire",
//     dateMiseAJourStatut: "2022-02-22",
//     numDepot: null,
//     numAvenant: null,
//     libelleMotifNonDepot: null,
//     commentaireMotifNonDepot: null,
//   },
// ];
