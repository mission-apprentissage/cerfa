import React, { memo } from "react";
import { TextInput } from "./TextInput";
import { Box, FormControl, FormErrorMessage, FormHelperText, FormLabel, HStack, InputGroup } from "@chakra-ui/react";
import { RadioInput } from "./RadioInput";
import InfoTooltip from "../../../../../common/components/InfoTooltip";
import { Select } from "./Select";
import { ConsentInput } from "./ConsentInput";
import { DateInput } from "./DateInput";

export const Input = memo((props) => {
  const { name, label, locked, isRequired, error, description, fieldType = "text", warning } = props;
  const Component = TypesMapping[fieldType] ?? (() => <></>);

  return (
    <FormControl isRequired={isRequired && !!label} isInvalid={!!error} mt={2} id={name.replaceAll(".", "_")}>
      <FormLabel color={locked ? "disablegrey" : "labelgrey"}>{label}</FormLabel>
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

const TypesMapping = {
  text: TextInput,
  number: TextInput,
  email: TextInput,
  phone: TextInput,
  date: DateInput,
  radio: RadioInput,
  select: Select,
  consent: ConsentInput,
};
