import React from "react";
import { Box, FormControl, FormLabel, Input, FormErrorMessage, Flex } from "@chakra-ui/react";

import InputCerfa from "./Input";

const FormFormation = () => {
  return (
    <Box>
      <InputCerfa path="organismeFormation.siret" mb="10" hasComments />
      {/* <FormControl>
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
      </FormControl> */}
      <Flex>
        <Box w="55%" flex="1">
          <InputCerfa path="organismeFormation.denomination" mt="2" isDisabled />
          <InputCerfa path="organismeFormation.uaiCfa" mt="2" isDisabled />
          <InputCerfa path="organismeFormation.siret" mt="2" isDisabled noHistory />
          <FormLabel fontWeight={700} my={3}>
            Adresse du CFA responsable :{" "}
          </FormLabel>
          <InputCerfa path="organismeFormation.adresse.numero" mt="2" isDisabled />
          <InputCerfa path="organismeFormation.adresse.voie" mt="2" isDisabled />
          <InputCerfa path="organismeFormation.adresse.complement" mt="2" isDisabled />
          <InputCerfa path="organismeFormation.adresse.codePostal" mt="2" isDisabled />
          <InputCerfa path="organismeFormation.adresse.commune" mt="2" isDisabled />
        </Box>
        <Box w="45%" flex="1" ml="5w">
          {/* <FormControl isRequired mt={2} isInvalid={errors.titleTargeted}>
            <FormLabel>Diplôme ou titre visé par l’apprenti :</FormLabel>
            <Input type="text" name="titleTargeted" onChange={handleChange} value={values.titleTargeted} required />
            {errors.titleTargeted && touched.titleTargeted && (
              <FormErrorMessage>{errors.titleTargeted}</FormErrorMessage>
            )}
          </FormControl> */}
          {/* <FormControl isRequired mt={2} isInvalid={errors.preciseTitle}>
            <FormLabel>Intitulé précis :</FormLabel>
            <Input type="text" name="preciseTitle" onChange={handleChange} value={values.preciseTitle} required />
            {errors.preciseTitle && touched.preciseTitle && <FormErrorMessage>{errors.preciseTitle}</FormErrorMessage>}
          </FormControl> */}
          <InputCerfa path="formation.codeDiplome" mt="2" />
          {/* <FormControl isRequired mt={2} isInvalid={errors.diplomaCode}>
            <FormLabel>Code du diplôme :</FormLabel>
            <Input type="text" name="diplomaCode" onChange={handleChange} value={values.diplomaCode} required />
            {errors.diplomaCode && touched.diplomaCode && <FormErrorMessage>{errors.diplomaCode}</FormErrorMessage>}
          </FormControl> */}
          <InputCerfa path="formation.rncp" mt="2" />
          {/* <FormControl isRequired mt={2} isInvalid={errors.codeRNCP}>
            <FormLabel>Code RNCP :</FormLabel>
            <Input type="text" name="codeRNCP" onChange={handleChange} value={values.codeRNCP} required />
            {errors.codeRNCP && touched.codeRNCP && <FormErrorMessage>{errors.codeRNCP}</FormErrorMessage>}
          </FormControl> */}
          <FormLabel fontWeight={700} my={3}>
            Organisation de la formation en CFA :
          </FormLabel>
          {/* <FormControl isRequired mt={2} isInvalid={errors.startDateTrainingCycle}>
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
          </Flex> */}
        </Box>
      </Flex>
      {/* <Box>
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
      </Box> */}
    </Box>
  );
};

export default FormFormation;
