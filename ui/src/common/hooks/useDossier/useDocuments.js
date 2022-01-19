import { useEffect, useState, useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { saveCerfa } from "../useCerfa/useCerfa";
import { cerfaAtom } from "../useCerfa/cerfaAtom";
import { dossierAtom } from "./dossierAtom";
import { documentsCompletionAtom, documentsAtom } from "./documentsAtoms";
import { cerfaContratTypeContratAppAtom } from "../useCerfa/parts/useCerfaContratAtoms";
import { cerfaEmployeurAttestationPiecesAtom } from "../useCerfa/parts/useCerfaEmployeurAtoms";

import { convertMultipleSelectOptionToValue } from "../../utils/formUtils";

const setDocumentsCompletions = (typeContratApp, employeurAttestationPieces, documents) => {
  let countFields = 0;
  const isRequired =
    typeContratApp?.valueDb === 11 ||
    typeContratApp?.valueDb === 21 ||
    typeContratApp?.valueDb === 22 ||
    typeContratApp?.valueDb === 23 ||
    typeContratApp?.valueDb === 33 ||
    typeContratApp?.valueDb === 34 ||
    typeContratApp?.valueDb === 35;

  let count = documents.length > 0 ? 1 : 0;

  if (isRequired) {
    countFields = 1;
  } else if (!typeContratApp?.valueDb) {
    countFields = 1;
  }

  if (employeurAttestationPieces.value === "true") {
    count = count + 1;
  }
  countFields = countFields + 1;

  const percent = countFields === 0 ? 100 : (count * 100) / countFields;

  return { percent, isRequired };
};

export function useDocuments(typeDocument) {
  const cerfa = useRecoilValue(cerfaAtom);
  const dossier = useRecoilValue(dossierAtom);

  const [documents, setDocuments] = useRecoilState(documentsAtom);

  const [documentsCompletion, setDocumentsCompletion] = useRecoilState(documentsCompletionAtom);
  const [employeurAttestationPieces, setEmployeurAttestationPieces] = useRecoilState(
    cerfaEmployeurAttestationPiecesAtom
  );
  const [isRequired, setIsRequired] = useState(true);
  const typeContratApp = useRecoilValue(cerfaContratTypeContratAppAtom);

  const onSubmittedEmployeurAttestationPieces = useCallback(
    async (path, data) => {
      try {
        if (path === "employeur.attestationPieces") {
          const newV = {
            employeur: {
              attestationPieces: {
                ...employeurAttestationPieces,
                value: employeurAttestationPieces.value === "true" ? "" : "true",
              },
            },
          };
          if (employeurAttestationPieces.value !== newV.employeur.attestationPieces.value) {
            setEmployeurAttestationPieces(newV.employeur.attestationPieces);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                attestationPieces: newV.employeur.attestationPieces.value === "true" ? true : null,
              },
            });

            const { percent } = setDocumentsCompletions(
              convertMultipleSelectOptionToValue(res.contrat.typeContratApp),
              newV.employeur.attestationPieces,
              documents
            );
            setDocumentsCompletion(percent);
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      employeurAttestationPieces,
      setEmployeurAttestationPieces,
      dossier?._id,
      cerfa?.id,
      documents,
      setDocumentsCompletion,
    ]
  );

  useEffect(() => {
    if (typeContratApp && employeurAttestationPieces && dossier) {
      const docs = dossier.documents.filter((i) => i.typeDocument === typeDocument);
      setDocuments(docs);
      const { percent, isRequired } = setDocumentsCompletions(typeContratApp, employeurAttestationPieces, docs);
      setDocumentsCompletion(percent);
      setIsRequired(isRequired);
    }
  }, [setDocuments, employeurAttestationPieces, setDocumentsCompletion, typeContratApp, dossier, typeDocument]);

  return {
    documentsCompletion,
    isRequired,
    typeContratApp,
    employeurAttestationPieces,
    onSubmittedEmployeurAttestationPieces,
  };
}
