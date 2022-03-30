import { useState, useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { saveCerfa } from "../useCerfa/useCerfa";
import { cerfaAtom } from "../useCerfa/cerfaAtom";
import { dossierAtom } from "./dossierAtom";
import { documentsAtom, documentsIsRequiredAtom, documentsCompletionAtom } from "./documentsAtoms";
import { cerfaContratTypeContratAppAtom } from "../useCerfa/parts/useCerfaContratAtoms";
import { cerfaEmployeurAttestationPiecesAtom } from "../useCerfa/parts/useCerfaEmployeurAtoms";

import {
  convertValueToMultipleSelectOption,
  convertValueToOption,
  convertMultipleSelectOptionToValue,
} from "../../common/utils/formUtils";

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

  const pCalc = (count * 100) / countFields;

  const percent = countFields === 0 || pCalc > 100 ? 100 : pCalc;

  return { percent, isRequired };
};

export function useDocuments() {
  const cerfa = useRecoilValue(cerfaAtom);
  const [dossier, setDossier] = useRecoilState(dossierAtom);

  const [documents, setDocuments] = useRecoilState(documentsAtom);
  const [isRequired, setIsRequired] = useRecoilState(documentsIsRequiredAtom);
  const [, setDcA] = useRecoilState(documentsCompletionAtom);

  const [documentsCompletion, setDocumentsCompletionInternal] = useState(null);
  const [employeurAttestationPieces, setEmployeurAttestationPieces] = useRecoilState(
    cerfaEmployeurAttestationPiecesAtom
  );

  const [contratTypeContratApp, setContratTypeContratApp] = useRecoilState(cerfaContratTypeContratAppAtom);

  const onSubmittedEmployeurAttestationPieces = useCallback(
    async (path) => {
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
          // if (employeurAttestationPieces.value !== newV.employeur.attestationPieces.value) {
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

          setDocumentsCompletionInternal(percent);
          setDcA(percent);
          // }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [employeurAttestationPieces, setEmployeurAttestationPieces, dossier?._id, cerfa?.id, documents, setDcA]
  );

  const onDocumentsChanged = useCallback(
    async (newDocumentsArray, typeDocument) => {
      const docs = newDocumentsArray.filter((i) => i.typeDocument === typeDocument);
      setDocuments(docs);
      setDossier({ ...dossier, documents: docs });

      const { percent } = setDocumentsCompletions(
        convertMultipleSelectOptionToValue(contratTypeContratApp),
        employeurAttestationPieces,
        docs
      );
      setDocumentsCompletionInternal(percent);
      setDcA(percent);
    },
    [contratTypeContratApp, dossier, employeurAttestationPieces, setDcA, setDocuments, setDossier]
  );

  const setDocumentsCompletion = useCallback(
    async (res, d) => {
      const docs = d?.documents.filter((i) => i.typeDocument === "CONVENTION_FORMATION");
      setDocuments(docs);
      const employeurAttestationPiecesToUse =
        employeurAttestationPieces || convertValueToOption(res.employeur.attestationPieces);
      const contratTypeContratAppToUse =
        contratTypeContratApp || convertValueToMultipleSelectOption(res.contrat.typeContratApp);

      const { percent, isRequired } = setDocumentsCompletions(
        contratTypeContratAppToUse,
        employeurAttestationPiecesToUse,
        docs
      );
      setDocumentsCompletionInternal(percent);
      setDcA(percent);
      setIsRequired(isRequired);

      if (!employeurAttestationPieces) {
        setEmployeurAttestationPieces(employeurAttestationPiecesToUse);
      }
      if (!contratTypeContratApp) {
        setContratTypeContratApp(contratTypeContratAppToUse);
      }
    },
    [
      contratTypeContratApp,
      employeurAttestationPieces,
      setContratTypeContratApp,
      setDcA,
      setDocuments,
      setEmployeurAttestationPieces,
      setIsRequired,
    ]
  );

  const reset = useCallback(async () => {
    setDocumentsCompletionInternal(null);
    setEmployeurAttestationPieces(null);
    setContratTypeContratApp(null);
  }, [setContratTypeContratApp, setEmployeurAttestationPieces]);

  return {
    reset,
    documents,
    onDocumentsChanged,
    setDocumentsCompletion,
    documentsCompletion,
    isRequired,
    employeurAttestationPieces,
    onSubmittedEmployeurAttestationPieces,
  };
}
