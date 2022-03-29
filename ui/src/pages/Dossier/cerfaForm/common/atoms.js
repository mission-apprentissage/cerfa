import { atom, selector, selectorFamily } from "recoil";
import { getValues } from "./utils/getValues";

export const cerfaAtom = atom({
  key: "cerfaAtom",
  default: {},
});

export const cerfaSetter = selector({
  key: "cerfaSetter",
  get: () => undefined,
  set: ({ get, set }, payload) => {
    const cerfa = get(cerfaAtom);
    let newState = { ...cerfa };
    Object.entries(payload).forEach(([name, patch]) => {
      newState = { ...newState, [name]: { ...newState[name], ...patch } };
    });
    set(cerfaAtom, newState);
  },
});

export const valueSelector = selectorFamily({
  key: "valueSelector",
  get:
    (name) =>
    ({ get }) =>
      get(cerfaAtom)[name]?.value,
});

export const valuesSelector = selector({ key: "", get: ({ get }) => getValues(get(cerfaAtom)) });

export const fieldSelector = selectorFamily({
  key: "fieldSelector",
  get:
    (name) =>
    ({ get }) =>
      get(cerfaAtom)[name],
});
