import { useEffect } from "react";
import { useRecoilCallback } from "recoil";
import { isEmptyValue } from "../utils/isEmptyValue";
import { getValues } from "../utils/getValues";
import { apiService } from "../../services/api.service";
import debounce from "lodash.debounce";
import { dossierAtom } from "../../atoms";
import setWith from "lodash.setwith";

const getIsLocked = (fields) => {
  if (!fields) return undefined;
  const values = {};
  Object.entries(fields).forEach(([key, field]) => {
    setWith(values, key, field.locked);
  });
  return values;
};

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

        const data = { ...getValues(toSave), isLockedField: getIsLocked(toSave) };
        const dossier = await getDossier();
        await apiService.saveCerfa({ dossierId: dossier._id, data, cerfaId: dossier.cerfaId });
      },
      1000,
      { trailing: true }
    );
    controller.on("CHANGE", handler);
    return () => controller.off("CHANGE", handler);
  }, [controller, getDossier]);
};
