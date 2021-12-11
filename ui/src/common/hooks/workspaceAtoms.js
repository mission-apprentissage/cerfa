import { atom } from "recoil";

export const workspaceAtom = atom({
  key: "workspace",
  default: null,
});

export const workspacePathsAtom = atom({
  key: "workspace/paths",
  default: null,
});

export const workspaceTitlesAtom = atom({
  key: "workspace/titles",
  default: null,
});

export const workspaceTitleAtom = atom({
  key: "workspace/title",
  default: null,
});
