import { memo } from "react";
import { Input } from "../Input";
import { useRecoilValue } from "recoil";
import { fieldSelector } from "../atoms";

export const InputController = memo(({ name, controller, label, isRequired = false }) => {
  const field = useRecoilValue(fieldSelector(name));
  return (
    <Input
      {...field}
      label={label}
      isRequired={isRequired}
      name={name}
      onChange={(value) => controller.setField(name, value)}
    />
  );
});
