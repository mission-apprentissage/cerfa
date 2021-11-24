import React from "react";
import { Box, Button, FormControl, FormLabel, Input, FormErrorMessage, Text, Flex } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";

// import { _post, _get, _put } from "../../common/httpClient";

const FormLearningMaster = () => {
  const { values, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      nameMaster1: "",
      firstnameMaster1: "",
      birthMaster1: "",
      nameMaster2: "",
      firstnameMaster2: "",
      birthMaster2: "",
    },
    validationSchema: Yup.object().shape({
      nameMaster1: Yup.string().required("Requis"),
      firstnameMaster1: Yup.string().required("Requis"),
      birthMaster1: Yup.string().required("Requis"),
      nameMaster2: Yup.string(),
      firstnameMaster2: Yup.string(),
      birthMaster2: Yup.string(),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <Box>
      <Flex>
        <Box w="55%" flex="1">
          <FormLabel fontWeight={700}>Maître d’apprentissage n°1 </FormLabel>
          <FormControl isRequired isInvalid={errors.nameMaster1}>
            <FormLabel>Nom :</FormLabel>
            <Input type="text" name="nameMaster1" onChange={handleChange} value={values.nameMaster1} required />
            {errors.nameMaster1 && touched.nameMaster1 && <FormErrorMessage>{errors.nameMaster1}</FormErrorMessage>}
          </FormControl>
          <FormControl mt={2} isRequired isInvalid={errors.firstnameMaster1}>
            <FormLabel>Prénom :</FormLabel>
            <Input
              type="text"
              name="firstnameMaster1"
              onChange={handleChange}
              value={values.firstnameMaster1}
              required
            />
            {errors.firstnameMaster1 && touched.firstnameMaster1 && (
              <FormErrorMessage>{errors.firstnameMaster1}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mt={2} isRequired isInvalid={errors.birthMaster1}>
            <FormLabel>Date de naissance :</FormLabel>
            <Input type="date" name="birthMaster1" onChange={handleChange} value={values.birthMaster1} required />
            {errors.birthMaster1 && touched.birthMaster1 && <FormErrorMessage>{errors.birthMaster1}</FormErrorMessage>}
          </FormControl>
        </Box>
        <Box w="55%" flex="1" ml={5}>
          <FormLabel fontWeight={700}>Maître d’apprentissage n°2 </FormLabel>
          <FormControl mt={2} isInvalid={errors.nameMaster2}>
            <FormLabel>Nom :</FormLabel>
            <Input type="text" name="nameMaster2" onChange={handleChange} value={values.nameMaster2} required />
            {errors.nameMaster2 && touched.nameMaster2 && <FormErrorMessage>{errors.nameMaster2}</FormErrorMessage>}
          </FormControl>
          <FormControl mt={2} isInvalid={errors.firstnameMaster2}>
            <FormLabel>Prénom :</FormLabel>
            <Input
              type="text"
              name="firstfirstnameMaster2"
              onChange={handleChange}
              value={values.firstfirstnameMaster2}
            />
            {errors.firstnameMaster2 && touched.firstnameMaster2 && (
              <FormErrorMessage>{errors.firstnameMaster2}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mt={2} isInvalid={errors.birthMaster2}>
            <FormLabel>Date de naissance :</FormLabel>
            <Input type="date" name="birthMaster2" onChange={handleChange} value={values.birthMaster2} />
            {errors.birthMaster2 && touched.birthMaster2 && <FormErrorMessage>{errors.birthMaster2}</FormErrorMessage>}
          </FormControl>
        </Box>
      </Flex>
      <Text fontStyle="italic" fontWeight={700} textStyle="sm" mt={4}>
        L’employeur atteste sur l’honneur que le maître d’apprentissage répond à l’ensemble des critères d’éligibilité à
        cette fonction.
      </Text>
      <Box mt="2rem">
        <Button variant="primary" ml={3} onClick={handleSubmit} type="submit">
          Enregistrer
        </Button>
      </Box>
    </Box>
  );
};

export default FormLearningMaster;
