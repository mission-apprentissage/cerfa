import React from "react";
import { Box, Button, FormControl, FormLabel, Input, FormErrorMessage, Flex } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";

// import { _post, _get, _put } from "../../common/httpClient";

const FormSubmittingContract = () => {
  const { values, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      organizationName: "",
      dateReceipt: "",
      number: "",
      siret: "",
      decisionDate: "",
      riderNumber: "",
    },
    validationSchema: Yup.object().shape({
      organizationName: Yup.string().required("Requis"),
      dateReceipt: Yup.string().required("Requis"),
      number: Yup.string().required("Requis"),
      siret: Yup.string().required("Requis"),
      decisionDate: Yup.string().required("Requis"),
      riderNumber: Yup.string().required("Requis"),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <Box>
      <Flex>
        <Box w="55%" flex="1">
          <FormControl mt={2} isRequired isInvalid={errors.organizationName}>
            <FormLabel fontWeight={700}>Nom de l’organisme :</FormLabel>
            <Input
              type="text"
              name="organizationName"
              onChange={handleChange}
              value={values.organizationName}
              required
            />
            {errors.organizationName && touched.organizationName && (
              <FormErrorMessage>{errors.organizationName}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mt={2} isRequired isInvalid={errors.dateReceipt}>
            <FormLabel>Date de réception du dossier complet :</FormLabel>
            <Input type="date" name="dateReceipt" onChange={handleChange} value={values.dateReceipt} required />
            {errors.dateReceipt && touched.dateReceipt && <FormErrorMessage>{errors.dateReceipt}</FormErrorMessage>}
          </FormControl>
          <FormControl mt={2} isRequired isInvalid={errors.number}>
            <FormLabel>N° de dépôt :</FormLabel>
            <Input type="text" name="number" onChange={handleChange} value={values.number} required />
            {errors.number && touched.number && <FormErrorMessage>{errors.number}</FormErrorMessage>}
          </FormControl>
        </Box>
        <Box w="55%" ml="5w">
          <FormControl mt={2} isRequired isInvalid={errors.siret}>
            <FormLabel fontWeight={700}>N° SIRET de l’organisme :</FormLabel>
            <Input type="text" name="siret" onChange={handleChange} value={values.siret} required />
            {errors.siret && touched.siret && <FormErrorMessage>{errors.siret}</FormErrorMessage>}
          </FormControl>
          <FormControl mt={2} isRequired isInvalid={errors.decisionDate}>
            <FormLabel>Date de la décision : </FormLabel>
            <Input type="date" name="decisionDate" onChange={handleChange} value={values.decisionDate} required />
            {errors.decisionDate && touched.decisionDate && <FormErrorMessage>{errors.decisionDate}</FormErrorMessage>}
          </FormControl>
          <FormControl mt={2} isRequired isInvalid={errors.riderNumber}>
            <FormLabel>Numéro d’avenant :</FormLabel>

            <Input type="text" name="riderNumber" onChange={handleChange} value={values.riderNumber} required />
            {errors.riderNumber && touched.riderNumber && <FormErrorMessage>{errors.riderNumber}</FormErrorMessage>}
          </FormControl>
        </Box>
      </Flex>
      <Box mt="2rem">
        <Button variant="primary" ml={3} onClick={handleSubmit} type="submit">
          Enregistrer
        </Button>
      </Box>
    </Box>
  );
};

export default FormSubmittingContract;
