const typeDerogationSchema = {
  enum: [11, 12, 21, 22, 50, 60, null],
  default: null,
  type: Number,
  description:
    "A renseigner si une dérogation existe pour ce contrat (exemple : l'apprentissage commence à partir de 16 ans mais par dérogation, les jeunes âgés d'au moins 15 ans et un jour peuvent conclure un contrat d'apprentissage s'ils ont terminé la scolarité du 1er cycle de l'enseignement secondaire (collège).",
};

module.exports = typeDerogationSchema;
