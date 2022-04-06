import { memo, useCallback } from "react";
import { Input } from "./Input";
import { useRecoilValue } from "recoil";
import { fieldSelector, valuesSelector } from "../../formEngine/atoms";
import { useCerfaController } from "../CerfaControllerContext";
import { isHidden } from "../utils/isHidden";
import { isRequired } from "../utils/isRequired";
import { getLabel } from "../utils/getLabel";

export const InputController = memo(({ name, fieldDefinition, autoHide = true, fieldType, onChange }) => {
  const field = useRecoilValue(fieldSelector(name));

  if (!field) throw new Error(`Field ${name} is not defined.`);

  const controller = useCerfaController();

  const handle = useCallback(
    (value) => {
      controller.setField(name, value);
      onChange?.(value);
    },
    [controller, name, onChange]
  );
  const values = useRecoilValue(valuesSelector);

  const hidden = autoHide && isHidden(field, values);
  const required = isRequired(field, values);
  const label = getLabel(field, values);

  if (hidden) return <></>;
  return (
    <Input
      fieldType={fieldType ?? "text"}
      name={name}
      {...field}
      value={field.value ?? ""}
      onChange={handle}
      isRequired={required}
      label={label}
    />
  );
});
