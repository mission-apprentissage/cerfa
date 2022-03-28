import { atom } from "recoil";

export const cerfaPartMaitresCompletionAtom = atom({
  key: "cerfa/part/maitres/completion",
  default: 0,
});
export const cerfaPartMaitresIsLoadingAtom = atom({
  key: "cerfa/part/maitres/isLoading",
  default: true,
});

export const cerfaMaitre1NomAtom = atom({
  key: "cerfa/maitre1/nom",
  default: null,
});
export const cerfaMaitre1PrenomAtom = atom({
  key: "cerfa/maitre1/prenom",
  default: null,
});
export const cerfaMaitre1DateNaissanceAtom = atom({
  key: "cerfa/maitre1/dateNaissance",
  default: null,
});

export const cerfaMaitre2NomAtom = atom({
  key: "cerfa/maitre2/nom",
  default: null,
});
export const cerfaMaitre2PrenomAtom = atom({
  key: "cerfa/maitre2/prenom",
  default: null,
});
export const cerfaMaitre2DateNaissanceAtom = atom({
  key: "cerfa/maitre2/dateNaissance",
  default: null,
});

export const cerfaEmployeurAttestationEligibiliteAtom = atom({
  key: "cerfa/employeur/attestationEligibilite",
  default: null,
});
