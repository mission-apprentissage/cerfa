const { DateTime } = require("luxon");
const { runScript } = require("../scriptWrapper");
const ApiAgecap = require("../../common/apis/ApiAgecap");
const { Dossier } = require("../../common/model/index");
const { asyncForEach } = require("../../common/utils/asyncUtils");

// Mapping état dossier AGECAP => CELIA
const STATUS_AGECAP = {
  "Transmis au gestionnaire": "TRANSMIS",
  "En cours d'instruction": "EN_COURS_INSTRUCTION",
  "Non déposable": "REFUSE",
  // eslint-disable-next-line prettier/prettier
  Déposé: "DEPOSE",
  "En attente de complément": "EN_ATTENTE_COMPLEMENT",
};

async function getAgecapStatusChanged(batchManagement, apiAgecap) {
  let dateDebut;

  // On va chercher la date de fin de la dernière exécution du batch en bdd.
  const lastRunDate = await batchManagement.getLastBatchExecution("agecap_status");

  // Si cette date existe, on l'utilise comme date de début pour ce batch
  if (lastRunDate.length) {
    dateDebut = DateTime.fromJSDate(lastRunDate[0].dateFin);
  } else {
    // Si elle n'existe pas (le batch n'a encore jamais tourné), on prend le 01/12/2021 (date de début de CELIA)
    dateDebut = DateTime.fromISO("2021-12-01").setLocale("fr-FR");
  }

  // Si la date de début est plus vieille qu'1 an jusqu'à aujourd'hui, on ne prend qu'un an max
  // => Limite WS03 AGECAP: dateFin - dateDebut <= 365 days.
  // Sinon on prend jusqu'à maintenant
  let dateDebutPlusOneYear = dateDebut.plus({ days: 364 });
  const now = DateTime.now();
  let dateFin = dateDebutPlusOneYear < now ? dateDebutPlusOneYear : now;

  // Récupération des infos sur les status des contrats via le WS03 d'AGECAP ici
  const { contrats } = await apiAgecap.statut({
    dateDebut: dateDebut.toFormat("yyyy-MM-dd HH:mm:ss"),
    dateFin: dateFin.plus({ days: 1 }).toFormat("yyyy-MM-dd HH:mm:ss"),
  });

  await asyncForEach(contrats, async (contrat) => {
    const isMongoObjectId = new RegExp(`^[0-9A-Fa-f]{24}$`);
    // On ne s'occupe que des numTeletransmission qui proviennent de CELIA
    if (isMongoObjectId.test(contrat.numTeletransmission)) {
      const dossier = await Dossier.findOne({ _id: contrat.numTeletransmission });
      if (dossier) {
        if (contrat.numDepot) {
          dossier.numeroDeca = contrat.numDepot;
        }

        // On applique au dossier CELIA son état AGECAP
        const etat = STATUS_AGECAP[contrat.statut];
        if (etat) {
          dossier.etat = etat;
        }

        // On ajoute les différents statuts récupérés à la suite des existants.
        const currentDbStatut = dossier.statutAgecap ?? [];
        const newStatut = [];

        const lastestStatut =
          currentDbStatut.length > 0
            ? currentDbStatut[currentDbStatut.length - 1]
            : {
                statut: null,
                dateMiseAJourStatut: null,
                numDepot: null,
                numAvenant: null,
                libelleMotifNonDepot: null,
                commentaireMotifNonDepot: null,
              };

        const stringifier = ({
          statut,
          dateMiseAJourStatut,
          numDepot,
          numAvenant,
          libelleMotifNonDepot,
          commentaireMotifNonDepot,
        }) =>
          JSON.stringify({
            statut,
            dateMiseAJourStatut,
            numDepot,
            numAvenant,
            libelleMotifNonDepot,
            commentaireMotifNonDepot,
          });
        if (stringifier(contrat) !== stringifier(lastestStatut)) {
          newStatut.push(contrat);
        }

        dossier.statutAgecap = [...currentDbStatut, ...newStatut];
        await dossier.save();
      }
    }
  });

  // On trace cette exécution du batch en bdd
  await batchManagement.addBatchExecution({
    name: "agecap_status",
    dateDebut: dateDebut,
    dateFin: dateFin,
  });

  // On return true si on doit refaire une passe.
  return dateFin < now;
}

const lookupAgecapStatusChanged = async ({ crypto, batchManagement }) => {
  const apiAgecap = new ApiAgecap(crypto);
  await apiAgecap.authenticate();

  // On recommence tant que la date de fin en est inférieure à la date aujourd'hui
  let redo;
  do {
    redo = await getAgecapStatusChanged(batchManagement, apiAgecap);
  } while (redo);
};

module.exports = lookupAgecapStatusChanged;

if (process.env.standaloneJobs) {
  runScript(async (components) => {
    await lookupAgecapStatusChanged(components);
  });
}
