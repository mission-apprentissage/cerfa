const fieldLockedSchema = {
  employeur: {
    siret: {
      type: Boolean,
      default: false,
    },
    denomination: {
      type: Boolean,
      default: false,
    },
    raison_sociale: {
      type: Boolean,
      default: false,
    },
    naf: {
      type: Boolean,
      default: false,
    },
    nombreDeSalaries: {
      type: Boolean,
      default: false,
    },
    codeIdcc: {
      type: Boolean,
      default: false,
    },
    libelleIdcc: {
      type: Boolean,
      default: false,
    },
    telephone: {
      type: Boolean,
      default: false,
    },
    courriel: {
      type: Boolean,
      default: false,
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
    nom: {
      type: Boolean,
      default: false,
    },
    prenom: {
      type: Boolean,
      default: false,
    },
    typeEmployeur: {
      type: Boolean,
      default: false,
    },
    employeurSpecifique: {
      type: Boolean,
      default: false,
    },
    caisseComplementaire: {
      type: Boolean,
      default: false,
    },
    regimeSpecifique: {
      type: Boolean,
      default: false,
    },
    attestationEligibilite: {
      type: Boolean,
      default: false,
    },
    attestationPieces: {
      type: Boolean,
      default: false,
    },
  },
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
    formationInterne: {
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
