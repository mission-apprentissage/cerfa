import { Box, Flex, FormLabel, Text } from "@chakra-ui/react";
import React from "react";
import { InputController } from "../../common/Input/InputController";
import { CollapseController } from "../../common/CollapseController";
import { shouldHideAvantageNature } from "./shouldHideAvantageNature";

export const AvantagesNatures = () => {
  const missingFieldAvantages = false;
  return (
    <Box mt={6}>
      <InputController name="contrat.avantageNature" type="radio" />

      <CollapseController hide={shouldHideAvantageNature}>
        <FormLabel my={4} fontWeight={700} id={`avantageNature_bloc_section-label`}>
          Avantages en nature, le cas échéant :
        </FormLabel>
        {missingFieldAvantages && (
          <Text color="flaterror">
            Si l'apprenti(e) bénéficie d'avantages en nature, veuillez saisir au moins un des champs ci-dessous.
          </Text>
        )}
        <Box
          borderWidth={missingFieldAvantages ? "1px" : "none"}
          borderColor="flaterror"
          padding={missingFieldAvantages ? "2" : "0"}
        >
          <Flex>
            <Box flex="1">
              <InputController name="contrat.avantageNourriture" type="number" />
            </Box>
            <Box ml={5}>
              <InputController name="contrat.avantageLogement" type="number" />
            </Box>
          </Flex>
          <Box>
            <InputController name="contrat.autreAvantageEnNature" type="consent" />
          </Box>
        </Box>
      </CollapseController>
    </Box>
  );
};
