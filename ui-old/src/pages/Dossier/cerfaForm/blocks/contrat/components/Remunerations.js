import { Box, Flex, HStack, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";
import React from "react";
import { useRecoilValue } from "recoil";
import { valuesSelector } from "../../../../formEngine/atoms";
import { InputController } from "../../../../formEngine/components/Input/InputController";
import { CollapseController } from "../../../../formEngine/components/CollapseController";
import { shouldHideRemunerationsAnnuelles } from "../domain/shouldHideRemunrationsAnnuelles";

const getAnneeLabel = (i) => {
  return {
    0: "1ère Année, du",
    1: "2ère Année, du",
    2: "3ère Année, du",
    3: "4ème année, du",
  }[i];
};

export const Remunerations = () => {
  const values = useRecoilValue(valuesSelector);
  const dateDebutContrat = values.contrat.dateDebutContrat;
  const dateFinContrat = values.contrat.dateFinContrat;
  const apprentiDateNaissance = values.apprenti.dateNaissance;
  const employeurAdresseDepartement = values.employeur.adresse.departement;
  const smic = values.contrat.smic;
  const remunerationsAnnuelles = values.contrat.remunerationsAnnuelles;

  return (
    <Box>
      {(dateDebutContrat === "" ||
        dateFinContrat === "" ||
        apprentiDateNaissance === "" ||
        employeurAdresseDepartement === "") && (
        <VStack alignItems="flex-start" color="mgalt">
          <Text>
            L'outil détermine les périodes de rémunération et s'assure du respect du minimum légale pour chacune des
            périodes, à partir des éléments renseignés.
          </Text>
          <UnorderedList ml="30px !important">
            <ListItem fontWeight="400" fontStyle="italic" color={apprentiDateNaissance === "" ? "error" : "green.500"}>
              La date de naissance de l'apprenti
            </ListItem>
            <ListItem fontWeight="400" fontStyle="italic" color={dateDebutContrat === "" ? "error" : "green.500"}>
              La date de début d'exécution du contrat
            </ListItem>
            <ListItem fontWeight="400" fontStyle="italic" color={dateFinContrat === "" ? "error" : "green.500"}>
              La date de fin du contrat
            </ListItem>
            <ListItem
              fontWeight="400"
              fontStyle="italic"
              color={employeurAdresseDepartement === "" ? "error" : "green.500"}
            >
              Le département de l'employeur
            </ListItem>
          </UnorderedList>
        </VStack>
      )}
      <CollapseController hide={shouldHideRemunerationsAnnuelles}>
        <Box mt="0.75rem" borderColor={"dgalt"} borderWidth={2} px={4} py={3} borderStyle="dashed" rounded="md">
          <Box>
            {remunerationsAnnuelles?.map((annee, i) => (
              <Box key={i}>
                <Box fontSize="1.1rem" fontWeight="bold" mt={i > 0 ? 2 : 0}>
                  {getAnneeLabel(i)}
                </Box>
                <HStack spacing={2} key={i} alignItems="flex-end">
                  <InputController name={`contrat.remunerationsAnnuelles[${i}].dateDebut`} />
                  <Box mt="1.7rem !important">au</Box>
                  <InputController name={`contrat.remunerationsAnnuelles[${i}].dateFin`} />
                  <InputController name={`contrat.remunerationsAnnuelles[${i}].taux`} />
                  <Box w="100%" position="relative" fontStyle="italic" color="disablegrey" pl={2}>
                    soit {annee.salaireBrut} € / mois. <br />
                    Seuil minimal légal {annee.tauxMinimal} %
                  </Box>
                </HStack>
              </Box>
            ))}
          </Box>
          <Flex mt={5}>
            <Box w="55%" flex="1">
              <InputController name="contrat.salaireEmbauche" />
            </Box>
          </Flex>
          <Flex mt={5}>
            {!smic?.isSmicException && (
              <Text>
                Calculé sur la base du SMIC {smic?.annee} de {smic?.selectedSmic}€ mensuel ({smic?.heuresHebdomadaires}
                €/h) [Date d'entrée en vigueur {smic?.dateEntreeEnVigueur}]
              </Text>
            )}
            {smic?.isSmicException && (
              <Text>
                Calculé sur la base du SMIC {smic?.annee} pour{" "}
                <strong>{smic?.exceptions[employeurAdresseDepartement]?.nomDepartement}</strong> de {smic?.selectedSmic}
                € mensuel ({smic?.exceptions[employeurAdresseDepartement]?.heuresHebdomadaires}
                €/h) [Date d'entrée en vigueur {smic?.dateEntreeEnVigueur}]
              </Text>
            )}
          </Flex>
        </Box>
      </CollapseController>
    </Box>
  );
};
