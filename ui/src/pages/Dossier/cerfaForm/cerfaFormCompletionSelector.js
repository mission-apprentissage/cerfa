import { selector } from "recoil";
import { dossierAtom } from "../../../common/hooks/useDossier/dossierAtom";
import { getFormStatus } from "./completion";
import { cerfaAtom, valuesSelector } from "../formEngine/atoms";

export const cerfaFormCompletionSelector = selector({
  key: "cerfaFormCompletionSelector",
  get: ({ get }) => {
    const fields = get(cerfaAtom);
    const values = get(valuesSelector);
    const dossier = get(dossierAtom);
    if (!fields || !values) return;
    return getFormStatus({ fields, values, dossier });
  },
});
