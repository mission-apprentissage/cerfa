import { atom, selector } from "recoil";
import { cerfaAtom, cerfaStatusGetter } from "./formEngine/atoms";
import { documentsCompletionStatusGetter } from "./PiecesJustificatives/documentsCompletionAtoms";
import { infoSignaturesCompletionSelector } from "./Signatures/atoms";

export const dossierCompletionStatus = selector({
  key: "dossierCompletionStatus",
  get: ({ get }) => {
    const cerfaCompletionStatus = get(cerfaStatusGetter);
    const documentsCompletionStatus = get(documentsCompletionStatusGetter);
    const signatureCompletionStatus = get(infoSignaturesCompletionSelector);

    return {
      cerfa: {
        completion: cerfaCompletionStatus?.completion,
        complete: cerfaCompletionStatus?.completion === 100,
      },
      documents: documentsCompletionStatus,
      signature: signatureCompletionStatus,
      dossier: {
        complete:
          cerfaCompletionStatus?.completion +
            documentsCompletionStatus?.completion +
            signatureCompletionStatus?.completion ===
          300,
        completion:
          (cerfaCompletionStatus?.completion +
            documentsCompletionStatus?.completion +
            signatureCompletionStatus?.completion) /
          3,
      },
    };
  },
});

export const dossierAtom = atom({
  key: "dossierAtom",
  default: null,
});

export const dossierNameSelector = selector({
  key: "apprentiNameSelector",
  get: ({ get }) => {
    const prenom = get(cerfaAtom)?.["apprenti.prenom"].value;
    const nom = get(cerfaAtom)?.["apprenti.nom"].value;
    const dossier = get(dossierAtom);

    return nom && prenom ? "Contrat - " + nom + " " + prenom : dossier?.nom;
  },
});
