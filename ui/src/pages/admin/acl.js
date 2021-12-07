export default [
  {
    feature: "Accès aux fonctionnalités administrateur",
    ref: "admin",
    subFeatures: [
      {
        feature: "Gestion des utilisateurs",
        ref: "admin/page_gestion_utilisateurs",
      },
      {
        feature: "Gestion des Rôles",
        ref: "admin/page_gestion_roles",
      },
      {
        feature: "Message de maintenance",
        ref: "admin/page_message_maintenance",
      },
      {
        feature: "Upload de fichiers source",
        ref: "admin/page_upload",
      },
    ],
  },
  {
    feature: "Accès aux fonctionnalités d'espace",
    ref: "wks",
    subFeatures: [
      {
        feature: "Voir la page d'espace",
        ref: "wks/page_espace",
        subFeatures: [
          {
            feature: "Voir la page mes dossiers",
            ref: "wks/page_espace/page_dossiers",
            subFeatures: [
              {
                feature: "Ajouter un nouveau dossier",
                ref: "wks/page_espace/page_dossiers/ajouter_nouveau_dossier",
              },
              {
                feature: "Voir la liste des dossiers",
                ref: "wks/page_espace/page_dossiers/voir_liste_dossiers",
                uniqSubFeature: true,
                subFeatures: [
                  {
                    feature: "Voir tous les dossiers",
                    ref: "wks/page_espace/page_dossiers/voir_liste_dossiers/tous",
                  },
                  {
                    feature: "Voir uniquement les dossiers en cours d'instruction",
                    ref: "wks/page_espace/page_dossiers/voir_liste_dossiers/demande_instruction",
                  },
                ],
              },
            ],
          },
          {
            feature: "Voir la page des paramètres d'espace",
            ref: "wks/page_espace/page_parametres",
            subFeatures: [
              {
                feature: "Gestion des accès à l'espace",
                ref: "wks/page_espace/page_parametres/gestion_acces",
              },
              {
                feature: "Gestion des notifications de l'espace",
                ref: "wks/page_espace/page_parametres/gestion_notifications",
              },
            ],
          },
        ],
      },
    ],
  },
];
