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

export default ({
  name,
  label,
  requiredMessage,
  schema,
  onSubmitted,
  onFetch,
  onAddComment,
  onResolveComments,
  users,
  commentaires,
  history,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isErrored, setIsErrored] = useState(false);

  const { values, handleChange: handleChangeFormik, handleSubmit, errors, setFieldValue, setErrors } = useFormik({
    initialValues: {
      [name]: "",
    },
    validationSchema: Yup.object().shape({
      [name]: Yup.string().required(requiredMessage),
    }),
    onSubmit: (values) => {
      onSubmitted(values);
    },
  });

  let handleChange = useCallback(
    async (e) => {
      e.persist();
      const val = e.target.value;
      setValidated(false);
      setIsErrored(false);

      const regex = new RegExp(schema.pattern);
      const valid = regex.test(val);
      if (!valid) {
        return handleChangeFormik(e);
      }
      setFieldValue(name, val);
      setIsLoading(true);
      const { successed, message } = await onFetch(val);
      setIsLoading(false);
      if (successed) {
        setValidated(true);
        handleSubmit();
      } else {
        setErrors({ [name]: message });
        setIsErrored(true);
      }
    },
    [handleChangeFormik, handleSubmit, name, onFetch, schema.pattern, setErrors, setFieldValue]
  );

  const borderBottomColor = validated ? "green.500" : isErrored ? "error" : "grey.600";

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
            pattern={schema.pattern}
            placeholder={schema.description}
            variant={validated ? "valid" : "outline"}
            isInvalid={isErrored}
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
          />
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
        </InputGroup>

        <Box>
          <InfoTooltip description={schema.description} history={history} />
        </Box>
        <Box>
          <Comment commentaires={commentaires} users={users} onAdd={onAddComment} onResolve={onResolveComments} />
        </Box>
      </HStack>
      {errors[name] && <FormErrorMessage>{errors[name]}</FormErrorMessage>}
    </FormControl>
  );
};
