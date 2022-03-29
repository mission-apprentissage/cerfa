import { selector, useRecoilCallback, useRecoilState, useSetRecoilState } from "recoil";
import { cerfaAtom, cerfaSetter } from "./atoms";
import { validField } from "./utils/validField";
import { cleanGlobalRules } from "./utils/cleanGlobalRules";
import { validGlobalRules } from "./utils/validGlobalRules";
import { useMemo } from "react";
import { SCHEMA } from "./schema/SCHEMA";
import { getValues } from "./utils/getValues";

const globalRules = [
  {
    deps: ["siret", "name"],
    validate: ({ cerfa }) => {
      return { error: "shit" };
    },
  },
];

const glosel = selector({
  key: "glosel",
  get: () => undefined,
  set: ({ get }) => {
    console.log(get(cerfaAtom));
  },
});

export const useCerfaController = ({ schema } = {}) => {
  const [fields, setCerfa] = useRecoilState(cerfaAtom);
  const patchFields = useSetRecoilState(cerfaSetter);
  const computeGlobalErrors = useSetRecoilState(glosel);

  const setGlobalErrors = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({ name }) => {
        let fields = await snapshot.getPromise(cerfaAtom);
        fields = cleanGlobalRules({ fields, name, rules: globalRules });
        const error = await validGlobalRules({
          name,
          fields,
          rules: globalRules,
        });
        if (error) {
          set(cerfaAtom, { ...fields, [name]: { ...fields[name], error } });
        }
      },
    []
  );

  const controller = useMemo(
    () => ({
      setField: async (name, value) => {
        patchFields({
          [name]: { value, loading: true, error: undefined, success: false },
        });

        let { result } = validField({
          value,
          name,
          validate: schema[name]?.validate,
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

        if (!error) {
          computeGlobalErrors();
          await setGlobalErrors({ name });
        }

        patchFields({
          [name]: { loading: false, error, success: !error },
        });
      },
      setValues: (values) => {
        let fields = {};
        Object.keys(schema).forEach((key) => {
          fields = { ...fields, [key]: { ...schema[key].defaultState, value: values[key] } };
        });
        console.log(fields);
        setCerfa(fields);
      },
    }),
    [computeGlobalErrors, patchFields, schema, setGlobalErrors]
  );
  return { controller, values: getValues(fields) };
};
