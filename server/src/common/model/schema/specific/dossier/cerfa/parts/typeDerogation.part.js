const typeDerogationSchema = {
  enum: [11, 12, 21, 22, 50, 60, null],
  default: null,
  type: Number,
  description:
    "**Type de dérogation** :\r\n<br />11 : Age de l'apprenti inférieur à 16 ans\r\n<br />12 : Age supérieur à 29 ans : cas spécifiques prévus dans le code du travail\r\n<br />21 : Réduction de la durée du contrat ou de la période d’apprentissage\r\n<br />22 : Allongement de la durée du contrat ou de la période d’apprentissage\r\n<br />50 : Cumul de dérogations\r\n<br />60 : Autre dérogation",
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
      locked: false,
    },
    {
      label: "22 Allongement de la durée du contrat ou de la période d'apprentissage",
      value: 22,
      locked: false,
    },
    {
      label: "50 Cumul de dérogations",
      value: 50,
      locked: false,
    },
    {
      label: "60 Autre dérogation",
      value: 60,
      locked: false,
    },
  ],
};

module.exports = typeDerogationSchema;
