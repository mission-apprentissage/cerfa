const modeContractuelSchema = {
  enum: [1, 2, 3, 4, null],
  type: Number,
  description:
    "**Mode contratctuel** \r\n<br />1 : à durée limitée\r\n<br />2 : dans le cadre d'un CDI\r\n<br />3 : entreprise de travail temporaire\r\n<br />4 : activités saisonnières à deux employeurs",
  options: [
    { label: "1 à durée limitée", value: 1 },
    { label: "2 dans le cadre d'un CDI", value: 2 },
    { label: "3 entreprise de travail temporaire", value: 3 },
    { label: "4 activités saisonnières à deux employeurs", value: 4 },
  ],
};

module.exports = modeContractuelSchema;
