const typeDerogationSchema = {
  enum: [11, 12, 21, 22, 50, 60, null],
  default: null,
  type: Number,
  description:
    "**Type de dérogation** :\r\n<br />11 : Age de l'apprenti inférieur à 16 ans\r\n<br />12 : Age supérieur à 29 ans : cas spécifiques prévus dans le code du travail\r\n<br />21 : Réduction de la durée du contrat ou de la période d’apprentissage\r\n<br />22 : Allongement de la durée du contrat ou de la période d’apprentissage\r\n<br />50 : Cumul de dérogations\r\n<br />60 : Autre dérogation",
  options: [
    "11 Age de l'apprenti inférieur à 16 ans",
    "12 Age supérieur à 29 ans : cas spécifiques prévus dans le code du travail",
    "21 Réduction de la durée du contrat ou de la période d'apprentissage",
    "22 Allongement de la durée du contrat ou de la période d'apprentissage",
    "50 Cumul de dérogations",
    "60 Autre dérogation",
  ],
};

module.exports = typeDerogationSchema;
