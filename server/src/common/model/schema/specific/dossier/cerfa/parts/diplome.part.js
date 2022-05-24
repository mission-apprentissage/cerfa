const diplomeSchema = {
  enum: [13, 25, 26, 33, 34, 35, 38, 41, 42, 43, 49, 54, 55, 58, 61, 62, 63, 69, 71, 72, 73, 74, 79, 80, null],
  type: Number,
  description: `Il faut sélectionner le diplôme ou le titre préparé avant la conclusion du présent contrat. Par exemple, si l'entrée en apprentissage concerne la 2ème année de BTS, le dernier diplôme ou titre préparé est la 1ère année de BTS : il faut donc sélectionner 54 - Brevet de Technicien supérieur.`,
};

module.exports = diplomeSchema;
