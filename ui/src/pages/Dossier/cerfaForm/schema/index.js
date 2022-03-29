import { employerSchema } from "./employerSchema";
import { maitreSchema } from "./maitreSchema";
import { coherenceRules } from "./coherenceRules";

export const cerfaSchema = {
  fields: { ...employerSchema, ...maitreSchema },
  coherenceRules,
};

export const defaultValues = Object.fromEntries(
  Object.entries(cerfaSchema.fields).map(([name, { defaultState }]) => [name, defaultState.value])
);

export const fieldKeys = Object.keys(cerfaSchema.fields);
