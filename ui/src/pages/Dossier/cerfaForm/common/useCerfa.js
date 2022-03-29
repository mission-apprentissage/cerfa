import { useRecoilCallback, useRecoilState, useSetRecoilState } from "recoil";
import { cerfaAtom, cerfaSetter, valuesSelector } from "./atoms";
import { validField } from "./utils/validField";
import { validGlobalRules } from "./utils/validGlobalRules";
import { useMemo } from "react";
import { getValues } from "./utils/getValues";
import { dossierAtom } from "../../../../common/hooks/useDossier/dossierAtom";

export const useCerfaController = ({ schema, dossier } = {}) => {
  const [fields, setCerfa] = useRecoilState(cerfaAtom);
  const patchFields = useSetRecoilState(cerfaSetter);

  const processGlobalErrors = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({ name }) => {
        let fields = await snapshot.getPromise(cerfaAtom);
        // fields = cleanGlobalRules({ fields, name, rules: globalRules });
        const error = await validGlobalRules({
          name,
          values: getValues(fields),
          rules: schema.coherenceRules,
        });

        if (error) {
          // set(cerfaAtom, { ...fields, [name]: { ...fields[name], error } });
        }
      },
    [schema]
  );

  const processField = useRecoilCallback(
    ({ snapshot }) =>
      async ({ name, value }) => {
        const dossier = await snapshot.getPromise(dossierAtom);
        const values = await snapshot.getPromise(valuesSelector);

        let { result } = validField({
          value,
          validate: schema.fields[name]?.validate,
          dossier,
          values,
        });

        let { error, cascade } = await result;

        if (error) {
          patchFields({
            [name]: { error },
          });
        }

        if (cascade) {
          patchFields(cascade);
        }

        await processGlobalErrors({ name });

        patchFields({ [name]: { loading: false, error, success: !error } });
      },
    []
  );

  const controller = useMemo(
    () => ({
      dossier,
      setField: async (name, value) => {
        patchFields({
          [name]: { value, loading: true, error: undefined, success: false },
        });
        await processField({ name, value });
      },
      setValues: (values) => {
        let fields = {};
        Object.keys(schema.fields).forEach((name) => {
          fields = { ...fields, [name]: { ...schema.fields[name].defaultState, value: values[name] } };
        });
        setCerfa(fields);
      },
    }),
    [dossier, patchFields, processField, schema, setCerfa]
  );
  return { controller, values: getValues(fields) };
};
