import { InputController } from "../common/Input/InputController";
import { Box, Flex, FormLabel } from "@chakra-ui/react";
import React from "react";

export const CerfaEmployer = ({ controller }) => {
  return (
    <Box>
      <InputController
        label={"N° SIRET de l'employeur :"}
        name="employeur.siret"
        type="text"
        mb="10"
        controller={controller}
      />
      <Flex>
        <Box w="55%" flex="1">
          <InputController label={"Dénomination :"} name="employeur.denomination" controller={controller} />
          <FormLabel fontWeight={700} my={3}>
            Adresse de l'établissement d'exécution du contrat :
          </FormLabel>
          <InputController label={"N° :"} name="employeur.adresse.numero" type="number" controller={controller} />
          <InputController label={"Voie :"} name="employeur.adresse.voie" type="text" controller={controller} />
        </Box>
        <Box w="55%" flex="1"></Box>
      </Flex>
    </Box>
  );
};
