import { useCallback } from "react";
import { useRecoilValue } from "recoil";

import { apiService } from "../../services/api.service";
import { dossierAtom } from "../../../../common/hooks/useDossier/dossierAtom";

export function useSignatures() {
  const dossier = useRecoilValue(dossierAtom);

  const onSubmitted = useCallback(
    async (lieu, date) => {
      try {
        await apiService.saveCerfa({
          dossierId: dossier?._id,
          cerfaId: dossier.cerfaId,
          data: {
            contrat: {
              lieuSignatureContrat: lieu,
              dateConclusion: date,
            },
          },
        });
      } catch (e) {
        console.error(e);
      }
    },
    [dossier]
  );

  return { onSubmitted };
}
