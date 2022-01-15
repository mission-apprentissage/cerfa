import React, { useCallback, useState, useMemo, useRef, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input as ChackraInput,
  Select,
  Radio,
  Checkbox,
  FormErrorMessage,
  InputGroup,
  HStack,
  Box,
  RadioGroup,
  Spinner,
  Center,
  InputRightElement,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import PhoneInput from "react-phone-input-2";
import { IMask, IMaskInput } from "react-imask";
import { useFormik } from "formik";
// import debounce from "lodash.debounce";
import throttle from "lodash.throttle";
import * as Yup from "yup";
import { isDate } from "date-fns";

import { LockFill } from "../../../../theme/components/icons/LockFill";
import InfoTooltip from "../../../../common/components/InfoTooltip";
import Comment from "../../../../common/components/Comments/Comment";
import { Check } from "../../../../theme/components/icons";

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

const buildValidationSchema = (field, name, type, isRequiredInternal, countryCode) => {
  const stringPattern = Yup.string().matches(new RegExp(field?.pattern), {
    message: `${field?.validateMessage}`,
    excludeEmptyString: true,
  });

  let validatorField = stringPattern;

  if (type === "email") {
    validatorField = validatorField.email("Le courriel doit être au format correct");
  }

  // if (type === "date") {
  //   validatorField = Yup.string().matches(/^([1-2][09][0-9][0-9])-(0[1-9]|1[0-2])-(0[1-9]|[1-3][0-9])$/, {
  //     message: `${field?.validateMessage}`,
  //     excludeEmptyString: true,
  //   });
  // }

  if (type === "phone" && countryCode === "fr") {
    validatorField = validatorField.length(11, "Le numéro de téléphone n'est pas au bon format");
  }

  const finalValidator = isRequiredInternal ? validatorField.required(field?.requiredMessage) : validatorField;

  return Yup.object().shape({
    [name]: finalValidator,
  });
};

const MaskedInput = React.memo(({ onChange, mask, value, maskblocks, max, forbiddenstartwith, ...props }) => {
  const inputRef = useRef(null);
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    if (value !== "") setInternalValue(value);
  }, [value]);

  const blocks = useMemo(() => {
    return maskblocks.reduce((acc, item) => {
      if (item.mask === "MaskedRange")
        acc[item.name] = {
          mask: IMask.MaskedRange,
          from: item.from,
          to: item.to,
        };
      else if (item.mask === "MaskedEnum")
        acc[item.name] = {
          mask: IMask.MaskedEnum,
          enum: item.enum,
        };
      else
        acc[item.name] = {
          mask: item.mask,
        };
      return acc;
    }, {});
  }, [maskblocks]);

  return (
    <ChackraInput
      {...props}
      as={IMaskInput}
      ref={inputRef}
      value={internalValue}
      mask={mask}
      blocks={blocks}
      lazy={false}
      placeholderChar="_"
      unmask={true}
      onAccept={(value, mask) => {
        if (max === value.length || value === "") {
          onChange({ persist: () => {}, target: { value } });
        }
        if (forbiddenstartwith && forbiddenstartwith.includes(value[0])) {
          // setInternalValue(`0${value[0]}`);
          setInternalValue(`0`);
        }
        if (forbiddenstartwith && forbiddenstartwith.includes(value[0] + value[1])) {
          // setInternalValue(`0${value[0]}${value[1]}`);
          setInternalValue(`09`);
        }
      }}
    />
  );
});

export default React.memo(
  ({
    path,
    field,
    onAsyncData,
    onSubmittedField,
    hasComments,
    hasInfo = true,
    noHistory,
    type,
    format = (val) => val,
    parse = (val) => val,
    precision = 2,
    numberStepper = false,
    forceUpperCase = false,
    label,
    isRequired,
    ...props
  }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    const [isErrored, setIsErrored] = useState(false);
    const [shouldBeDisabled, setShouldBeDisabled] = useState(false);
    const [fromInternal, setFromInternal] = useState(false);
    const [countryCode, setCountryCode] = useState("fr");

    const prevOnAsyncDataRef = useRef();
    const prevFieldValueRef = useRef("");
    const prevFieldLockRef = useRef(false);
    const initRef = useRef(0);

    const borderBottomColor = useMemo(
      () => (validated ? "green.500" : isErrored ? "error" : "grey.600"),
      [isErrored, validated]
    );
    const name = useMemo(() => path.replaceAll(".", "_"), [path]);

    const Input = useMemo(() => {
      return !field?.mask ? ChackraInput : MaskedInput;
    }, [field?.mask]);

    const isRequiredInternal = useMemo(() => {
      return field?.isNotRequiredForm ? !field?.isNotRequiredForm : isRequired !== undefined ? isRequired : true; // TODO tired....
    }, [field?.isNotRequiredForm, isRequired]);

    const { values, errors, setFieldValue, setErrors } = useFormik({
      initialValues: {
        [name]: "",
      },
    });

    let handleChange = useCallback(
      async (e) => {
        e.persist();
        const val =
          type === "numberPrefixed"
            ? parse(e.target.value)
            : forceUpperCase
            ? e.target.value.toUpperCase().trimStart()
            : e.target.value.trimStart();

        setValidated(false);
        setIsErrored(false);

        const { isValid } = await validate(buildValidationSchema(field, name, type, isRequiredInternal, countryCode), {
          [name]: val,
        });

        console.log("handleChange", val, isValid, isDate(val));

        if (!isValid) {
          setFromInternal(true);
          return setFieldValue(name, val);
        }

        setFieldValue(name, val);

        if (!field?.doAsyncActions) {
          if (!onSubmittedField) {
            return false;
          }
          return await onSubmittedField(path, val);
        }

        setIsLoading(true);
        const { successed, data, message } = await field?.doAsyncActions(val, onAsyncData);
        setIsLoading(false);

        // console.log({ successed, data, message });
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
      [
        type,
        parse,
        forceUpperCase,
        field,
        name,
        isRequiredInternal,
        countryCode,
        setFieldValue,
        onAsyncData,
        setErrors,
        onSubmittedField,
        path,
      ]
    );

    // const debouncedEventHandler = useMemo(() => debounce(handleChange, 300), []);
    const throttledEventHandler = useMemo(() => throttle(handleChange, 100), [handleChange]);

    useEffect(() => {
      (async () => {
        prevOnAsyncDataRef.current = onAsyncData;
        let fieldValue = field?.value;

        let validationSchema = buildValidationSchema(field, name, type, isRequiredInternal, countryCode);

        //
        const { isValid: isValidFieldValue } = await validate(validationSchema, {
          [name]: fieldValue,
        });
        // console.log(path, ">>>>", initRef.current, values[name], fieldValue, isValidFieldValue);
        if (initRef.current === 0) {
          if (field) {
            // console.log("Init");
            setShouldBeDisabled(field.locked);
            prevFieldLockRef.current = field.locked;
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
            // console.log("Outside Update", prevFieldValueRef, fieldValue, field?.forceUpdate, path);
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
          } else if (prevFieldLockRef.current !== field?.locked) {
            setShouldBeDisabled(field?.locked);
            prevFieldLockRef.current = field?.locked;
          } else {
            if (fromInternal) {
              const { isValid: isValidInternalValue, error: errorInternalValue } = await validate(validationSchema, {
                [name]: values[name],
              });
              // console.log(isValidInternalValue, errorInternalValue);
              if (!isValidInternalValue) {
                setErrors({ [name]: errorInternalValue.message });
                setIsErrored(true);
                setValidated(false);
              }
              setFromInternal(false);
            } else if (field?.triggerValidation) {
              setIsLoading(true);
              const { successed, message } = await field?.doAsyncActions(fieldValue, onAsyncData);
              setIsLoading(false);

              if (fieldValue !== "") {
                if (successed) {
                  setIsErrored(false);
                  setValidated(true);
                  setErrors({ [name]: message });
                } else {
                  setValidated(false);
                  setIsErrored(true);
                  setErrors({ [name]: message });
                }
              }
            }
          }
        }
        //
      })();
      return () => {
        throttledEventHandler.cancel();
      };
    }, [
      onAsyncData,
      field,
      path,
      name,
      setFieldValue,
      values,
      setErrors,
      onSubmittedField,
      fromInternal,
      handleChange,
      type,
      countryCode,
      throttledEventHandler,
      isRequiredInternal,
    ]);

    const prevOnAsyncData = prevOnAsyncDataRef.current;

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
      <FormControl isRequired={isRequiredInternal} mt={2} isInvalid={errors[name]} {...props}>
        {(type === "text" ||
          type === "email" ||
          type === "number" ||
          type === "phone" ||
          type === "numberPrefixed" ||
          type === "date" ||
          type === "select") && (
          <FormLabel color={shouldBeDisabled ? "disablegrey" : "labelgrey"}>{label || field?.label}</FormLabel>
        )}
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
                value={values[name]}
              >
                {field.options[0].options && (
                  <>
                    {field.options.map((group, k) => {
                      return (
                        <optgroup label={group.name} key={k}>
                          {group.options.map((option, j) => {
                            return (
                              <option key={j} value={option.label} disabled={option.locked}>
                                {option.label}
                              </option>
                            );
                          })}
                        </optgroup>
                      );
                    })}
                  </>
                )}
                {field.options[0].label && (
                  <>
                    {field.options.map((option, j) => {
                      return (
                        <option key={j} value={option.label} disabled={option.locked}>
                          {option.label}
                        </option>
                      );
                    })}
                  </>
                )}
              </Select>
            )}
            {(type === "text" || type === "email" || type === "date") && (
              <Input
                type={type}
                name={name}
                onChange={!field?.inputmask ? throttledEventHandler : handleChange}
                value={values[name]}
                required={isRequiredInternal}
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
                mask={field?.mask}
                maskblocks={field?.maskBlocks}
                max={field?.max}
                forbiddenstartwith={field?.forbiddenStartWith}
              />
            )}
            {type === "number" && (
              <NumberInput
                name={name}
                onChange={(val) => handleChange({ persist: () => {}, target: { value: val } })}
                value={values[name]}
                precision={precision}
                min={0}
                required={isRequiredInternal}
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
              >
                <NumberInputField />
                {numberStepper && (
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                )}
              </NumberInput>
            )}
            {type === "numberPrefixed" && (
              <NumberInput
                name={name}
                onChange={(val) => handleChange({ persist: () => {}, target: { value: val } })}
                value={format(values[name])}
                required={isRequiredInternal}
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
              >
                <NumberInputField />
              </NumberInput>
            )}
            {type === "radio" && (
              <HStack>
                <FormLabel color={shouldBeDisabled ? "disablegrey" : "labelgrey"}>{label || field?.label}</FormLabel>
                <RadioGroup value={values[name]}>
                  <HStack>
                    {field.options.map((option, k) => {
                      return (
                        <Radio
                          key={k}
                          type={type}
                          name={name}
                          value={option.label}
                          checked={values[name] === option.label}
                          onChange={handleChange}
                          isDisabled={option.locked}
                        >
                          {option.label}
                        </Radio>
                      );
                    })}
                  </HStack>
                </RadioGroup>
              </HStack>
            )}
            {type === "consent" && (
              <>
                <Checkbox
                  name={name}
                  onChange={handleChange}
                  value="true"
                  isChecked={values[name] === "true"}
                  isDisabled={shouldBeDisabled}
                  icon={<Check />}
                >
                  {label || field?.label}
                </Checkbox>
              </>
            )}
            {type === "phone" && (
              <PhoneInput
                name={name}
                value={values[name]}
                country={"fr"}
                masks={{
                  fr: ". .. .. .. ..",
                }}
                countryCodeEditable={false}
                onChange={async (val, country) => {
                  setCountryCode(country.countryCode);
                  await handleChange({ persist: () => {}, target: { value: val } });
                }}
                disabled={shouldBeDisabled}
                inputClass={`phone-form-input ${validated && "valid"} ${isErrored && "error"}`}
                buttonClass={`phone-form-button ${validated && "valid"} ${isErrored && "error"}`}
              />
            )}
            {(shouldBeDisabled || isLoading || validated || isErrored) && type !== "radio" && (
              <InputRightElement
                position={!hasInfo ? "inherit" : "absolute"}
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

          {hasInfo && (
            <Box>
              <InfoTooltip
                description={field?.description}
                example={field?.example}
                history={field?.history}
                noHistory={noHistory}
              />
            </Box>
          )}
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
