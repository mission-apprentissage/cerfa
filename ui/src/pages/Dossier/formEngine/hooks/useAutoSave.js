import { useEffect, useRef } from "react";
import { useRecoilCallback } from "recoil";
import { isEmptyValue } from "../utils/isEmptyValue";
import { getValues } from "../utils/getValues";
import { apiService } from "../../services/api.service";
import debounce from "lodash.debounce";
import { dossierAtom } from "../../atoms";

export const useAutoSave = ({ controller }) => {
  const getDossier = useRecoilCallback(
    ({ snapshot }) =>
      async () =>
        snapshot.getPromise(dossierAtom),
    []
  );

  useEffect(() => {
    const handler = debounce(
      async (fields) => {
        const toSave = Object.fromEntries(
          Object.entries(fields)
            .filter(([, field]) => field.autosave !== false)
            .map(([name, field]) => {
              if (!field.error && !isEmptyValue(field.value)) {
                return [name, field];
              }
              return [name, { ...field, value: null }];
            })
        );
        const data = getValues(toSave);
        const dossier = await getDossier();
        console.log("save", fields, toSave, data);
        await apiService.saveCerfa({ dossierId: dossier._id, data, cerfaId: dossier.cerfaId });
      },
      1000,
      { trailing: true }
    );
    controller.on("CHANGE", handler);
    return () => controller.off("CHANGE", handler);
  }, [controller, getDossier]);
};
