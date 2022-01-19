import { atom } from "recoil";

export const documentsCompletionAtom = atom({
  key: "dossier/documents/completion",
  default: 0,
});

export const documentsAtom = atom({
  key: "dossier/documents",
  default: 0,
});
