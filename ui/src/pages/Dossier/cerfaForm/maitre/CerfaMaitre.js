import { Box, Flex, FormLabel } from "@chakra-ui/react";
import InputCerfa from "../../Cerfa/components/Input";
import React from "react";
import { InputController } from "../common/Input/InputController";

export const CerfaMaitre = ({ controller }) => {
  return (
    <Box>
      <Flex>
        <Box w="55%" flex="1">
          <FormLabel fontWeight={700}>Maître d'apprentissage n°1 </FormLabel>
          <InputController isRequired={true} label="Nom de naissance" name={"maitre1.nom"} controller={controller} />
          <InputController isRequired={true} label="Prénom" name={"maitre1.prenom"} controller={controller} />
          <InputController
            isRequired={true}
            label="Date de naissance"
            name={"maitre1.dateNaissance"}
            controller={controller}
          />
        </Box>
        <Box w="55%" flex="1" ml={5}>
          <FormLabel fontWeight={700}>Maître d'apprentissage n°2 (Optionnel)</FormLabel>
          <InputController label="Nom de naissance" name={"maitre2.nom"} controller={controller} />
          <InputController label="Prénom" name={"maitre2.prenom"} controller={controller} />
          <InputController label="Date de naissance" name={"maitre2.dateNaissance"} controller={controller} />
        </Box>
      </Flex>
    </Box>
  );
};
