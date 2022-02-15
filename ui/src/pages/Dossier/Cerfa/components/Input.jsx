import React, { useCallback, useState, useMemo, useRef, useEffect, forwardRef } from "react";
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
  IconButton,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import PhoneInput from "react-phone-input-2";
import { IMask, IMaskMixin } from "react-imask";
import { useFormik } from "formik";
// import debounce from "lodash.debounce";
import range from "lodash.range";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import throttle from "lodash.throttle";
import * as Yup from "yup";

import { LockFill } from "../../../../theme/components/icons/LockFill";
import InfoTooltip from "../../../../common/components/InfoTooltip";
import Comment from "../../../../common/components/Comments/Comment";
import { Check, IoArrowBackward, IoArrowForward } from "../../../../theme/components/icons";

import { DateTime } from "luxon";
import fr from "date-fns/locale/fr";
registerLocale("fr", fr);

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

  if (type === "phone" && countryCode === "fr") {
    validatorField = validatorField.length(11, "Le numéro de téléphone n'est pas au bon format");
  }

  const finalValidator = isRequiredInternal ? validatorField.required(field?.requiredMessage) : validatorField;

  return Yup.object().shape({
    [name]: finalValidator,
  });
};

const MInput = IMaskMixin(({ inputRef, ...props }) => <ChackraInput {...props} ref={inputRef} />);

const MaskedInput = ({ value, type, precision, min, onChange, mask, maskblocks, unmask, ...props }) => {
  const [internalValue, setInternalValue] = useState(`${value}`);
  const [focused, setFocused] = useState(null);
  const inputRef = useRef(null);
  const prevFieldValueRef = useRef("");

  let blocks = useMemo(() => {
    return maskblocks?.reduce((acc, item) => {
      if (item.mask === "MaskedRange")
        acc[item.name] = {
          mask: IMask.MaskedRange,
          ...(item.placeholderChar ? { placeholderChar: item.placeholderChar } : {}),
          from: item.from,
          to: item.to,
          maxLength: item.maxLength,
          autofix: item.autofix,
          lazy: item.lazy,
        };
      else if (item.mask === "MaskedEnum")
        acc[item.name] = {
          mask: IMask.MaskedEnum,
          ...(item.placeholderChar ? { placeholderChar: item.placeholderChar } : {}),
          enum: item.enum,
          maxLength: item.maxLength,
        };
      else if (item.mask === "Number")
        acc[item.name] = {
          mask: Number,
          radix: ".", // fractional delimiter
          mapToRadix: ["."], // symbols to process as radix
          normalizeZeros: item.normalizeZeros,
          scale: precision,
          signed: item.signed,
          min: min,
          max: item.max,
        };
      else if (item.mask === "Pattern")
        acc[item.name] = {
          mask: new RegExp(item.pattern),
        };
      else
        acc[item.name] = {
          mask: item.mask,
          ...(item.placeholderChar ? { placeholderChar: item.placeholderChar } : {}),
        };
      return acc;
    }, {});
  }, [maskblocks, min, precision]);

  useEffect(() => {
    if (focused !== true && prevFieldValueRef.current !== value) {
      // console.log("Update Value");
      prevFieldValueRef.current = value;
      if (value !== "") setInternalValue(`${value}`);
      else if (internalValue !== "") setInternalValue("");
    }
  }, [focused, internalValue, value]);

  let onComplete = useCallback(
    async (completValue, forced = false) => {
      // console.log("onComplete");
      // if (completValue !== value && (focused === false || forced === true)) {
      if (completValue !== value) {
        // console.log("onChange");
        onChange({ persist: () => {}, target: { value: completValue } });
      }
    },
    [onChange, value]
  );

  return (
    <MInput
      {...props}
      mask={mask}
      unmask={unmask}
      lazy={false}
      placeholderChar="_"
      autofix={true}
      blocks={blocks}
      onAccept={(currentValue, mask) => {
        // console.log("onAccept", currentValue);
        setInternalValue(currentValue);
      }}
      onComplete={onComplete}
      ref={inputRef}
      value={internalValue}
      onFocus={() => {
        // console.log("Focus");
        setFocused(true);
      }}
      onBlur={() => {
        // console.log("Focus out");
        setFocused(false);
        onComplete(internalValue, true);
      }}
    />
  );
};

const DateInput = ({ onChange, value, type, ...props }) => {
  const dateValue = useMemo(() => {
    return value !== "" ? DateTime.fromISO(value).setLocale("fr-FR").toJSDate() : "";
  }, [value]);

  const years = range(1900, 2035);
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Aout",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const CustomDateInput = forwardRef(({ value, onChange, onFocus, isDisabled, onClick, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(value);

    useEffect(() => {
      if (value !== "") setInternalValue(value);
    }, [value]);

    let onComplete = useCallback(
      async (completValue) => {
        if (completValue !== value) {
          onChange({ persist: () => {}, target: { value: completValue } });
        }
      },
      [onChange, value]
    );
    const actions = !isDisabled
      ? { onClick: onClick, onFocus: onFocus }
      : {
          onKeyDown: (e) => {
            e.preventDefault();
          },
        };
    return (
      <MInput
        {...props}
        isDisabled={isDisabled}
        mask="d/m/Y"
        unmask={true}
        lazy={false}
        placeholderChar="_"
        // overwrite={true}
        autofix={true}
        blocks={{
          d: { mask: IMask.MaskedRange, placeholderChar: "j", from: 1, to: 31, maxLength: 2 },
          m: { mask: IMask.MaskedRange, placeholderChar: "m", from: 1, to: 12, maxLength: 2 },
          Y: { mask: IMask.MaskedRange, placeholderChar: "a", from: 1900, to: 2999, maxLength: 4 },
        }}
        onAccept={(currentValue, mask) => {
          if (!isDisabled) setInternalValue(currentValue);
        }}
        onComplete={onComplete}
        ref={ref}
        value={internalValue}
        {...actions}
      />
    );
  });

  const CustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => {
    const yearValue = date.getFullYear() >= 1930 && date.getFullYear() <= 2035 ? date.getFullYear() : 2022;
    return (
      <div
        style={{
          margin: 10,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <IconButton
          isDisabled={prevMonthButtonDisabled}
          variant="unstyled"
          onClick={decreaseMonth}
          minW={2}
          icon={<IoArrowBackward olor={"disablegrey"} boxSize="4" />}
          size="sm"
          mt={-2}
        />
        <select value={yearValue} onChange={({ target: { value } }) => changeYear(value)}>
          {years.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          value={months[date.getMonth()]}
          onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
        >
          {months.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <IconButton
          isDisabled={nextMonthButtonDisabled}
          onClick={increaseMonth}
          variant="unstyled"
          minW={2}
          icon={<IoArrowForward olor={"disablegrey"} boxSize="4" />}
          size="sm"
          mt={-2}
        />
      </div>
    );
  };

  return (
    <DatePicker
      dateFormat="ddMMyyyy"
      locale="fr"
      selected={dateValue}
      closeOnScroll={true}
      renderCustomHeader={CustomHeader}
      customInput={<CustomDateInput {...props} />}
      onChange={(date) => {
        onChange({ persist: () => {}, target: { value: date } });
      }}
      fixedHeight
    />
  );
};

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
    precision = 2,
    numberStepper = false,
    forceUpperCase = false,
    label,
    isRequired,
    min = 0,
    throttleTime = 100,
    debounceTime = 300,
    format = undefined,
    parse = undefined,
    ...props
  }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    const [isErrored, setIsErrored] = useState(false);
    const [shouldBeDisabled, setShouldBeDisabled] = useState(false);
    const [fromInternal, setFromInternal] = useState(false);
    const [countryCode, setCountryCode] = useState("fr");
    const [success, setSuccess] = useState({});
    const [warning, setWarning] = useState({});

    const prevOnAsyncDataRef = useRef();
    const prevFieldValueRef = useRef("");
    const prevFieldLockRef = useRef(false);
    const initRef = useRef(0);
    const triggerRef = useRef(0);

    const borderBottomColor = useMemo(
      () => (validated ? "green.500" : isErrored ? "error" : "grey.600"),
      [isErrored, validated]
    );
    const name = useMemo(() => path.replaceAll(".", "_"), [path]);

    const Input = useMemo(() => {
      return !field?.mask ? ChackraInput : MaskedInput;
    }, [field?.mask]);

    const maskedProps = useMemo(() => {
      return !field?.mask
        ? {}
        : {
            mask: field?.mask,
            maskblocks: field?.maskBlocks,
            unmask: field?.unmask !== undefined ? field?.unmask : true,
          };
    }, [field?.mask, field?.maskBlocks, field?.unmask]);

    const styleProps = useMemo(
      () => ({
        _focus: {
          borderBottomColor: borderBottomColor,
          boxShadow: "none",
          outlineColor: "none",
        },
        _focusVisible: {
          borderBottomColor: borderBottomColor,
          boxShadow: "none",
          outline: "2px solid",
          outlineColor: validated ? "green.500" : isErrored ? "error" : "#2A7FFE",
          outlineOffset: "2px",
        },
        _invalid: {
          borderBottomColor: borderBottomColor,
          boxShadow: "none",
          outline: "2px solid",
          outlineColor: "error",
          outlineOffset: "2px",
        },
        _hover: {
          borderBottomColor: borderBottomColor,
        },
        _disabled: {
          fontStyle: "italic",
          cursor: "not-allowed",
          opacity: 1,
          borderBottomColor: "#E5E5E5",
        },
      }),
      [borderBottomColor, isErrored, validated]
    );

    const isRequiredInternal = useMemo(() => {
      return field?.isNotRequiredForm ? !field?.isNotRequiredForm : isRequired !== undefined ? isRequired : true; // TODO tired....
    }, [field?.isNotRequiredForm, isRequired]);

    const { values, errors, setFieldValue, setErrors } = useFormik({
      initialValues: {
        [name]: "",
      },
    });

    const commonProps = useMemo(
      () => ({
        name,
        value: values[name],
        pattern: field?.pattern,
        placeholder: field?.example ? `Exemple : ${field?.example}` : field?.description,
        variant: validated ? "valid" : "outline",
        id: `${name}_input`,
        isInvalid: isErrored,
        isDisabled: shouldBeDisabled,
        required: isRequiredInternal,
        maxLength: field?.maxLength,
        autoComplete: "off-",
      }),
      [
        field?.description,
        field?.example,
        field?.maxLength,
        field?.pattern,
        isErrored,
        isRequiredInternal,
        name,
        shouldBeDisabled,
        validated,
        values,
      ]
    );

    let convertValue = useCallback(
      (currentValue) => {
        let val = currentValue;
        if (type === "number" && parse) val = parse(val);
        else if (forceUpperCase && type === "text") val = val.toUpperCase().trimStart();
        else if (type === "text") val = val.trimStart();
        else if (type === "date") val = DateTime.fromJSDate(val).setLocale("fr-FR").toFormat("yyyy-MM-dd");
        return val;
      },
      [forceUpperCase, parse, type]
    );

    let handleChange = useCallback(
      async (e) => {
        e.persist();
        let val = convertValue(e.target.value);

        setValidated(false);
        setIsErrored(false);

        const { isValid } = await validate(buildValidationSchema(field, name, type, isRequiredInternal, countryCode), {
          [name]: val,
        });

        // console.log("handleChange", val, isValid);

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
        const { successed, warning, data, message } = await field?.doAsyncActions(val, onAsyncData);
        setIsLoading(false);

        // console.log({ successed, data, message });

        if (successed) setSuccess({ [name]: message });
        else setSuccess({});

        if (warning) setWarning({ [name]: message });
        else setWarning({});

        setErrors({ [name]: message });

        if (data) {
          return await onSubmittedField(path, data);
        }

        if (successed) {
          setIsErrored(false);
          setValidated(true);
        } else if (warning) {
          setIsErrored(false);
          setValidated(false);
        } else {
          setValidated(false);
          setIsErrored(true);
        }
      },
      [
        convertValue,
        field,
        name,
        type,
        isRequiredInternal,
        countryCode,
        setFieldValue,
        onAsyncData,
        setErrors,
        onSubmittedField,
        path,
      ]
    );

    const eventHandler = useMemo(() => throttle(handleChange, throttleTime), [handleChange, throttleTime]);
    // const eventHandler = useMemo(() => debounce(handleChange, debounceTime), [handleChange, debounceTime]);

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
            // console.log("Init", initRef.current);
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
            } else if (field?.triggerValidation && triggerRef.current === 0) {
              triggerRef.current = 1;
              let nextVal = values[name];

              if (!field?.doAsyncActions) {
                if (onSubmittedField) {
                  await onSubmittedField(path, nextVal, true);
                }
              } else {
                setIsLoading(true);
                const { successed, data, message } = await field?.doAsyncActions(nextVal, onAsyncData);
                setIsLoading(false);

                setErrors({ [name]: message });
                if (data) {
                  await onSubmittedField(path, data, true);
                }

                if (fieldValue !== "") {
                  if (successed) {
                    setIsErrored(false);
                    setValidated(true);
                  } else {
                    setValidated(false);
                    setIsErrored(true);
                  }
                }
              }
            } else if (!field?.triggerValidation && triggerRef.current === 1) {
              triggerRef.current = 0;
            }
          }
        }
        //
      })();
      return () => {
        eventHandler.cancel();
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
      eventHandler,
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
          type === "date" ||
          type === "select") && (
          <FormLabel color={shouldBeDisabled ? "disablegrey" : "labelgrey"}>{label || field?.label}</FormLabel>
        )}
        <HStack>
          <InputGroup id={`${name}_group_input`}>
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
            {type === "date" && <DateInput {...commonProps} type={type} onChange={handleChange} {...styleProps} />}
            {(type === "text" || type === "email") && (
              <Input {...commonProps} type={type} onChange={eventHandler} {...styleProps} {...maskedProps} />
            )}
            {type === "number" && !numberStepper && (
              <Input
                {...commonProps}
                type={type}
                onChange={eventHandler}
                {...styleProps}
                {...maskedProps}
                min={min}
                precision={precision}
              />
            )}
            {type === "number" && numberStepper && (
              <NumberInput
                {...commonProps}
                value={format ? format(values[name]) : values[name]}
                onChange={(val) => handleChange({ persist: () => {}, target: { value: val } })}
                precision={precision}
                min={min}
                {...styleProps}
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
            {type === "radio" && (
              <HStack>
                {label ||
                  (field?.label && (
                    <FormLabel color={shouldBeDisabled ? "disablegrey" : "labelgrey"}>
                      {label || field?.label}
                    </FormLabel>
                  ))}
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
                          isDisabled={option.locked || shouldBeDisabled}
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
                label={field?.label}
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
        {errors[name] && !success[name] && !warning[name] && <FormErrorMessage>{errors[name]}</FormErrorMessage>}
        {success[name] && <FormErrorMessage color="green.500">{success[name]}</FormErrorMessage>}
        {warning[name] && <FormErrorMessage color="flatwarm">{warning[name]}</FormErrorMessage>}
      </FormControl>
    );
  }
);
