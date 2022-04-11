import { useEffect, useRef } from "react";
import { useRecoilCallback } from "recoil";
import { dossierAtom } from "../../../../common/hooks/useDossier/dossierAtom";
import { isEmptyValue } from "../utils/isEmptyValue";
import { getValues } from "../utils/getValues";
import { apiService } from "../../services/api.service";

export const useAutoSave = ({ controller }) => {
  const savedFields = useRef();

  const getDossier = useRecoilCallback(
    ({ snapshot }) =>
      async () =>
        snapshot.getPromise(dossierAtom)
  );

  useEffect(() => {
    const handler = async (v) => {
      const changed = Object.fromEntries(
        Object.entries(v).filter(([key, value]) => value !== savedFields.current?.[key])
      );
      const toSave = Object.fromEntries(
        Object.entries(changed)
          .filter(([, field]) => field.autosave !== false)
          .map(([name, field]) => {
            if (!field.error && !isEmptyValue(field.value)) {
              return [name, field];
            }
            return [name, { ...field, value: null }];
          })
      );
      const data = getValues(toSave);
      if (savedFields.current) {
        const dossier = await getDossier();
        // console.log("save", v, toSave, data, dossier);
        await apiService.saveCerfa({ dossierId: dossier._id, data, cerfaId: dossier.cerfaId });
      }
      savedFields.current = v;
    };
    controller.on("CHANGE", handler);
    return () => controller.off("CHANGE", handler);
  }, [controller, getDossier]);
};
