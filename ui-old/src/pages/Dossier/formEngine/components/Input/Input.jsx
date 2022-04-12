import React, { memo, useCallback, useMemo, useState } from "react";
import { validField } from "../../utils/validField";
import { Box, FormControl, FormErrorMessage, FormHelperText, FormLabel, HStack, InputGroup } from "@chakra-ui/react";
import InfoTooltip from "../../../../../common/components/InfoTooltip";
import { TextInput } from "./TextInput";
import { PhoneInput } from "./PhoneInput";
import { DateInput } from "./DateInput";
import { RadioInput } from "./RadioInput";
import { Select } from "./Select";
import { ConsentInput } from "./ConsentInput";

export const Input = memo(
  ({
    error,
    success,
    loading,
    name,
    locked,
    options,
    description,
    warning,
    label,
    fieldType = "text",
    value,
    required,
    min,
    max,
    minLength,
    maxLength,
    pattern,
    mask,
    maskBlocks,
    onChange,
    onSubmit,
    mt,
    mb,
    w,
  }) => {
    const props = useMemo(
      () => ({
        name,
        options,
        locked,
        description,
        warning,
        label,
        fieldType,
        value,
        required,
        min,
        max,
        minLength,
        maxLength,
        pattern,
        mask,
        maskBlocks,
      }),
      [
        description,
        options,
        fieldType,
        label,
        locked,
        mask,
        maskBlocks,
        max,
        maxLength,
        min,
        minLength,
        name,
        pattern,
        required,
        value,
        warning,
      ]
    );
    const [fieldState, setFieldState] = useState({ value });

    const handle = useCallback(
      async (value, extra) => {
        const { error } = await validField({
          field: { ...props, extra },
          value,
        });
        setFieldState({ error, value });
        onChange?.(value, name, extra);
        if (error) return;
        onSubmit?.(value, name, extra);
      },
      [onChange, onSubmit, props, name]
    );

    return (
      <InputField
        {...props}
        {...fieldState}
        loading={loading}
        value={value ?? fieldState.value}
        error={fieldState.error || error}
        onChange={handle}
        mt={mt}
        mb={mb}
        w={w}
      />
    );
  }
);

export const InputField = memo(({ mt, mb, w, ...props }) => {
  const { name, label, locked, isRequired, error, description, fieldType = "text", warning, success } = props;
  const Component = TypesMapping[fieldType] ?? (() => <></>);

  return (
    <FormControl
      isRequired={isRequired && !!label}
      isInvalid={!!error}
      mt={mt ?? 2}
      mb={mb}
      w={w}
      id={name.replaceAll(".", "_")}
    >
      {!NoLabel[fieldType] && <FormLabel color={locked ? "disablegrey" : "labelgrey"}>{label}</FormLabel>}
      <HStack align="center">
        <InputGroup id={`${name}_group_input`}>
          <Component {...props} />
        </InputGroup>
        {description && (
          <Box>
            <InfoTooltip description={description} label={label} />
          </Box>
        )}
      </HStack>
      {warning && <FormHelperText color={"warning"}>{warning}</FormHelperText>}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
});

const NoLabel = {
  consent: true,
};

const TypesMapping = {
  text: TextInput,
  number: TextInput,
  email: TextInput,
  phone: PhoneInput,
  date: DateInput,
  radio: RadioInput,
  select: Select,
  consent: ConsentInput,
};