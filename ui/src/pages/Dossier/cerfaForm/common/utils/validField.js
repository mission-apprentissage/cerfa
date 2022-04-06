import { isRequired } from "./isRequired";
import { isFalsyValue } from "./isFalsyValue";
import * as Yup from "yup";

export const validField = async ({ values, field, value }) => {
  const required = isRequired(field, values);
  if (required && isFalsyValue(value)) {
    return { error: field.requiredMessage ?? "Error" };
  }

  if (field.maxLength && value.length > field.maxLength) {
    return { error: field?.validateMessage };
  }

  if (field.pattern && !new RegExp(field.pattern).test(value)) {
    return { error: field?.validateMessage };
  }

  if (field.fieldType === "email" && !(await isValidEmail(value))) {
    return { error: "Le courriel doit être au format correct" };
  }

  return (await field?.validate?.({ value })) ?? {};
};

const emailValidator = Yup.string().email("Le courriel doit être au format correct");
const isValidEmail = async (value) => {
  try {
    await emailValidator.validate(value);
    return true;
  } catch (e) {
    return false;
  }
};
