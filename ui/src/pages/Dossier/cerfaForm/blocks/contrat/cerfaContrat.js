import React, { memo } from "react";
import { Box, Flex, FormLabel, Link, Text } from "@chakra-ui/react";
import Ribbons from "../../../../../common/components/Ribbons";
import { ExternalLinkLine } from "../../../../../theme/components/icons";
import { InputController } from "../../common/Input/InputController";
import { NumeroContratPrecedentField } from "./NumeroContratPrecedentField";
import { TypeDerogationField } from "./TypeDerogationField";
import { Remunerations } from "./Remunerations";
import { AvantagesNatures } from "./AvantagesNatures";
import CheckEmptyFields from "../../common/CheckEmptyFields";
import { contratSchema } from "./contratSchema";

export const CerfaContrat = memo(() => {
  return (
    <Box>
      <Flex>
        <Box w="55%" flex="1">
          <InputController name="contrat.typeContratApp" />
          <TypeDerogationField />
          <NumeroContratPrecedentField />
        </Box>
        <Box w="55%" ml="5w">
          <InputController name="contrat.dateDebutContrat" />
          <InputController name="contrat.dateEffetAvenant" />
          <InputController name="contrat.dateFinContrat" />
        </Box>
      </Flex>
      <Box pt={4}>
        <Box mb={8}>
          <FormLabel fontWeight={700}>Durée hebdomadaire du travail :</FormLabel>
          <Flex w="55%">
            <InputController name="contrat.dureeTravailHebdoHeures" type="number" />
            <InputController ml={"5"} name="contrat.dureeTravailHebdoMinutes" type="number" />
          </Flex>
        </Box>
        <InputController name="contrat.travailRisque" />

        <FormLabel fontWeight={700} fontSize="1.3rem">
          Rémunération
        </FormLabel>
        <Ribbons variant="info_clear" marginTop="1rem">
          <Text color="grey.800">
            Le calcul de la rémunération est généré automatiquement à partir des informations <br />
            que vous avez remplies. <br />
            <strong>
              Le calcul indique la rémunération minimale légale, l'employeur pouvant décider d'attribuer
              <br /> une rémunération plus avantageuse.
            </strong>
          </Text>
        </Ribbons>
        <Ribbons variant="alert_clear" marginTop="0.5rem">
          <Text color="grey.800">
            <strong>Attention : Ne tient pas encore compte de situations spécifiques</strong>
            <br />
            <Text as="span" textStyle="xs" fontStyle="italic">
              Exemples : rémunération du contrat d'apprentissage préparant à une licence professionnelle, majorations{" "}
              <br />
            </Text>
            <Text as="span" textStyle="xs">
              En savoir plus sur les situations spécifiques sur le
              <Link
                color="bluefrance"
                textDecoration="underline"
                isExternal
                href="https://travail-emploi.gouv.fr/formation-professionnelle/formation-en-alternance-10751/apprentissage/contrat-apprentissage#salaire"
              >
                site du Ministère du Travail, de l'Emploi et de l'Insertion
                <ExternalLinkLine w={"0.55rem"} h={"0.55rem"} mb={"0.125rem"} ml={1} />
              </Link>
            </Text>
          </Text>
        </Ribbons>
        <Remunerations />
        <AvantagesNatures />
      </Box>
      <CheckEmptyFields fieldNames={Object.keys(contratSchema)} />
    </Box>
  );
});
