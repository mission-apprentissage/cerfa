import { useEffect, useState, useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { saveCerfa } from "../useCerfa/useCerfa";
import { cerfaAtom } from "../useCerfa/cerfaAtom";
import { dossierAtom } from "./dossierAtom";
// import { documentsCompletionAtom } from "./documentsAtoms";
import { cerfaContratLieuSignatureContratAtom } from "../useCerfa/parts/useCerfaContratAtoms";

const setSignaturesCompletions = (typeContratApp, employeurAttestationPieces, documents) => {
  // let countFields = 0;
  // const isRequired =
  //   typeContratApp?.valueDb === 11 ||
  //   typeContratApp?.valueDb === 21 ||
  //   typeContratApp?.valueDb === 22 ||
  //   typeContratApp?.valueDb === 23 ||
  //   typeContratApp?.valueDb === 33 ||
  //   typeContratApp?.valueDb === 34 ||
  //   typeContratApp?.valueDb === 35;
  // let count = documents.length > 0 ? 1 : 0;
  // if (isRequired) {
  //   countFields = 1;
  // } else if (!typeContratApp?.valueDb) {
  //   countFields = 1;
  // }
  // if (employeurAttestationPieces.value === "true") {
  //   count = count + 1;
  // }
  // countFields = countFields + 1;
  // const percent = countFields === 0 ? 100 : (count * 100) / countFields;
  // return { percent, isRequired };
};

export function useSignatures(typeDocument) {
  const cerfa = useRecoilValue(cerfaAtom);
  const dossier = useRecoilValue(dossierAtom);

  // const [signaturesCompletion, setSignaturesCompletion] = useRecoilState(documentsCompletionAtom);
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
                // forceUpdate: false, // IF data = "" true
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
            // setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      contratLieuSignatureContrat,
      setContratLieuSignatureContrat,
      dossier?._id,
      cerfa?.id,
      // setPartContratCompletion
    ]
  );

  // useEffect(() => {
  //   if (typeContratApp && employeurAttestationPieces && dossier) {
  //     const docs = dossier.documents.filter((i) => i.typeDocument === typeDocument);
  //     setDocuments(docs);
  //     const { percent, isRequired } = setDocumentsCompletions(typeContratApp, employeurAttestationPieces, docs);
  //     setDocumentsCompletion(percent);
  //     setIsRequired(isRequired);
  //   }
  // }, [setDocuments, employeurAttestationPieces, setDocumentsCompletion, typeContratApp, dossier, typeDocument]);

  return {
    // setSignaturesCompletions,
    lieuSignatureContrat: contratLieuSignatureContrat,
    onSubmittedContratLieuSignatureContrat,
  };
}
