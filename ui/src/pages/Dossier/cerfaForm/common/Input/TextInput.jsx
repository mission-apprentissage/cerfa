import { Input as ChackraInput } from "@chakra-ui/react";
import {
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  InputGroup,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import React from "react";
import { LockFill } from "../../../../../theme/components/icons";

export const TextInput = (props) => {
  const { name, onChange, error, value, success, loading, locked } = props;
  return (
    <CommonInput {...props}>
      <ChackraInput
        isInvalid={!!error}
        name={name}
        disabled={locked}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        placeholder={name}
      />
    </CommonInput>
  );
};

const CommonInput = ({ name, error, success, loading = false, locked, children, label = "", isRequired = false }) => (
  <FormControl isRequired={isRequired} isInvalid={!!error} mt={2}>
    <FormLabel color={locked ? "disablegrey" : "labelgrey"}>{label}</FormLabel>
    <HStack>
      <InputGroup id={`${name}_group_input`}>
        {children}
        <InputRightElement
          children={
            <Center w="40px" h="40px" ml={"0 !important"}>
              {loading && <Spinner />}
              {locked && <LockFill color={"disablegrey"} boxSize="4" />}
            </Center>
          }
        />
      </InputGroup>
    </HStack>
    {error && <FormErrorMessage>{error}</FormErrorMessage>}
  </FormControl>
);
