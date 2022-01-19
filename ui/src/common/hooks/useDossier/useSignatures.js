import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { saveCerfa } from "../useCerfa/useCerfa";
import { cerfaAtom } from "../useCerfa/cerfaAtom";
import { dossierAtom } from "./dossierAtom";
import { signaturesCompletionAtom } from "./signaturesAtoms";
import { cerfaContratLieuSignatureContratAtom } from "../useCerfa/parts/useCerfaContratAtoms";

const setSignaturesCompletions = (lieuSignatureContrat) => {
  let countFields = 1;

  let count = 0;

  if (lieuSignatureContrat.value !== "") {
    count = 1;
  }

  return countFields === 0 ? 100 : (count * 100) / countFields;
};

export function useSignatures(typeDocument) {
  const cerfa = useRecoilValue(cerfaAtom);
  const dossier = useRecoilValue(dossierAtom);

  const [signaturesCompletion, setSignaturesCompletion] = useRecoilState(signaturesCompletionAtom);
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
            setSignaturesCompletion(setSignaturesCompletions(res.contrat.lieuSignatureContrat));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [contratLieuSignatureContrat, setContratLieuSignatureContrat, dossier?._id, cerfa?.id, setSignaturesCompletion]
  );

  const setAll = async (res) => {
    setContratLieuSignatureContrat(res.contrat.lieuSignatureContrat);
  };

  useEffect(() => {
    if (contratLieuSignatureContrat) {
      setSignaturesCompletion(setSignaturesCompletions(contratLieuSignatureContrat));
    }
  }, [contratLieuSignatureContrat, setSignaturesCompletion]);

  return {
    setAll,
    signaturesCompletion,
    lieuSignatureContrat: contratLieuSignatureContrat,
    onSubmittedContratLieuSignatureContrat,
  };
}
