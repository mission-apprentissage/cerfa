import { useState, useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { saveCerfa } from "../useCerfa/useCerfa";
import { cerfaAtom } from "../useCerfa/cerfaAtom";
import { dossierAtom } from "./dossierAtom";
import { cerfaContratLieuSignatureContratAtom } from "../useCerfa/parts/useCerfaContratAtoms";
import { signaturesCompletionAtom } from "./signaturesAtoms";

const setSignaturesCompletions = (lieuSignatureContrat) => {
  let countFields = 1;

  let count = 0;

  if (lieuSignatureContrat.value !== "") {
    count = 1;
  }

  return countFields === 0 ? 100 : (count * 100) / countFields;
};

export function useSignatures() {
  const cerfa = useRecoilValue(cerfaAtom);
  const dossier = useRecoilValue(dossierAtom);

  const [signaturesCompletion, setSignaturesCompletionInternal] = useState(null);
  const [sca, setScA] = useRecoilState(signaturesCompletionAtom);
  const [contratLieuSignatureContrat, setContratLieuSignatureContrat] = useRecoilState(
    cerfaContratLieuSignatureContratAtom
  );

  const onSubmittedContratLieuSignatureContrat = useCallback(
    async (path, data) => {
      try {
        if (path === "contrat.lieuSignatureContrat") {
          const newV = {
            contrat: {
              lieuSignatureContrat: {
                ...contratLieuSignatureContrat,
                value: data,
              },
            },
          };
          if (contratLieuSignatureContrat.value !== newV.contrat.lieuSignatureContrat.value) {
            setContratLieuSignatureContrat(newV.contrat.lieuSignatureContrat);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                lieuSignatureContrat: newV.contrat.lieuSignatureContrat.value,
              },
            });
            const percent = setSignaturesCompletions(res.contrat.lieuSignatureContrat);
            setSignaturesCompletionInternal(percent);
            setScA(percent);
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [contratLieuSignatureContrat, setContratLieuSignatureContrat, dossier?._id, cerfa?.id, setScA]
  );

  const setSignaturesCompletion = useCallback(
    async (res) => {
      const contratLieuSignatureContratToUse = contratLieuSignatureContrat || res.contrat.lieuSignatureContrat;

      const percent = setSignaturesCompletions(contratLieuSignatureContratToUse);
      setSignaturesCompletionInternal(percent);
      setScA(percent);

      if (!contratLieuSignatureContrat) {
        setContratLieuSignatureContrat(contratLieuSignatureContratToUse);
      }
    },
    [contratLieuSignatureContrat, setContratLieuSignatureContrat, setScA]
  );

  const reset = useCallback(async () => {
    setSignaturesCompletionInternal(null);
    setContratLieuSignatureContrat(null);
  }, [setContratLieuSignatureContrat]);

  return {
    reset,
    setSignaturesCompletion,
    signaturesCompletion,
    sca,
    contratLieuSignatureContrat,
    onSubmittedContratLieuSignatureContrat,
  };
}
