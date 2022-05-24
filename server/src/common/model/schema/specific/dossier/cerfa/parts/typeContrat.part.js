const typeContratSchema = {
  enum: [11, 21, 22, 23, 31, 32, 33, 34, 35, 36, 37],
  type: Number,
  description: `Le type de contrat ou avenant doit correspondre à la situation du contrat (premier contrat, succession de contrats, avenants).`,
};

module.exports = typeContratSchema;
