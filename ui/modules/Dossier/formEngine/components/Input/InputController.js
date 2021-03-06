import { memo, useCallback } from "react";
import { useRecoilValue } from "recoil";
import { fieldSelector } from "../../atoms";
import { useCerfaController } from "../../CerfaControllerContext";
import lodashDebounce from "lodash.debounce";

import { InputField } from "./Input";

// eslint-disable-next-line react/display-name
export const InputController = memo(({ name, fieldType, mt, mb, ml, mr, w, debounce = 0 }) => {
  const controller = useCerfaController();

  const handle = useCallback(
    (value, extra) => {
      controller.setField(name, value, { extra });
    },
    [controller, name]
  );

  const field = useRecoilValue(fieldSelector(name));

  if (!field) return <></>;

  if (!field) throw new Error(`Field ${name} is not defined.`);

  return (
    <InputField
      fieldType={fieldType ?? "text"}
      name={name}
      {...field}
      value={field.value ?? ""}
      onChange={debounce ? lodashDebounce(handle, debounce, { trailing: true }) : handle}
      isRequired={field.required}
      mb={mb}
      mt={mt}
      ml={ml}
      mr={mr}
      w={w}
      success={false}
    />
  );
});
