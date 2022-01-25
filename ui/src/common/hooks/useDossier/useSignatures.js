import { useState, useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { DateTime } from "luxon";

import { saveCerfa } from "../useCerfa/useCerfa";
import { cerfaAtom } from "../useCerfa/cerfaAtom";
import { dossierAtom } from "./dossierAtom";
import {
  cerfaContratLieuSignatureContratAtom,
  cerfaContratDateConclusionAtom,
  cerfaContratDateDebutContratAtom,
} from "../useCerfa/parts/useCerfaContratAtoms";
import { signaturesCompletionAtom, signaturesIsLoadedAtom } from "./signaturesAtoms";

import { convertDateToValue, convertValueToDate } from "../../utils/formUtils";

const setSignaturesCompletions = (lieuSignatureContrat, dateConclusion) => {
  let countFields = 1;

  let count = 0;

  if (lieuSignatureContrat.value !== "") {
    count = 1;
  }

  return countFields === 0 ? 100 : (count * 100) / countFields;
};

const doAsyncActionsDate = async (value, data) => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const dateDebutContrat = DateTime.fromISO(data.dateDebutContrat).setLocale("fr-FR");
  const dateConclusionContrat = DateTime.fromISO(value).setLocale("fr-FR");

  if (dateConclusionContrat > dateDebutContrat) {
    return {
      successed: false,
      data: null,
      message: "Date de signature de contrat ne peut pas être après la date de début de contrat",
    };
  }

  return {
    successed: true,
    data: value,
    message: null,
  };
};

export function useSignatures() {
  const cerfa = useRecoilValue(cerfaAtom);
  const dossier = useRecoilValue(dossierAtom);

  const [isLoaded, setIsLoaded] = useRecoilState(signaturesIsLoadedAtom);

  const [signaturesCompletion, setSignaturesCompletionInternal] = useState(null);
  const [sca, setScA] = useRecoilState(signaturesCompletionAtom);
  const [contratLieuSignatureContrat, setContratLieuSignatureContrat] = useRecoilState(
    cerfaContratLieuSignatureContratAtom
  );
  const [contratDateConclusion, setContratDateConclusion] = useRecoilState(cerfaContratDateConclusionAtom);
  const [contratDateDebutContrat, setContratDateDebutContrat] = useRecoilState(cerfaContratDateDebutContratAtom);

  // const onSubmittedContratLieuSignatureContrat = useCallback(
  //   async (path, data) => {
  //     try {
  //       if (path === "contrat.lieuSignatureContrat") {
  //         const newV = {
  //           contrat: {
  //             lieuSignatureContrat: {
  //               ...contratLieuSignatureContrat,
  //               value: data,
  //             },
  //           },
  //         };
  //         if (contratLieuSignatureContrat.value !== newV.contrat.lieuSignatureContrat.value) {
  //           setContratLieuSignatureContrat(newV.contrat.lieuSignatureContrat);

  //           const res = await saveCerfa(dossier?._id, cerfa?.id, {
  //             contrat: {
  //               lieuSignatureContrat: newV.contrat.lieuSignatureContrat.value,
  //             },
  //           });
  //           const percent = setSignaturesCompletions(res.contrat.lieuSignatureContrat, contratDateConclusion);
  //           setSignaturesCompletionInternal(percent);
  //           setScA(percent);
  //         }
  //       }
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   },
  //   [
  //     contratLieuSignatureContrat,
  //     setContratLieuSignatureContrat,
  //     dossier?._id,
  //     cerfa?.id,
  //     contratDateConclusion,
  //     setScA,
  //   ]
  // );

  // const onSubmittedContratDateConclusion = useCallback(
  //   async (path, data) => {
  //     try {
  //       if (path === "contrat.dateConclusion") {
  //         const newV = {
  //           contrat: {
  //             dateConclusion: {
  //               ...contratDateConclusion,
  //               value: data,
  //             },
  //           },
  //         };
  //         if (contratDateConclusion.value !== newV.contrat.dateConclusion.value) {
  //           setContratDateConclusion(newV.contrat.dateConclusion);

  //           const res = await saveCerfa(dossier?._id, cerfa?.id, {
  //             contrat: {
  //               dateConclusion: convertDateToValue(newV.contrat.dateConclusion),
  //             },
  //           });
  //           const percent = setSignaturesCompletions(contratLieuSignatureContrat, res.contrat.dateConclusion);
  //           setSignaturesCompletionInternal(percent);
  //           setScA(percent);
  //         }
  //       }
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   },
  //   [contratDateConclusion, setContratDateConclusion, dossier?._id, cerfa?.id, contratLieuSignatureContrat, setScA]
  // );

  const onSubmitted = useCallback(
    async (lieu, date) => {
      try {
        const newV = {
          contrat: {
            dateConclusion: {
              ...contratDateConclusion,
              value: date,
            },
            lieuSignatureContrat: {
              ...contratLieuSignatureContrat,
              value: lieu,
            },
          },
        };

        setContratDateConclusion(newV.contrat.dateConclusion);
        setContratLieuSignatureContrat(newV.contrat.lieuSignatureContrat);

        const res = await saveCerfa(dossier?._id, cerfa?.id, {
          contrat: {
            lieuSignatureContrat: newV.contrat.lieuSignatureContrat.value,
            dateConclusion: convertDateToValue(newV.contrat.dateConclusion),
          },
        });
        const percent = setSignaturesCompletions(res.contrat.lieuSignatureContrat, res.contrat.dateConclusion);
        setSignaturesCompletionInternal(percent);
        setScA(percent);
      } catch (e) {
        console.error(e);
      }
    },
    [
      contratDateConclusion,
      contratLieuSignatureContrat,
      setContratDateConclusion,
      setContratLieuSignatureContrat,
      dossier?._id,
      cerfa?.id,
      setScA,
    ]
  );

  const setSignaturesCompletion = useCallback(
    async (res) => {
      const contratLieuSignatureContratToUse = contratLieuSignatureContrat || res.contrat.lieuSignatureContrat;
      const contratDateConclusionToUse = contratDateConclusion || res.contrat.dateConclusion;
      const contratDateDebutContratToUse = contratDateDebutContrat || res.contrat.dateDebutContrat;

      const percent = setSignaturesCompletions(contratLieuSignatureContratToUse, contratDateConclusionToUse);
      setSignaturesCompletionInternal(percent);
      setScA(percent);

      if (!contratLieuSignatureContrat) {
        setContratLieuSignatureContrat(contratLieuSignatureContratToUse);
      }
      if (!contratDateConclusion) {
        setContratDateConclusion({
          ...convertValueToDate(contratDateConclusionToUse),
          doAsyncActions: doAsyncActionsDate,
        });
      }
      if (!contratDateDebutContrat) {
        setContratDateDebutContrat(convertValueToDate(contratDateDebutContratToUse));
      }
      setIsLoaded(true);
    },
    [
      contratDateConclusion,
      contratDateDebutContrat,
      contratLieuSignatureContrat,
      setContratDateConclusion,
      setContratDateDebutContrat,
      setContratLieuSignatureContrat,
      setIsLoaded,
      setScA,
    ]
  );

  const reset = useCallback(async () => {
    setSignaturesCompletionInternal(null);
    setContratLieuSignatureContrat(null);
    setContratDateConclusion(null);
  }, [setContratDateConclusion, setContratLieuSignatureContrat]);

  return {
    reset,
    setSignaturesCompletion,
    signaturesCompletion,
    sca,
    contratLieuSignatureContrat,
    // onSubmittedContratLieuSignatureContrat,
    contratDateConclusion,
    // onSubmittedContratDateConclusion,
    onSubmitted,
    isLoaded,
  };
}
