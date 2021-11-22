import React, { useCallback, useState } from "react";
import { FormControl, FormLabel, Input, FormErrorMessage, InputRightElement, InputGroup } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";

export default ({ name, label, schema, onSubmitted }) => {
  // const [isLoading, setIsLoading] = useState(false); // TODO
  const [validated, setValidated] = useState(false); // TODO

  const { values, handleChange: handleChangeFormik, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      [name]: "",
    },
    validationSchema: Yup.object().shape({
      [name]: Yup.string().required("Requis"), // TODO
    }),
    onSubmit: (values) => {
      // setIsLoading(false);
      onSubmitted(values);
    },
  });

  let handleChange = useCallback(
    (e) => {
      console.log(e.target.value);
      const regex = new RegExp(schema.pattern);
      const valid = regex.test(e.target.value);
      if (!valid) {
        return handleChangeFormik(e);
      }
      // setIsLoading(true);
      setValidated(true);
      handleChangeFormik(e);

      // TODO If copy / paste need to wait a bit
      handleSubmit();
    },
    [handleChangeFormik, handleSubmit, schema.pattern]
  );

  return (
    <FormControl isRequired mt={2} isInvalid={errors[name]}>
      <FormLabel>{label}</FormLabel>
      <InputGroup>
        <Input type="text" name={name} onChange={handleChange} value={values[name]} required pattern={schema.pattern} />
        {validated && <InputRightElement children={<CheckIcon color="green.500" />} />}
      </InputGroup>
      {errors[name] && touched[name] && <FormErrorMessage>{errors[name]}</FormErrorMessage>}
    </FormControl>
  );
};
