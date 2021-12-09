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
      "wks/page_espace/page_dossiers/voir_liste_dossiers",
      "wks/page_espace/page_dossiers/voir_liste_dossiers/tous",
      "wks/page_espace/page_parametres",
      "wks/page_espace/page_parametres/gestion_acces",
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
