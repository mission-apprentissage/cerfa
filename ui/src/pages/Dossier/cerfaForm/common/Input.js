import React, { memo } from "react";
import { TextInput } from "./Input/TextInput";

export const Input = memo(({ type = "text", ...props }) => {
  const Component = TypesMapping[type];
  return <Component {...props} />;
});

const TypesMapping = {
  text: TextInput,
};
