module.exports = {
  "wks.admin": {
    name: "wks.admin",
    type: "permission",
    title: "Gestionnaire",
    description: "Permission gestionnaire d'espace",
    acl: [
      "wks",
      "wks/page_espace",
      "wks/page_espace/page_dossiers",
      "wks/page_espace/page_dossiers/ajouter_nouveau_dossier",
      "wks/page_espace/page_dossiers/supprimer_dossier",
      "wks/page_espace/page_dossiers/voir_liste_dossiers",
      "wks/page_espace/page_dossiers/voir_liste_dossiers/tous",
      "wks/page_espace/page_parametres",
      "wks/page_espace/page_parametres/gestion_acces",
      "wks/page_espace/page_parametres/gestion_acces/supprimer_contributeur",
      "wks/page_espace/page_parametres/gestion_notifications",
    ],
  },
  "wks.member": {
    name: "wks.member",
    type: "permission",
    title: "Rédacteur",
    description: "Permission rédacteur d'espace",
    acl: [
      "wks",
      "wks/page_espace",
      "wks/page_espace/page_dossiers",
      "wks/page_espace/page_dossiers/ajouter_nouveau_dossier",
      "wks/page_espace/page_dossiers/supprimer_dossier",
      "wks/page_espace/page_dossiers/voir_liste_dossiers/tous",
      "wks/page_espace/page_dossiers/voir_liste_dossiers",
    ],
  },
  "wks.readonly": {
    name: "wks.readonly",
    type: "permission",
    title: "Lecteur",
    description: "Permission lecteur d'espace",
    acl: [
      "wks",
      "wks/page_espace",
      "wks/page_espace/page_dossiers",
      "wks/page_espace/page_dossiers/voir_liste_dossiers",
      "wks/page_espace/page_dossiers/voir_liste_dossiers/tous",
    ],
  },
  "dossier.admin": {
    name: "dossier.admin",
    type: "permission",
    title: "Gestionnaire",
    description: "Permission gestionnaire de dossier",
    acl: [
      "dossier",
      "dossier/sauvegarder",
      "dossier/supprimer",
      "dossier/page_formulaire",
      "dossier/page_documents",
      "dossier/page_documents/ajouter_un_document",
      "dossier/voir_contrat_pdf",
      "dossier/voir_contrat_pdf/telecharger",
      "dossier/page_signatures",
      "dossier/page_signatures/signer",
      "dossier/page_statut",
      "dossier/publication",
      "dossier/envoyer",
      "dossier/page_parametres",
      "dossier/page_parametres/gestion_acces",
      "dossier/page_parametres/gestion_notifications",
    ],
  },
  "dossier.member": {
    name: "dossier.member",
    type: "permission",
    title: "Rédacteur",
    description: "Permission rédacteur de dossier",
    acl: [
      "dossier",
      "dossier/sauvegarder",
      "dossier/page_formulaire",
      "dossier/page_documents",
      "dossier/page_documents/ajouter_un_document",
      "dossier/voir_contrat_pdf",
      "dossier/voir_contrat_pdf/telecharger",
      "dossier/page_signatures",
      "dossier/page_signatures/signer",
      "dossier/page_statut",
      "dossier/publication",
      "dossier/envoyer",
    ],
  },
  "dossier.readonly": {
    name: "dossier.readonly",
    type: "permission",
    title: "Lecteur",
    description: "Permission lecteur de dossier",
    acl: [
      "dossier",
      "dossier/page_documents",
      "dossier/voir_contrat_pdf",
      "dossier/page_signatures",
      "dossier/page_statut",
    ],
  },
  "dossier.signataire": {
    name: "dossier.signataire",
    type: "permission",
    title: "Signataire",
    description: "Permission de signataire dossier",
    acl: [
      "dossier",
      "dossier/page_documents",
      "dossier/voir_contrat_pdf",
      "dossier/voir_contrat_pdf/telecharger",
      "dossier/page_signatures",
      "dossier/page_signatures/signer",
      "dossier/page_statut",
    ],
  },
  support: {
    name: "support",
    type: "user",
    title: "Support",
    description: "Rôle utilisateur support",
    acl: [],
  },
  entreprise: {
    name: "entreprise",
    type: "user",
    title: "Entreprise",
    description: "Rôle utilisateur entreprise",
    acl: [],
  },
  cfa: {
    name: "cfa",
    type: "user",
    title: "CFA",
    description: "Rôle utilisateur Organisme de formation",
    acl: [],
  },
  instructeur: {
    name: "instructeur",
    type: "user",
    title: "Instructeur",
    description: "Rôle utilisateur DR(I)EETS",
    acl: [],
  },
};
