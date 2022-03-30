import { atom } from "recoil";

export const cerfaPartEmployeurCompletionAtom = atom({
  key: "cerfa/part/employeur/completion",
  default: 0,
});

export const cerfaPartEmployeurIsLoadingAtom = atom({
  key: "cerfa/part/employeur/isLoading",
  default: true,
});

export const cerfaPartEmployeurIsValidatigngAtom = atom({
  key: "cerfa/part/employeur/isValidating",
  default: false,
});
export const cerfaPartEmployeurHasBeenResetAtom = atom({
  key: "cerfa/part/employeur/hasBeenReset",
  default: false,
});
export const cerfaPartEmployeurFieldsErroredAtom = atom({
  key: "cerfa/part/employeur/fields/errored",
  default: [],
});
export const cerfaPartEmployeurFieldsVaidedAtom = atom({
  key: "cerfa/part/employeur/fields/valided",
  default: [],
});

export const cerfaEmployeurSiretAtom = atom({
  key: "cerfa/employeur/siret",
  default: null,
});
export const cerfaEmployeurDenominationAtom = atom({
  key: "cerfa/employeur/denomination",
  default: null,
});
export const cerfaEmployeurRaisonSocialeAtom = atom({
  key: "cerfa/employeur/raisonSociale",
  default: null,
});
export const cerfaEmployeurNafAtom = atom({
  key: "cerfa/employeur/naf",
  default: null,
});
export const cerfaEmployeurNombreDeSalariesAtom = atom({
  key: "cerfa/employeur/nombreDeSalaries",
  default: null,
});
export const cerfaEmployeurCodeIdccAtom = atom({
  key: "cerfa/employeur/codeIdcc",
  default: null,
});
export const cerfaEmployeurCodeIdcSpecialAtom = atom({
  key: "cerfa/employeur/codeIdcc/special",
  default: {
    description: "Autres cas",
    label: "",
    default: null,
    nullable: true,
    example: "Sans convention collective",
    options: [
      {
        label: "9999 - Sans convention collective",
        value: "9999",
      },
      {
        label: "9998 - Convention non encore en vigueur",
        value: "9998",
      },
    ],
    value: "",
    locked: true,
    isNotRequiredForm: true,
    valueDb: "",
  },
});
export const cerfaEmployeurLibelleIdccAtom = atom({
  key: "cerfa/employeur/libelleIdcc",
  default: null,
});
export const cerfaEmployeurTelephoneAtom = atom({
  key: "cerfa/employeur/telephone",
  default: null,
});
export const cerfaEmployeurCourrielAtom = atom({
  key: "cerfa/employeur/courriel",
  default: null,
});

export const cerfaEmployeurAdresseNumeroAtom = atom({
  key: "cerfa/employeur/adresse/numero",
  default: null,
});
export const cerfaEmployeurAdresseVoieAtom = atom({
  key: "cerfa/employeur/adresse/voie",
  default: null,
});
export const cerfaEmployeurAdresseComplementAtom = atom({
  key: "cerfa/employeur/adresse/complement",
  default: null,
});
export const cerfaEmployeurAdresseCodePostalAtom = atom({
  key: "cerfa/employeur/adresse/codePostal",
  default: null,
});
export const cerfaEmployeurAdresseCommuneAtom = atom({
  key: "cerfa/employeur/adresse/commune",
  default: null,
});
export const cerfaEmployeurAdresseDepartementAtom = atom({
  key: "cerfa/employeur/adresse/departement",
  default: null,
});
export const cerfaEmployeurAdresseRegionAtom = atom({
  key: "cerfa/employeur/adresse/region",
  default: null,
});

export const cerfaEmployeurNomAtom = atom({
  key: "cerfa/employeur/nom",
  default: null,
});
export const cerfaEmployeurPrenomAtom = atom({
  key: "cerfa/employeur/prenom",
  default: null,
});
export const cerfaEmployeurTypeEmployeurAtom = atom({
  key: "cerfa/employeur/typeEmployeur",
  default: null,
});
export const cerfaEmployeurEmployeurSpecifiqueAtom = atom({
  key: "cerfa/employeur/employeurSpecifique",
  default: null,
});
export const cerfaEmployeurCaisseComplementaireAtom = atom({
  key: "cerfa/employeur/caisseComplementaire",
  default: null,
});
export const cerfaEmployeurRegimeSpecifiqueAtom = atom({
  key: "cerfa/employeur/regimeSpecifique",
  default: null,
});
export const cerfaEmployeurAttestationPiecesAtom = atom({
  key: "cerfa/employeur/attestationPieces",
  default: null,
});
export const cerfaEmployeurPrivePublicAtom = atom({
  key: "cerfa/employeur/privePublic",
  default: null,
});