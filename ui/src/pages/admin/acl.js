// TODO
export default [
  {
    feature: "Voir la page Catalogue formation",
    ref: "page_catalogue",
    subFeatures: [
      {
        feature: "Exporter les formations",
        ref: "page_catalogue/export_btn",
      },
      {
        feature: "Consulter le guide réglementaire",
        ref: "page_catalogue/guide_reglementaire",
      },
      {
        feature: "Demande d'ajout de formation",
        ref: "page_catalogue/demande_ajout",
      },
      {
        feature: "Voir tous les statuts de publication",
        ref: "page_catalogue/voir_status_publication",
      },
      {
        feature: "Voir les statuts de publication parcourSup",
        ref: "page_catalogue/voir_status_publication_ps",
      },
      {
        feature: "Voir les statuts de publication affelnet",
        ref: "page_catalogue/voir_status_publication_aff",
      },
    ],
  },
  {
    feature: "Voir la page détails d'une formation",
    ref: "page_formation",
    subFeatures: [
      {
        feature: "Voir les statuts de publication ParcourSup",
        ref: "page_formation/voir_status_publication_ps",
      },
      {
        feature: "Voir les statuts de publication affelnet",
        ref: "page_formation/voir_status_publication_aff",
      },
      {
        feature: "Gestion des publications",
        ref: "page_formation/gestion_publication",
      },
      {
        feature: "Modifier les informations",
        ref: "page_formation/modifier_informations",
      },
      {
        feature: "Supprimer la formation",
        ref: "page_formation/supprimer_formation",
      },
    ],
  },
  {
    feature: "Voir la page des organismes",
    ref: "page_organismes",
    subFeatures: [
      {
        feature: "Exporter les organismes",
        ref: "page_organismes/export_btn",
      },
      {
        feature: "Consulter le guide réglementaire",
        ref: "page_organismes/guide_reglementaire",
      },
    ],
  },
  {
    feature: "Voir la page détails d'un organisme",
    ref: "page_organisme",
    subFeatures: [
      {
        feature: "Modifier les informations",
        ref: "page_organisme/modifier_informations",
      },
      {
        feature: "Demander des corrections",
        ref: "page_organisme/demandes_corretions",
      },
    ],
  },
  // {
  //   feature: "Voir le journal des modifications",
  //   ref: "page_journal",
  // },
  {
    feature: "Actions expertes",
    ref: "page_actions_expertes",
  },
  {
    feature: "Rapprochement des bases Carif-Oref et Parcoursup",
    ref: "page_reconciliation_ps",
    subFeatures: [
      {
        feature: "valider / invalider la correspondance",
        ref: "page_reconciliation_ps/validation_rejection",
      },
      {
        feature: "Envoyer rapport d'anomalies",
        ref: "page_reconciliation_ps/send_rapport_anomalies",
      },
    ],
  },
  {
    feature: "Rapports de conversion",
    ref: "rapports_conversion",
  },
  {
    feature: "Rapports d'importation",
    ref: "rapports_importation",
  },
  {
    feature: "Gestion des utilisateurs",
    ref: "page_gestion_utilisateurs",
  },
  {
    feature: "Gestion des Rôles",
    ref: "page_gestion_roles",
  },
  {
    feature: "Upload de fichiers source",
    ref: "page_upload",
  },
  {
    feature: "Message de maintenance",
    ref: "page_message_maintenance",
  },
  {
    feature: "Réglage des périmètres Parcoursup",
    ref: "page_perimetre_ps",
  },
  {
    feature: "Réglage des périmètres Affelnet",
    ref: "page_perimetre_af",
  },
  {
    feature: "Voir la page de collecte",
    ref: "page_collecte",
  },
];
