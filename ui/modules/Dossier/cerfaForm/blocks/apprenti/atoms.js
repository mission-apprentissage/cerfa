import { selector } from "recoil";
import { cerfaAtom } from "../../../formEngine/atoms";

export const apprentiNameSelector = selector({
  key: "apprentiNameSelector",
  get: ({ get }) => {
    const prenom = get(cerfaAtom)?.["apprenti.prenom"].value;
    const nom = get(cerfaAtom)?.["apprenti.nom"].value;

    return nom && prenom ? "Contrat - " + nom + " " + prenom : false;
  },
});
