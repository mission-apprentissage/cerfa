import { employerSchema } from "../blocks/employer/employerSchema";
import { maitreSchema } from "../blocks/maitre/maitreSchema";
import { apprentiSchema } from "../blocks/apprenti/apprentiSchema";
import { logics } from "./logics";
import { contratSchema } from "../blocks/contrat/contratSchema";
import { formationSchema } from "../blocks/formation/formationSchema";

export const cerfaSchema = {
  fields: { ...employerSchema, ...maitreSchema, ...apprentiSchema, ...contratSchema, ...formationSchema },
  logics,
};
