import React from "react";
import { Box, FormLabel, Flex } from "@chakra-ui/react";

import { useCerfa } from "../../../../common/hooks/useCerfa";
import InputCerfa from "./Input";

const FormFormation = React.memo((props) => {
  const {
    isloaded,
    organismeFormation: {
      siret,
      denomination,
      uaiCfa,
      adresse: { numero, voie, complement, codePostal, commune },
    },
    formation: { rncp, codeDiplome, dateDebutFormation, dateFinFormation },
    onSubmittedOrganismeFormationSiret,
    onSubmittedFormationCodeDiplome,
    onSubmittedRncp,
    onSubmittedFormationDateDebutFormation,
    onSubmittedFormationDateFinFormation,
    onSubmittedOrganismeFormationUaiCfa,
  } = useCerfa();

  if (!isloaded) return null;

  return (
    <Box>
      <InputCerfa
        path="organismeFormation.siret"
        field={siret}
        type="text"
        mb="10"
        hasComments
        onSubmittedField={onSubmittedOrganismeFormationSiret}
      />
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
          <InputCerfa path="organismeFormation.denomination" field={denomination} type="text" mt="2" isDisabled />
          <InputCerfa
            path="organismeFormation.uaiCfa"
            field={uaiCfa}
            type="text"
            mt="2"
            isDisabled={!(uaiCfa.value === "" && siret.value !== "")}
            onSubmittedField={onSubmittedOrganismeFormationUaiCfa}
          />
          {/* <InputCerfa path="organismeFormation.siret" type="text" mt="2" isDisabled noHistory /> */}
          <FormLabel fontWeight={700} my={3}>
            Adresse du CFA responsable :{" "}
          </FormLabel>
          <InputCerfa path="organismeFormation.adresse.numero" field={numero} type="text" mt="2" isDisabled />
          <InputCerfa path="organismeFormation.adresse.voie" field={voie} type="text" mt="2" isDisabled />
          <InputCerfa path="organismeFormation.adresse.complement" field={complement} type="text" mt="2" isDisabled />
          <InputCerfa path="organismeFormation.adresse.codePostal" field={codePostal} type="text" mt="2" isDisabled />
          <InputCerfa path="organismeFormation.adresse.commune" field={commune} type="text" mt="2" isDisabled />
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
          <InputCerfa
            path="formation.codeDiplome"
            field={codeDiplome}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedFormationCodeDiplome}
          />
          <InputCerfa path="formation.rncp" field={rncp} type="text" mt="2" onSubmittedField={onSubmittedRncp} />
          <FormLabel fontWeight={700} my={3}>
            Organisation de la formation en CFA :
          </FormLabel>
          <InputCerfa
            path="formation.dateDebutFormation"
            field={dateDebutFormation}
            type="date"
            mt="2"
            onSubmittedField={onSubmittedFormationDateDebutFormation}
            onAsyncData={{ value: dateFinFormation.value }}
          />
          <InputCerfa
            path="formation.dateFinFormation"
            field={dateFinFormation}
            type="date"
            mt="2"
            onSubmittedField={onSubmittedFormationDateFinFormation}
            onAsyncData={{ value: dateDebutFormation.value }}
          />
          {/* <Flex mt={4}>
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
});

export default FormFormation;
