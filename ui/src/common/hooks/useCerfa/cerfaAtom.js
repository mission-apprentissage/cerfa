import { atom } from "recoil";

export const cerfaAtom = atom({
  key: "cerfa",
  default: null,
});

export const cerfaIsLoadingAtom = atom({
  key: "cerfa/isLoading",
  default: true,
});
