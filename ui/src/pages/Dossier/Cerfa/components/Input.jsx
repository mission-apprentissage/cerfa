import React, { useCallback, useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputGroup,
  HStack,
  Box,
  Spinner,
  Center,
  InputRightElement,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";

import InfoTooltip from "../../../../common/components/InfoTooltip";
import Comment from "../../../../common/components/Comments/Comment";

import { useCerfa } from "../../../../common/hooks/useCerfa";

export default ({ path, hasComments, isDisabled, noHistory, ...props }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isErrored, setIsErrored] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const { cerfa, getField, onSubmittedField } = useCerfa();

  const {
    value: dbValue,
    label,
    requiredMessage,
    validateMessage,
    pattern,
    description,
    example,
    maxLength,
    onFetch,
    history,
  } = getField(cerfa, path);

  const name = path.replaceAll(".", "_");
  const { values, handleChange: handleChangeFormik, handleSubmit, errors, setFieldValue, setErrors } = useFormik({
    initialValues: {
      [name]: dbValue || "",
    },
    validationSchema: Yup.object().shape({
      [name]: Yup.string()
        .matches(new RegExp(pattern), { message: `${validateMessage}`, excludeEmptyString: true })
        .required(requiredMessage),
    }),
    onSubmit: (values) => {
      return new Promise(async (resolve) => {
        resolve("onSubmitHandler publish complete");
      });
    },
  });

  let handleChange = useCallback(
    async (e) => {
      e.persist();
      const val = e.target.value;
      setValidated(false);
      setIsErrored(false);

      const regex = new RegExp(pattern);
      const valid = regex.test(val);
      if (!valid) {
        return handleChangeFormik(e);
      }
      setFieldValue(name, val);
      setIsLoading(true);
      const { successed, data, message } = await onFetch(val);
      setIsLoading(false);
      setErrors({ [name]: message });
      if (successed) {
        setIsErrored(false);
        setValidated(true);
        await onSubmittedField(data);
        // await onSubmitted(data);
        // await onSubmitted({ [path]: values[name] });
        handleSubmit();
      } else {
        setValidated(false);
        setIsErrored(true);
      }
    },
    [handleChangeFormik, handleSubmit, name, onFetch, onSubmittedField, pattern, setErrors, setFieldValue]
  );

  if (values[name] === "" && dbValue !== values[name]) {
    setFieldValue(name, dbValue);
    setIsAutoFilled(true);
  }

  let borderBottomColor = validated ? "green.500" : isErrored ? "error" : isAutoFilled ? "bluesoft.400" : "grey.600";
  return (
    <FormControl isRequired mt={2} isInvalid={errors[name]} {...props}>
      <FormLabel>{label}</FormLabel>
      <HStack>
        <InputGroup>
          <Input
            type="text"
            name={name}
            onChange={handleChange}
            value={values[name]}
            required
            pattern={pattern}
            placeholder={description}
            variant={validated ? "valid" : isAutoFilled ? "autoFilled" : "outline"}
            isInvalid={isErrored}
            maxLength={maxLength}
            isDisabled={isDisabled}
            _focus={{
              borderBottomColor: borderBottomColor,
              boxShadow: "none",
              outlineColor: "none",
            }}
            _focusVisible={{
              borderBottomColor: borderBottomColor,
              boxShadow: "none",
              outline: "2px solid",
              outlineColor: validated ? "green.500" : isErrored ? "error" : isAutoFilled ? "bluesoft.400" : "#2A7FFE",
              outlineOffset: "2px",
            }}
            _invalid={{
              borderBottomColor: borderBottomColor,
              boxShadow: "none",
              outline: "2px solid",
              outlineColor: "error",
              outlineOffset: "2px",
            }}
            _hover={{
              borderBottomColor: borderBottomColor,
            }}
            _disabled={{
              fontStyle: "italic",
              cursor: "not-allowed",
              opacity: 1,
            }}
          />
          {!isDisabled && (
            <InputRightElement
              children={
                <Center
                  bg="grey.200"
                  w="40px"
                  h="40px"
                  ml={isLoading || validated || isErrored ? "0 !important" : "-40px !important"}
                  borderBottom="2px solid"
                  borderBottomColor={borderBottomColor}
                >
                  {isLoading && <Spinner />}
                  {validated && <CheckIcon color="green.500" />}
                  {isErrored && (
                    <CloseIcon
                      color="error"
                      onClick={() => {
                        setFieldValue(name, "");
                      }}
                      cursor="pointer"
                    />
                  )}
                </Center>
              }
            />
          )}
        </InputGroup>

        <Box>
          <InfoTooltip description={description} example={example} history={history} noHistory />
        </Box>
        {hasComments && (
          <Box>
            <Comment context={path} />
          </Box>
        )}
      </HStack>
      {errors[name] && <FormErrorMessage>{errors[name]}</FormErrorMessage>}
    </FormControl>
  );
};
