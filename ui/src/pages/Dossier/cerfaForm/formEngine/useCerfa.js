import { useRecoilCallback, useSetRecoilState } from "recoil";
import { cerfaAtom, cerfaSetter, fieldSelector, valuesSelector } from "./atoms";
import { validField } from "../common/utils/validField";
import { useMemo, useRef } from "react";
import { dossierAtom } from "../../../../common/hooks/useDossier/dossierAtom";
import { isFalsyValue } from "../common/utils/isFalsyValue";
import { dependences } from "../schema/logics";
import { findDefinition } from "./utils";
import { getValues } from "../common/utils/getValues";
import { isRequired } from "../common/utils/isRequired";
import { isHidden } from "../common/utils/isHidden";

export const useCerfa = ({ schema } = {}) => {
  const setCerfa = useSetRecoilState(cerfaAtom);
  const patchFields = useSetRecoilState(cerfaSetter);

  const getData = useRecoilCallback(({ snapshot }) => async () => ({
    dossier: await snapshot.getPromise(dossierAtom),
    fields: await snapshot.getPromise(cerfaAtom),
    values: await snapshot.getPromise(valuesSelector),
  }));

  const abortControllers = useRef({});

  const computeGlobal = async ({ name }) => {
    const rules = schema.logics.filter((logic) => logic.deps.includes(name));
    abortControllers.current[name] = new AbortController();

    let err = false;
    for (let logic of rules) {
      const { values, dossier, fields } = await getData();

      try {
        const signal = abortControllers.current[name].signal;
        const { cascade, error, warning } = (await logic.process({ fields, values, signal, dossier, name })) ?? {};
        if (error) {
          patchFields({ [name]: { error, success: false, warning: undefined } });
        } else if (warning) {
          patchFields({ [name]: { warning } });
        }

        if (cascade) {
          await Promise.all(
            Object.keys(cascade).map(
              async (key) =>
                await onCascadeField({
                  name: key,
                  patch: cascade[key],
                })
            )
          );
        }

        if (error) {
          err = true;
          break;
        }
      } catch (e) {
        if (e.name !== "AbortError") throw e;
      }
    }
    if (err) return;
    await validDeps({ name });
  };

  const validDeps = async ({ name }) => {
    const { fields, values } = await getData();
    if (dependences[name]) {
      await Promise.all(
        dependences[name].map(async (dep) => {
          const depField = fields[dep];
          if (!depField.touched && isFalsyValue(depField.value)) return;

          const { error } = await validField({
            values,
            field: depField,
            value: depField.value,
          });
          patchFields({ [dep]: { error, success: !error } });
        })
      );
    }
  };

  const onCascadeField = async ({ name, patch }) => {
    patch = patch ? { ...patch } : patch;
    await registerField(name, patch);
    const { fields, values } = await getData();

    if (patch === undefined) {
      patchFields({ [name]: undefined });
      return;
    }

    const value = patch.value;
    if (value === undefined || value === fields[name]?.value) {
      delete patch.value;
      patchFields({ [name]: { ...patch, loading: false } });
      return;
    }

    abortControllers.current[name]?.abort();
    const { error } = await validField({
      values,
      field: fields[name],
      value,
    });
    patchFields({ [name]: { ...patch, error, loading: false, success: !error } });

    if (error) return;

    // await validDeps({ name });
    await computeGlobal({ name });
  };

  const getValue = useRecoilCallback(
    ({ snapshot }) =>
      async (name) =>
        (await snapshot.getPromise(cerfaAtom))[name].value
  );

  const processField = async ({ name, value }) => {
    abortControllers.current[name]?.abort();
    const { fields, values } = await getData();
    const { error } = await validField({ values, field: fields[name], value });
    patchFields({ [name]: { error, warning: undefined, loading: !error, success: !error, value } });
    if (error) return;
    await computeGlobal({ name });
    patchFields({ [name]: { loading: false } });
  };

  const getFields = useRecoilCallback(
    ({ snapshot }) =>
      async () =>
        await snapshot.getPromise(cerfaAtom)
  );

  const registerField = useRecoilCallback(({ snapshot }) => async (name, fieldDefinition) => {
    const field = await snapshot.getPromise(fieldSelector(name));
    if (field) return;
    const fieldSchema = findDefinition({ name, schema }) ?? fieldDefinition;
    if (!fieldSchema) throw new Error(`Field ${name} is not defined.`);
    patchFields({ [name]: fieldSchema });
  });

  const getInvalidFields = async (fieldNames, trigger = false) => {
    const { fields, values } = await getData();
    const invalidNames = getInvalidFieldNames(fieldNames, fields);
    if (trigger) {
      const patch = {};
      for (let name of invalidNames) {
        const { error } = await validField({ values, field: fields[name], value: fields[name].value });
        if (!fields[name].error) {
          patch[name] = { error };
        }
      }
      patchFields(patch);
    }
    return invalidNames.map((name) => fields[name]);
  };

  const controller = useMemo(() => {
    const observers = {};
    return {
      getInvalidFields,
      setField: async (name, value) => {
        patchFields({ [name]: { value } });
        setTimeout(async () => {
          const currentValue = await getValue(name);
          await processField({ name, value: currentValue });
          controller.dispatch("CHANGE", await getFields());
        });
      },
      setFields: (fields) => setCerfa(fields),
      dispatch: (name, data) => (observers[name] ?? []).forEach((handler) => handler(data)),
      on(eventName, handler) {
        observers[eventName] = observers[eventName] ?? [];
        observers[eventName] = [...observers[eventName], handler];
      },
      off(eventName, handler) {
        observers[eventName] = observers[eventName] ?? {};
        observers[eventName] = observers[eventName].filter((item) => item !== handler);
      },
    };
  }, [patchFields, schema, setCerfa]);
  return { controller };
};

const getInvalidFieldNames = (fieldNames, fields) => {
  const values = getValues(fields);
  return fieldNames.filter((current) => {
    const field = fields[current];
    if (!field) return false;
    const required = isRequired(field, values);
    const hidden = isHidden(field, values);
    return (required || field.error) && !hidden && !field.success;
  });
};
