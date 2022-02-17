const typeDerogationSchema = {
  enum: [11, 12, 21, 22, 50, 60, null],
  default: null,
  type: Number,
  description:
    "A renseigner si une dérogation existe pour ce contrat (exemple : l'apprentissage commence à partir de 16 ans mais par dérogation, les jeunes âgés d'au moins 15 ans et un jour peuvent conclure un contrat d'apprentissage s'ils ont terminé la scolarité du 1er cycle de l'enseignement secondaire (collège).",
  options: [
    {
      label: "11 Age de l'apprenti inférieur à 16 ans",
      value: 11,
      locked: true,
    },
    {
      label: "12 Age supérieur à 29 ans : cas spécifiques prévus dans le code du travail",
      value: 12,
      locked: true,
    },
    {
      label: "21 Réduction de la durée du contrat ou de la période d'apprentissage",
      value: 21,
      locked: true,
    },
    {
      label: "22 Allongement de la durée du contrat ou de la période d'apprentissage",
      value: 22,
      locked: true,
    },
    {
      label: "50 Cumul de dérogations",
      value: 50,
      locked: true,
    },
    {
      label: "60 Autre dérogation",
      value: 60,
      locked: true,
    },
  ],
};

module.exports = typeDerogationSchema;
