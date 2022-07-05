const Boom = require("boom");
const { find } = require("lodash");
const { oleoduc } = require("oleoduc");
const { PassThrough } = require("stream");
const { deleteFromStorage, uploadToStorage } = require("../utils/ovhUtils");
const apiYousign = require("../apis/yousign/ApiYousign");

module.exports = async (dossiers, crypto, agecap, users) => {
  function noop() {
    return new PassThrough();
  }

  return {
    handleRetourYouSign: async ({ body, params }) => {
      // On ne traite pas l'event procedure.finished pour éviter de faire le traitement 2 fois
      if (body.eventName === "procedure.finished") {
        return;
      }

      // On récupère le dossier en cours de traitement
      const dossier = await dossiers.findDossierById(params.id);
      if (!dossier) {
        throw Boom.notFound("Doesn't exist");
      }

      // On récupère le propriétaire du dossier
      const user = await users.getUserById(dossier.owner);

      // On met à jour les états des signatures dans le dossier avec les infos transmises par YouSign via le webhook
      const { _doc } = await dossiers.updateSignatures(params.id, body);
      const { procedure } = _doc.signatures;
      const signataires = _doc.signataires;
      const dossierId = params.id;
      const yousignFile = procedure.files[0];

      // On récupère les documents du dossier
      let { hashStream, getHash } = crypto.checksum();
      let filename = yousignFile.name;
      let path = `contrats/${dossierId}/${filename}`;
      const documents = await dossiers.getDocuments(dossierId);

      // Si on a déjà un contrat dans l'object storage, on le supprime
      const contratDocument = find(documents, { typeDocument: "CONTRAT" });
      if (contratDocument) {
        await deleteFromStorage(path);
      }

      // On upload sur le S3 le nouveau contrat avec l'oleoduc (input stream => output stream)
      await oleoduc(
        // On donne en stream input le contrat récupéré de YouSign
        await apiYousign.getFile(yousignFile.id.replace("/files/", "")),
        hashStream,
        crypto.isCipherAvailable() ? crypto.cipher(dossierId) : noop(),
        // On donne en stream output l'upload vers le S3
        await uploadToStorage(path, { contentType: "application/pdf" })
      );

      // On enregistre le contrat en pièce jointe dans le dossier, qu'on enverra pas à AGECAP
      let hash = await getHash();
      await dossiers.addDocument(dossierId, {
        typeDocument: "CONTRAT",
        hash,
        nomFichier: filename,
        cheminFichier: path,
        tailleFichier: 0,
        userEmail: user.email,
      });

      // On regarde les membres qui ont signés sur YouSign, et on les mets à jour dans le dossier
      const memberSignatureStatusChanged = (signataire, doneMember) => {
        if (signataire.email === doneMember.email) {
          signataire.status = doneMember.status === "done" ? "SIGNE" : "REFUS";

          // Si le signataire a refusé de signer, on récupère son commentaire de refus
          if (doneMember.status === "refused") {
            signataires.commentaireRefus = doneMember.comment;
          }
        }
      };

      const doneMembers = procedure.members.filter(({ status }) => status === "done" || status === "refused");
      for (let doneMember of doneMembers) {
        memberSignatureStatusChanged(signataires.apprenti, doneMember);
        memberSignatureStatusChanged(signataires.employeur, doneMember);
        memberSignatureStatusChanged(signataires.cfa, doneMember);
        memberSignatureStatusChanged(signataires.legal, doneMember);
      }

      await dossiers.updateSignatairesDossier(dossierId, signataires);

      // Si au moins un signataire a refusé de signer, on met à jour l'état du dossier
      if (body.eventName === "procedure.refused") {
        await dossiers.updateEtatDossier(params.id, "SIGNATURES_REFUS");
      }
      // La procédure de signature est terminée, on lance automatiquement la télétransmission vers AGECAP
      else if (doneMembers && doneMembers.length === procedure.members.length) {
        await dossiers.updateEtatDossier(params.id, "DOSSIER_TERMINE_AVEC_SIGNATURE");

        await agecap.convertAndSendToAgecap({
          dossierId,
          user,
        });
      } else {
        // La procédure n'est pas encore terminée, on attend la suite des signatures
        await dossiers.updateEtatDossier(params.id, "SIGNATURES_EN_COURS");
      }
    },
  };
};
