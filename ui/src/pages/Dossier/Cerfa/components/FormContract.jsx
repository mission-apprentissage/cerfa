import React from "react";
import { Box, FormLabel, Text, Flex, HStack, Collapse } from "@chakra-ui/react";

import { useCerfaContrat } from "../../../../common/hooks/useCerfa/parts/useCerfaContrat";
import InputCerfa from "./Input";

const FormContract = () => {
  const {
    get: {
      contrat: {
        typeContratApp,
        typeDerogation,
        numeroContratPrecedent,
        dateConclusion,
        dateDebutContrat,
        dateEffetAvenant,
        dateFinContrat,
        dureeTravailHebdoHeures,
        dureeTravailHebdoMinutes,
        travailRisque,
        salaireEmbauche,
        caisseRetraiteComplementaire,
        avantageNature,
        avantageNourriture,
        avantageLogement,
        autreAvantageEnNature,
        remunerationsAnnuelles,
      },
    },
    onSubmit: {
      contrat: { avantageNature: onSubmittedContratAvantageNature },
    },
  } = useCerfaContrat();

  return (
    <Box>
      <Flex>
        <Box w="55%" flex="1">
          <InputCerfa path="contrat.typeContratApp" field={typeContratApp} type="select" mt="2" />
          <InputCerfa path="contrat.typeDerogation" field={typeDerogation} type="select" mt="2" />
          <Text textStyle="sm" fontStyle="italic">
            à renseigner si une dérogation existe pour ce contrat
          </Text>
          <InputCerfa path="contrat.numeroContratPrecedent" field={numeroContratPrecedent} type="text" mt="2" />
          <InputCerfa path="contrat.dateConclusion" field={dateConclusion} type="date" mt="2" />
          <Text textStyle="sm">(Date de signature du présent contrat)</Text>
        </Box>
        <Box w="55%" ml="5w">
          <InputCerfa path="contrat.dateDebutContrat" field={dateDebutContrat} type="date" mt="2" />
          <InputCerfa path="contrat.dateEffetAvenant" field={dateEffetAvenant} type="date" mt="2" />
          <InputCerfa path="contrat.dateFinContrat" field={dateFinContrat} type="date" mt="2" />
          <FormLabel my={3} fontWeight={700}>
            Durée hebdomadaire du travail :
          </FormLabel>
          <Flex>
            <InputCerfa path="contrat.dureeTravailHebdoHeures" field={dureeTravailHebdoHeures} type="text" mt="2" />
            <InputCerfa path="contrat.dureeTravailHebdoMinutes" field={dureeTravailHebdoMinutes} type="text" mt="2" />
          </Flex>
        </Box>
      </Flex>
      <Box pt={4}>
        <InputCerfa path="employeur.travailRisque" field={travailRisque} type="radio" mt="2" />
        <FormLabel fontWeight={700}>Rémunération</FormLabel>

        {remunerationsAnnuelles.map((ra, i) => {
          if (i === 1 || i === 3 || i === 5 || i === 7) return null;

          return (
            <Box key={i}>
              {i === 0 && <Box>1 re année, du</Box>}
              {i === 2 && <Box mt={2}>2 eme année, du</Box>}
              {i === 4 && <Box mt={2}>3 eme année, du</Box>}
              {i === 6 && <Box mt={2}>4 eme année, du</Box>}
              <Box>
                {[remunerationsAnnuelles[i], remunerationsAnnuelles[i + 1]].map((remunerationsAnnuelle, j) => {
                  let path = "";
                  switch (i + j) {
                    case 0:
                      path = "11";
                      break;
                    case 1:
                      path = "12";
                      break;
                    case 2:
                      path = "21";
                      break;
                    case 3:
                      path = "22";
                      break;
                    case 4:
                      path = "31";
                      break;
                    case 5:
                      path = "32";
                      break;
                    case 6:
                      path = "41";
                      break;
                    case 7:
                      path = "42";
                      break;

                    default:
                      break;
                  }
                  return (
                    <HStack spacing={2} key={j}>
                      <InputCerfa
                        path={`contrat.remunerationsAnnuelles.${path}.dateDebut`}
                        field={remunerationsAnnuelle.dateDebut}
                        type="date"
                        mt="2"
                      />
                      <Box mt="1.7rem !important">au</Box>
                      <InputCerfa
                        path={`contrat.remunerationsAnnuelles.${path}.dateFin`}
                        field={remunerationsAnnuelle.dateFin}
                        type="date"
                        mt="2"
                      />
                      <InputCerfa
                        path={`contrat.remunerationsAnnuelles.${path}.taux`}
                        field={remunerationsAnnuelle.taux}
                        type="text"
                        mt="2"
                      />
                      <Box mt="1.7rem !important">%</Box>
                      <Box mt="1.7rem !important">du</Box>
                      <InputCerfa
                        path={`contrat.remunerationsAnnuelles.${path}.typeSalaire`}
                        field={remunerationsAnnuelle.typeSalaire}
                        type="text"
                        mt="2"
                      />
                      <Box mt="1.7rem !important">;</Box>
                    </HStack>
                  );
                })}
              </Box>
            </Box>
          );
        })}

        <Flex mt={5}>
          <Box w="55%" flex="1">
            <InputCerfa path="contrat.salaireEmbauche" field={salaireEmbauche} type="text" mt="2" />
          </Box>
          <Box w="55%" ml={5}>
            <InputCerfa
              path="contrat.caisseRetraiteComplementaire"
              field={caisseRetraiteComplementaire}
              type="text"
              mt="2"
            />
          </Box>
        </Flex>
        <FormLabel my={4} fontWeight={700}>
          Avantages en nature, le cas échéant :
        </FormLabel>
        <InputCerfa
          path="contrat.avantageNature"
          field={avantageNature}
          type="radio"
          mt="2"
          onSubmittedField={onSubmittedContratAvantageNature}
        />
        <Collapse in={avantageNature.value === "Oui"} animateOpacity>
          <Flex>
            <Box flex="1">
              <InputCerfa path="contrat.avantageNourriture" field={avantageNourriture} type="text" mt="2" />€ / repas
            </Box>
            <Box ml={5}>
              <InputCerfa path="contrat.avantageLogement" field={avantageLogement} type="text" mt="2" />€ / mois
            </Box>
          </Flex>
          <Box>
            <InputCerfa path="contrat.autreAvantageEnNature" field={autreAvantageEnNature} type="text" mt="2" />
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default FormContract;
