const modeContractuelSchema = {
  enum: [1, 2, 3, 4, null],
  type: Number,
  description:
    "**Mode contratctuel** \r\n<br />1 : à durée limitée\r\n<br />2 : dans le cadre d’un CDI\r\n<br />3 : entreprise de travail temporaire\r\n<br />4 : activités saisonnières à deux employeurs",
  options: [
    "1 à durée limitée",
    "2 dans le cadre d'un CDI",
    "3 entreprise de travail temporaire",
    "4 activités saisonnières à deux employeurs",
  ],
};

module.exports = modeContractuelSchema;
