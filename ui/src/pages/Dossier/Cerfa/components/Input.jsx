import React, { useCallback, useState, useMemo, useRef, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
  InputGroup,
  HStack,
  Box,
  Spinner,
  Center,
  InputRightElement,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { DateTime } from "luxon";
import { useFormik } from "formik";
import * as Yup from "yup";

import { LockFill } from "../../../../theme/components/icons/LockFill";
import InfoTooltip from "../../../../common/components/InfoTooltip";
import Comment from "../../../../common/components/Comments/Comment";

const validate = async (validationSchema, obj) => {
  let isValid = false;
  let error = null;
  try {
    await validationSchema.validate(obj);
    isValid = true;
  } catch (err) {
    error = err;
  }
  return { isValid, error };
};

export default React.memo(({ path, field, onAsyncData, onSubmittedField, hasComments, noHistory, type, ...props }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isErrored, setIsErrored] = useState(false);
  const [shouldBeDisabled, setShouldBeDisabled] = useState(false);
  const [fromInternal, setFromInternal] = useState(false);

  const prevOnAsyncDataRef = useRef();
  const prevFieldValueRef = useRef("");
  const initRef = useRef(0);

  const borderBottomColor = useMemo(
    () => (validated ? "green.500" : isErrored ? "error" : "grey.600"),
    [isErrored, validated]
  );
  const name = useMemo(() => path.replaceAll(".", "_"), [path]);

  const { values, errors, setFieldValue, setErrors } = useFormik({
    initialValues: {
      [name]: "",
    },
  });

  useEffect(() => {
    (async () => {
      prevOnAsyncDataRef.current = onAsyncData;

      const validationSchema = Yup.object().shape({
        [name]: Yup.string()
          .matches(new RegExp(field?.pattern), { message: `${field?.validateMessage}`, excludeEmptyString: true })
          .required(field?.requiredMessage),
      });
      let fieldValue = field?.value;
      if (type === "date") {
        if (fieldValue) {
          fieldValue = DateTime.fromISO(fieldValue).setLocale("fr-FR").toFormat("yyyy-MM-dd");
        }
      }

      //
      const { isValid: isValidFieldValue } = await validate(validationSchema, {
        [name]: fieldValue,
      });
      // console.log(path, ">>>>", initRef.current, values[name], fieldValue, isValidFieldValue);
      if (initRef.current === 0) {
        if (field) {
          // console.log("Init");
          setShouldBeDisabled(field.locked);
          if (values[name] === "") {
            if (fieldValue !== "") {
              if (isValidFieldValue) {
                setFieldValue(name, fieldValue);
                setIsErrored(false);
                setValidated(true);
              } else {
                setShouldBeDisabled(false);
                setFieldValue(name, fieldValue);
              }
            }
          }
          initRef.current = 1;
        }
      } else {
        if (prevFieldValueRef.current !== fieldValue || field?.forceUpdate) {
          // console.log("Outside Update", prevFieldValueRef, fieldValue, field?.forceUpdate);
          setFieldValue(name, fieldValue);
          setShouldBeDisabled(field?.locked);
          if (isValidFieldValue) {
            setIsErrored(false);
            setValidated(true);
          } else {
            setShouldBeDisabled(false);
            setFromInternal(true);
            setIsErrored(true);
            setValidated(false);
          }
          prevFieldValueRef.current = fieldValue;
          if (field?.forceUpdate) {
            await onSubmittedField(path, fieldValue);
          }
        } else {
          if (fromInternal) {
            const { isValid: isValidInternalValue, error: errorInternalValue } = await validate(validationSchema, {
              [name]: values[name],
            });
            console.log(isValidInternalValue, errorInternalValue);
            if (!isValidInternalValue) {
              setErrors({ [name]: errorInternalValue.message });
              setIsErrored(true);
              setValidated(false);
            }
            setFromInternal(false);
          }
        }
      }
      //
    })();
  }, [onAsyncData, field, path, name, setFieldValue, values, setErrors, onSubmittedField, fromInternal, type]);

  const prevOnAsyncData = prevOnAsyncDataRef.current;

  let handleChange = useCallback(
    async (e) => {
      e.persist();
      const val = e.target.value;
      setValidated(false);
      setIsErrored(false);

      console.log("handleChange");

      const validationSchema = Yup.object().shape({
        [name]: Yup.string()
          .matches(new RegExp(field?.pattern), { message: `${field?.validateMessage}`, excludeEmptyString: true })
          .required(field?.requiredMessage),
      });

      const { isValid } = await validate(validationSchema, { [name]: val });

      if (!isValid) {
        setFromInternal(true);
        return setFieldValue(name, val);
      }

      if (!field?.doAsyncActions) {
        if (!onSubmittedField) {
          return setFieldValue(name, val);
        }
        return await onSubmittedField(path, val);
      }

      setFieldValue(name, val);
      setIsLoading(true);
      const { successed, data, message } = await field?.doAsyncActions(val, onAsyncData);
      setIsLoading(false);

      console.log({ successed, data, message });
      setErrors({ [name]: message });
      if (data) {
        return await onSubmittedField(path, data);
      }
      if (successed) {
        setIsErrored(false);
        setValidated(true);
      } else {
        setValidated(false);
        setIsErrored(true);
      }
    },
    [name, field, setFieldValue, onAsyncData, setErrors, onSubmittedField, path]
  );

  if (
    prevOnAsyncData &&
    prevOnAsyncData.value &&
    onAsyncData &&
    onAsyncData.value &&
    prevOnAsyncData.value !== onAsyncData.value
  ) {
    prevOnAsyncDataRef.current = { value: null };
    console.log("onAsyncData");
    handleChange({ persist: () => {}, target: { value: values[name] } });
  }

  if (!field) return null;

  return (
    <FormControl isRequired mt={2} isInvalid={errors[name]} {...props}>
      <FormLabel color={shouldBeDisabled ? "disablegrey" : "labelgrey"}>{field?.label}</FormLabel>
      <HStack>
        <InputGroup>
          {type === "select" && (
            <Select
              name={name}
              isDisabled={shouldBeDisabled}
              variant={validated ? "valid" : "outline"}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onChange={handleChange}
              iconColor={"gray.800"}
              data-testid={`select-${name}`}
              placeholder="Sélectionnez une option"
              // w="90%"
            >
              {typeof field.options[0] === "object" && (
                <>
                  {field.options.map((group, k) => {
                    return (
                      <optgroup label={group.name} key={k}>
                        {group.options.map((option, j) => {
                          return (
                            <option key={j} value={option}>
                              {option}
                            </option>
                          );
                        })}
                      </optgroup>
                    );
                  })}
                </>
              )}
              {typeof field.options[0] === "string" && (
                <>
                  {field.options.map((option, j) => {
                    return (
                      <option key={j} value={option}>
                        {option}
                      </option>
                    );
                  })}
                </>
              )}
            </Select>
          )}
          {(type === "text" || type === "date") && (
            <Input
              type={type}
              name={name}
              onChange={handleChange}
              value={values[name]}
              required
              pattern={field?.pattern}
              placeholder={field?.description}
              variant={validated ? "valid" : "outline"}
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
                outlineColor: validated ? "green.500" : isErrored ? "error" : "#2A7FFE",
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
                borderBottomColor: "#E5E5E5",
              }}
            />
          )}
          {(shouldBeDisabled || isLoading || validated || isErrored) && (
            <InputRightElement
              children={
                <Center
                  bg="grey.200"
                  w="40px"
                  h="40px"
                  ml={
                    isLoading || validated || isErrored
                      ? "0 !important"
                      : shouldBeDisabled
                      ? "-3px !important"
                      : "-40px !important"
                  }
                  borderBottom="2px solid"
                  borderBottomColor={shouldBeDisabled ? "#E5E5E5" : borderBottomColor}
                >
                  {shouldBeDisabled && <LockFill color={"disablegrey"} boxSize="4" />}
                  {isLoading && <Spinner />}
                  {validated && !shouldBeDisabled && <CheckIcon color="green.500" />}
                  {isErrored && (
                    <CloseIcon
                      color="error"
                      onClick={() => {
                        setFromInternal(true);
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
});
