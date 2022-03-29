import { atom, selector, selectorFamily } from "recoil";

export const cerfaAtom = atom({
  key: "cerfaAtom",
  default: {
    siret: { value: "" },
    name: { value: "" },
    start: { value: "" },
    end: { value: "" },
  },
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

export const fieldSelector = selectorFamily({
  key: "fieldSelector",
  get:
    (name) =>
    ({ get }) =>
      get(cerfaAtom)[name],
});
