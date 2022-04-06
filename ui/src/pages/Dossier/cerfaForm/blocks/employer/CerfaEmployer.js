import { InputController } from "../../common/Input/InputController";
import { Box, Flex, FormLabel } from "@chakra-ui/react";
import React, { memo } from "react";
import { employerSchema } from "./employerSchema";
import CheckEmptyFields from "../../common/CheckEmptyFields";

export const CerfaEmployer = memo(() => {
  return (
    <Box>
      <InputController name="employeur.siret" fieldType="text" ismb="10" />
      <Flex>
        <Box w="55%" flex="1">
          <InputController name="employeur.denomination" />
          <FormLabel fontWeight={700} my={3}>
            Adresse de l'établissement d'exécution du contrat :
          </FormLabel>
          <InputController name="employeur.adresse.numero" fieldType="number" />
          <InputController name="employeur.adresse.voie" fieldType="text" />
          <InputController name="employeur.adresse.complement" />
          <InputController name="employeur.adresse.codePostal" />
          <InputController name="employeur.adresse.commune" />
          <InputController name="employeur.adresse.departement" />
          <InputController name="employeur.adresse.region" />
          <InputController name="employeur.telephone" />
          <InputController name="employeur.courriel" />
        </Box>
        <Box w="45%" ml="5w">
          <InputController name="employeur.typeEmployeur" fieldType="select" />
          <InputController name="employeur.employeurSpecifique" fieldType="select" />
          <InputController name="employeur.naf" fieldType="text" />
          <InputController name="employeur.nombreDeSalaries" fieldType="number" />
          <InputController name="employeur.codeIdcc" fieldType="text" />
          <InputController name="employeur.codeIdcc_special" fieldType="radio" />
          <InputController name="employeur.libelleIdcc" fieldType="text" />
          <InputController name="employeur.regimeSpecifique" fieldType="radio" />
        </Box>
      </Flex>
      <CheckEmptyFields fieldNames={Object.keys(employerSchema)} />
    </Box>
  );
});
