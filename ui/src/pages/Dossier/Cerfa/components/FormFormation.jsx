import React from "react";
import { Box, Button, FormControl, FormLabel, Input, FormErrorMessage, Flex, HStack, Checkbox } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";

// import { _post, _get, _put } from "../../common/httpClient";

const FormFormation = () => {
  const { values, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      companyCfa: "",
      nameResponsibleCFA: "",
      uaiCFA: "",
      siretCFA: "",
      number: "",
      way: "",
      complement: "",
      zipCode: "",
      townShip: "",
      titleTargeted: "",
      preciseTitle: "",
      diplomaCode: "",
      codeRNCP: "",
      startDateTrainingCycle: "",
      endDateExams: "",
      trainingDuration: "",
      checkEmployer: "",
      madeIn: "",
    },
    validationSchema: Yup.object().shape({
      companyCfa: Yup.string().required("Requis"),
      nameResponsibleCFA: Yup.string().required("Requis"),
      uaiCFA: Yup.string().required("Requis"),
      siretCFA: Yup.string().required("Requis"),
      number: Yup.string().required("Requis"),
      way: Yup.string().required("Requis"),
      complement: Yup.string().required("Requis"),
      zipCode: Yup.string().required("Requis"),
      townShip: Yup.string().required("Requis"),
      titleTargeted: Yup.string().required("Requis"),
      preciseTitle: Yup.string().required("Requis"),
      diplomaCode: Yup.string().required("Requis"),
      codeRNCP: Yup.string().required("Requis"),
      startDateTrainingCycle: Yup.string().required("Requis"),
      endDateExams: Yup.string().required("Requis"),
      trainingDuration: Yup.string().required("Requis"),
      checkEmployer: Yup.string().required("Requis"),
      madeIn: Yup.string().required("Requis"),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <Box>
      <FormControl>
        <FormLabel>CFA d’entreprise :</FormLabel>
        <HStack w="40%">
          <Flex alignItems="center">
            <input
              type="radio"
              name="companyCfa"
              value="oui"
              checked={values.companyCfa === "oui"}
              onChange={handleChange}
            />
            <FormLabel ml="1w">oui</FormLabel>
          </Flex>
          <Flex alignItems="center">
            <input
              type="radio"
              name="companyCfa"
              value="non"
              checked={values.companyCfa === "non"}
              onChange={handleChange}
            />
            <FormLabel ml="1w">non</FormLabel>
          </Flex>
        </HStack>
        {errors.gender && touched.gender && <FormErrorMessage>{errors.gender}</FormErrorMessage>}
      </FormControl>
      <Flex>
        <Box w="55%" flex="1">
          <FormControl isRequired mt={2} isInvalid={errors.nameResponsibleCFA}>
            <FormLabel>Dénomination du CFA responsable :</FormLabel>
            <Input
              type="text"
              name="nameResponsibleCFA"
              onChange={handleChange}
              value={values.nameResponsibleCFA}
              required
            />
            {errors.nameResponsibleCFA && touched.nameResponsibleCFA && (
              <FormErrorMessage>{errors.nameResponsibleCFA}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.uaiCFA}>
            <FormLabel>N° UAI du CFA :</FormLabel>
            <Input type="text" name="uaiCFA" onChange={handleChange} value={values.uaiCFA} required />
            {errors.uaiCFA && touched.uaiCFA && <FormErrorMessage>{errors.uaiCFA}</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.siretCFA}>
            <FormLabel>N° SIRET CFA :</FormLabel>
            <Input type="text" name="siretCFA" onChange={handleChange} value={values.siretCFA} required />
            {errors.siretCFA && touched.siretCFA && <FormErrorMessage>{errors.siretCFA}</FormErrorMessage>}
          </FormControl>
          <FormLabel fontWeight={700} my={3}>
            Adresse du CFA responsable :{" "}
          </FormLabel>
          <FormControl isRequired mt={2} isInvalid={errors.number}>
            <FormLabel>N° :</FormLabel>
            <Input type="text" name="number" onChange={handleChange} value={values.number} required />
            {errors.number && touched.number && <FormErrorMessage>{errors.number}</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.way}>
            <FormLabel>Voie :</FormLabel>
            <Input type="text" name="way" onChange={handleChange} value={values.way} required />
            {errors.way && touched.way && <FormErrorMessage>{errors.way}</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.complement}>
            <FormLabel>Complément :</FormLabel>
            <Input type="text" name="complement" onChange={handleChange} value={values.complement} required />
            {errors.complement && touched.complement && <FormErrorMessage>{errors.complement}</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.zipCode}>
            <FormLabel>Code postal :</FormLabel>
            <Input type="text" name="zipCode" onChange={handleChange} value={values.zipCode} required />
            {errors.zipCode && touched.zipCode && <FormErrorMessage>{errors.zipCode}</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.townShip}>
            <FormLabel>Commune :</FormLabel>
            <Input type="text" name="townShip" onChange={handleChange} value={values.townShip} required />
            {errors.townShip && touched.townShip && <FormErrorMessage>{errors.townShip}</FormErrorMessage>}
          </FormControl>
        </Box>
        <Box w="45%" flex="1" ml="5w">
          <FormControl isRequired mt={2} isInvalid={errors.titleTargeted}>
            <FormLabel>Diplôme ou titre visé par l’apprenti :</FormLabel>
            <Input type="text" name="titleTargeted" onChange={handleChange} value={values.titleTargeted} required />
            {errors.titleTargeted && touched.titleTargeted && (
              <FormErrorMessage>{errors.titleTargeted}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.preciseTitle}>
            <FormLabel>Intitulé précis :</FormLabel>
            <Input type="text" name="preciseTitle" onChange={handleChange} value={values.preciseTitle} required />
            {errors.preciseTitle && touched.preciseTitle && <FormErrorMessage>{errors.preciseTitle}</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.diplomaCode}>
            <FormLabel>Code du diplôme :</FormLabel>
            <Input type="text" name="diplomaCode" onChange={handleChange} value={values.diplomaCode} required />
            {errors.diplomaCode && touched.diplomaCode && <FormErrorMessage>{errors.diplomaCode}</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.codeRNCP}>
            <FormLabel>Code RNCP :</FormLabel>
            <Input type="text" name="codeRNCP" onChange={handleChange} value={values.codeRNCP} required />
            {errors.codeRNCP && touched.codeRNCP && <FormErrorMessage>{errors.codeRNCP}</FormErrorMessage>}
          </FormControl>
          <FormLabel fontWeight={700} my={3}>
            Organisation de la formation en CFA :
          </FormLabel>
          <FormControl isRequired mt={2} isInvalid={errors.startDateTrainingCycle}>
            <FormLabel>Date de début du cycle de formation : </FormLabel>
            <Input
              type="date"
              name="startDateTrainingCycle"
              onChange={handleChange}
              value={values.startDateTrainingCycle}
              required
            />
            {errors.startDateTrainingCycle && touched.startDateTrainingCycle && (
              <FormErrorMessage>{errors.startDateTrainingCycle}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.endDateExams}>
            <FormLabel>Date prévue de fin des épreuves ou examens :</FormLabel>
            <Input type="date" name="endDateExams" onChange={handleChange} value={values.endDateExams} required />
            {errors.endDateExams && touched.endDateExams && <FormErrorMessage>{errors.endDateExams}</FormErrorMessage>}
          </FormControl>
          <Flex mt={4}>
            <FormControl isRequired mt={4} isInvalid={errors.trainingDuration}>
              <Flex>
                <FormLabel>Durée de la formation :</FormLabel>
                <Input
                  type="text"
                  name="trainingDuration"
                  onChange={handleChange}
                  value={values.trainingDuration}
                  required
                />
                <FormLabel>heures</FormLabel>
              </Flex>
              {errors.trainingDuration && touched.trainingDuration && (
                <FormErrorMessage>{errors.trainingDuration}</FormErrorMessage>
              )}
            </FormControl>
          </Flex>
        </Box>
      </Flex>
      <Box>
        <FormControl isRequired mt={2} isInvalid={errors.checkEmployer}>
          <Flex>
            <Checkbox type="checkbox" value="oui" name="checkEmployer" onChange={handleChange} required />
            <FormLabel ml={3} mt={2} fontWeight={700} textStyle="sm" fontStyle="italic">
              L’employeur atteste disposer de l’ensemble des pièces justificatives nécessaires au dépôt du contrat
            </FormLabel>
          </Flex>
          {errors.checkEmployer && touched.checkEmployer && <FormErrorMessage>{errors.checkEmployer}</FormErrorMessage>}
        </FormControl>
        <FormControl isRequired mt={2} isInvalid={errors.madeIn}>
          <FormLabel>Fait à :</FormLabel>
          <Input type="text" name="madeIn" onChange={handleChange} value={values.madeIn} required />
          {errors.madeIn && touched.madeIn && <FormErrorMessage>{errors.madeIn}</FormErrorMessage>}
        </FormControl>
      </Box>
      <Box mt="2rem">
        <Button variant="primary" ml={3} onClick={handleSubmit} type="submit">
          Enregistrer
        </Button>
      </Box>
    </Box>
  );
};

export default FormFormation;
