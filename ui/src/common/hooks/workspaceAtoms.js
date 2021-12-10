import { atom } from "recoil";

export const workspacePathsAtom = atom({
  key: "workspace/paths",
  default: null,
});

export const workspaceTitlesAtom = atom({
  key: "workspace/titles",
  default: null,
});
