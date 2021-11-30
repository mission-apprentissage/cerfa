import React, { useCallback, useState, useMemo, useRef, useEffect } from "react";
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

import { LockFill } from "../../../../theme/components/icons/LockFill";
import InfoTooltip from "../../../../common/components/InfoTooltip";
import Comment from "../../../../common/components/Comments/Comment";

export default React.memo(
  ({
    path,
    field,
    onAsyncData,
    onSubmittedField,
    hasComments,
    isDisabled,
    noHistory,
    type,
    forceIsErrored,
    ...props
  }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    const [isErrored, setIsErrored] = useState(false);
    const [isAutoFilled, setIsAutoFilled] = useState(false);

    const prevOnAsyncDataRef = useRef();
    // const prevIsDisabledRef = useRef();

    const borderBottomColor = useMemo(
      () => (validated ? "green.500" : isErrored ? "error" : isAutoFilled ? "green.400" : "grey.600"),
      [isAutoFilled, isErrored, validated]
    );
    const name = useMemo(() => path.replaceAll(".", "_"), [path]);

    useEffect(() => {
      prevOnAsyncDataRef.current = onAsyncData;
      // prevIsDisabledRef.current = isDisabled;
      setIsErrored(forceIsErrored);
    }, [onAsyncData, forceIsErrored]);
    const prevOnAsyncData = prevOnAsyncDataRef.current;
    // const prevIsDisabled = prevIsDisabledRef.current;

    const { values, handleChange: handleChangeFormik, errors, setFieldValue, setErrors } = useFormik({
      initialValues: {
        [name]: field?.value || "",
      },
      validationSchema: Yup.object().shape({
        [name]: Yup.string()
          .matches(new RegExp(field?.pattern), { message: `${field?.validateMessage}`, excludeEmptyString: true })
          .required(field?.requiredMessage),
      }),
    });

    let handleChange = useCallback(
      async (e) => {
        e.persist();
        const val = e.target.value;
        setValidated(false);
        setIsErrored(false);

        if (field?.pattern) {
          const regex = new RegExp(field?.pattern);
          const valid = regex.test(val);
          if (!valid) {
            return handleChangeFormik(e);
          }
        }

        if (!field?.doAsyncActions) {
          setFieldValue(name, val);
          setIsErrored(false);
          setValidated(true);
          return await onSubmittedField(path, val);
        }

        setFieldValue(name, val);
        setIsLoading(true);
        const { successed, data, message } = await field?.doAsyncActions(val, onAsyncData);
        setIsLoading(false);
        setErrors({ [name]: message });
        await onSubmittedField(path, data);
        if (successed) {
          setIsErrored(false);
          setValidated(true);
        } else {
          setValidated(false);
          setIsErrored(true);
        }
      },
      [field, setFieldValue, name, onAsyncData, setErrors, handleChangeFormik, onSubmittedField, path]
    );

    // console.log(field, path, field?.value, values[name]);
    // console.log(path, onAsyncData, prevOnAsyncData, values[name], field?.value);
    // console.log(path, isDisabled, prevIsDisabled);

    let shouldBeDisabled = isDisabled;
    // if (prevIsDisabled !== undefined && (!isDisabled || !prevIsDisabled)) {
    //   shouldBeDisabled = false;
    //   prevIsDisabledRef.current = false;
    // }

    if (
      prevOnAsyncData &&
      prevOnAsyncData.value &&
      onAsyncData &&
      onAsyncData.value &&
      prevOnAsyncData.value !== onAsyncData.value
    ) {
      prevOnAsyncDataRef.current = { value: null };
      handleChange({ persist: () => {}, target: { value: field?.value } });
    }

    if (values[name] === "" && field?.value !== values[name]) {
      setFieldValue(name, field?.value);
      setIsAutoFilled(true);
    }

    if (!field) return null;

    return (
      <FormControl isRequired mt={2} isInvalid={errors[name]} {...props}>
        <FormLabel>{field?.label}</FormLabel>
        <HStack>
          <InputGroup>
            <Input
              type={type}
              name={name}
              onChange={handleChange}
              value={values[name]}
              required
              pattern={field?.pattern}
              placeholder={field?.description}
              variant={validated ? "valid" : isAutoFilled ? "autoFilled" : "outline"}
              isInvalid={isErrored}
              maxLength={field?.maxLength}
              isDisabled={shouldBeDisabled}
              _focus={{
                borderBottomColor: borderBottomColor,
                boxShadow: "none",
                outlineColor: "none",
              }}
              _focusVisible={{
                borderBottomColor: borderBottomColor,
                boxShadow: "none",
                outline: "2px solid",
                outlineColor: validated ? "green.500" : isErrored ? "error" : isAutoFilled ? "green.400" : "#2A7FFE",
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
            {!shouldBeDisabled && (isLoading || validated || isErrored) && (
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

          {shouldBeDisabled && (
            <Box>
              <LockFill color={"grey.600"} w="20px" h="20px" />
            </Box>
          )}
          <Box>
            <InfoTooltip
              description={field?.description}
              example={field?.example}
              history={field?.history}
              noHistory={noHistory}
            />
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
  }
);
