import { patchFieldReducer } from "./patchFieldReducer";

export const cleanGlobalRules = ({ fields, name, rules }) => {
  rules
    .filter((rule) => rule.deps.includes(name))
    .forEach((rule) => {
      if (!rule.currentTarget) return;
      fields = patchFieldReducer({
        fields,
        name: rule.currentTarget,
        patch: { error: undefined, success: true },
      });
    });
  return fields;
};
