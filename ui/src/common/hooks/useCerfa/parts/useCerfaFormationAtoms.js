import { atom } from "recoil";

export const cerfaPartFormationCompletionAtom = atom({
  key: "cerfa/part/formation/completion",
  default: 0,
});
export const cerfaPartFormationIsLoadingAtom = atom({
  key: "cerfa/part/formation/isLoading",
  default: true,
});

export const cerfaOrganismeFormationSiretAtom = atom({
  key: "cerfa/organismeFormation/siret",
  default: null,
});
export const cerfaOrganismeFormationDenominationAtom = atom({
  key: "cerfa/organismeFormation/denomination",
  default: null,
});
export const cerfaOrganismeFormationFormationInterneAtom = atom({
  key: "cerfa/organismeFormation/formationInterne",
  default: null,
});
export const cerfaOrganismeFormationUaiCfaAtom = atom({
  key: "cerfa/organismeFormation/uaicfa",
  default: null,
});
export const cerfaOrganismeFormationAdresseNumeroAtom = atom({
  key: "cerfa/organismeFormation/adresse/numero",
  default: null,
});
export const cerfaOrganismeFormationAdresseVoieAtom = atom({
  key: "cerfa/organismeFormation/adresse/voie",
  default: null,
});
export const cerfaOrganismeFormationAdresseComplementAtom = atom({
  key: "cerfa/organismeFormation/adresse/complement",
  default: null,
});
export const cerfaOrganismeFormationAdresseCodePostalAtom = atom({
  key: "cerfa/organismeFormation/adresse/codePostal",
  default: null,
});
export const cerfaOrganismeFormationAdresseCommuneAtom = atom({
  key: "cerfa/organismeFormation/adresse/commune",
  default: null,
});

export const cerfaFormationRncpAtom = atom({
  key: "cerfa/formation/rncp",
  default: null,
});
export const cerfaFormationCodeDiplomeAtom = atom({
  key: "cerfa/formation/codeDiplome",
  default: null,
});
export const cerfaFormationDateDebutFormationAtom = atom({
  key: "cerfa/formation/dateDebutFormation",
  default: null,
});
export const cerfaFormationDateFinFormationAtom = atom({
  key: "cerfa/formation/dateFinFormation",
  default: null,
});
export const cerfaFormationDureeFormationCalcAtom = atom({
  key: "cerfa/formation/dureeFormationCalc",
  default: null,
});
export const cerfaFormationDureeFormationAtom = atom({
  key: "cerfa/formation/dureeFormation",
  default: null,
});
export const cerfaFormationIntituleQualificationAtom = atom({
  key: "cerfa/formation/intituleQualification",
  default: null,
});
export const cerfaFormationTypeDiplomeAtom = atom({
  key: "cerfa/formation/typeDiplome",
  default: null,
});
