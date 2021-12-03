const fieldLockedSchema = {
  formation: {
    rncp: {
      type: Boolean,
      default: false,
    },
    codeDiplome: {
      type: Boolean,
      default: false,
    },
    typeDiplome: {
      type: Boolean,
      default: false,
    },
    intituleQualification: {
      type: Boolean,
      default: true,
    },
    dateDebutFormation: {
      type: Boolean,
      default: false,
    },
    dateFinFormation: {
      type: Boolean,
      default: false,
    },
    dureeFormation: {
      type: Boolean,
      default: false,
    },
  },
  organismeFormation: {
    siret: {
      type: Boolean,
      default: false,
    },
    denomination: {
      type: Boolean,
      default: true,
    },
    uaiCfa: {
      type: Boolean,
      default: true,
    },
    adresse: {
      numero: {
        type: Boolean,
        default: true,
      },
      voie: {
        type: Boolean,
        default: true,
      },
      complement: {
        type: Boolean,
        default: true,
      },
      codePostal: {
        type: Boolean,
        default: true,
      },
      commune: {
        type: Boolean,
        default: true,
      },
    },
  },
};

module.exports = fieldLockedSchema;
