import { atom } from "recoil";

export const signaturesCompletionAtom = atom({
  key: "dossier/signatures/completion",
  default: 0,
});

export const signaturesPdfLoadedAtom = atom({
  key: "dossier/signatures/pdf/loaded",
  default: false,
});
