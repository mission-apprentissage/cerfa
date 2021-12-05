module.exports = {
  support: {
    name: "support",
    acl: [],
  },
  entreprise: {
    name: "entreprise",
    acl: [],
  },
  cfa: {
    name: "cfa",
    acl: [],
  },
  instructeur: {
    name: "instructeur",
    acl: [],
  },
  "wks.admin": {
    name: "wks.admin",
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
    acl: [
      "wks",
      "wks/page_espace",
      "wks/page_espace/page_dossiers",
      "wks/page_espace/page_dossiers/ajouter_nouveau_dossier",
      "wks/page_espace/page_dossiers/voir_liste_dossiers",
      "wks/page_espace/page_dossiers/voir_liste_dossiers/tous",
    ],
  },
  "wks.instructeur": {
    name: "wks.instructeur",
    acl: [
      "wks",
      "wks/page_espace",
      "wks/page_espace/page_dossiers",
      "wks/page_espace/page_dossiers/voir_liste_dossiers",
      "wks/page_espace/page_dossiers/voir_liste_dossiers/demande_instruction",
    ],
  },
  "wks.support": {
    name: "wks.support",
    acl: [
      "wks",
      "wks/page_espace",
      "wks/page_espace/page_dossiers",
      "wks/page_espace/page_dossiers/voir_liste_dossiers/tous",
      "wks/page_espace/page_dossiers/voir_liste_dossiers",
    ],
  },
};
