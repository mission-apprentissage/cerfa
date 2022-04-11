import React, { memo } from "react";
import { Box, Flex, FormLabel, Text } from "@chakra-ui/react";
import { InputController } from "../../../formEngine/components/Input/InputController";
import { CollapseController } from "../../../formEngine/components/CollapseController";
import CheckEmptyFields from "../../../formEngine/components/CheckEmptyFields";
import { formationSchema } from "./formationSchema";
import { shouldAskEtablissementFormation } from "./domain/shouldAskEtablissementFormation";

export const CerfaFormation = memo(() => {
  return (
    <>
      <Box>
        <InputController name="organismeFormation.formationInterne" type="radio" mt="2" mb={6} />
        <InputController name="organismeFormation.siret" type="text" mb="10" />

        <Flex>
          <Box w="55%" flex="1">
            <InputController name="organismeFormation.denomination" type="text" mt="2" hasInfo={false} />
            <InputController name="organismeFormation.uaiCfa" type="text" mt="2" />
            <FormLabel fontWeight={700} my={3}>
              Adresse du CFA responsable :{" "}
            </FormLabel>
            <InputController
              name="organismeFormation.adresse.numero"
              type="number"
              precision={0}
              mt="2"
              hasInfo={false}
            />
            <InputController name="organismeFormation.adresse.voie" type="text" mt="2" hasInfo={false} />
            <InputController name="organismeFormation.adresse.complement" type="text" mt="2" hasInfo={false} />
            <InputController name="organismeFormation.adresse.codePostal" type="text" mt="2" hasInfo={false} />
            <InputController name="organismeFormation.adresse.commune" type="text" mt="2" hasInfo={false} />
          </Box>
          <Box w="45%" flex="1" ml="5w">
            <InputController name="formation.rncp" type="text" mt="2" />
            <InputController name="formation.codeDiplome" type="text" mt="2" />
            <InputController name="formation.typeDiplome" type="select" mt="2" />
            <InputController name="formation.intituleQualification" type="text" mt="2" />
            <FormLabel fontWeight={700} my={3}>
              Organisation de la formation en CFA :
            </FormLabel>
            <InputController name="formation.dateDebutFormation" type="date" mt="2" />
            <InputController name="formation.dateFinFormation" type="date" mt="2" />
            <Flex mt={4}>
              <InputController name="formation.dureeFormation" type="number" mt="2" precision={0} min={1} />
            </Flex>
          </Box>
        </Flex>
      </Box>
      <Box>
        <Text fontWeight="bold" my={3}>
          Le lieu de formation :
        </Text>
        <InputController name="etablissementFormation.memeResponsable" type="radio" mt="2" />
        <CollapseController show={shouldAskEtablissementFormation}>
          <InputController name="etablissementFormation.siret" type="text" mb="2" />
          <Flex>
            <Box w="55%" flex="1">
              <InputController name="etablissementFormation.denomination" type="text" mt="2" hasInfo={false} />
              <InputController name="etablissementFormation.uaiCfa" type="text" mt="2" />
              <FormLabel fontWeight={700} my={3}>
                Adresse du lieu de formation :{" "}
              </FormLabel>
              <InputController
                name="etablissementFormation.adresse.numero"
                type="number"
                precision={0}
                mt="2"
                hasInfo={false}
              />
              <InputController name="etablissementFormation.adresse.voie" type="text" mt="2" hasInfo={false} />
              <InputController name="etablissementFormation.adresse.complement" type="text" mt="2" hasInfo={false} />
              <InputController name="etablissementFormation.adresse.codePostal" type="text" mt="2" hasInfo={false} />
              <InputController name="etablissementFormation.adresse.commune" type="text" mt="2" hasInfo={false} />
            </Box>
          </Flex>
        </CollapseController>
      </Box>
      <CheckEmptyFields schema={formationSchema} blocName="formation" />
    </>
  );
});
