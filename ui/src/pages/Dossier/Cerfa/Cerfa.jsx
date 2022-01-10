import React from "react";
import {
  Box,
  Center,
  Spinner,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Text,
  HStack,
} from "@chakra-ui/react";
import { useRecoilValueLoadable } from "recoil";
import { useCerfa } from "../../../common/hooks/useCerfa/useCerfa";
import { AddFill, SubtractLine, StepWip, StepComplete } from "../../../theme/components/icons";

import { cerfaPartFormationCompletionAtom } from "../../../common/hooks/useCerfa/parts/useCerfaFormationAtoms";
import { cerfaPartEmployeurCompletionAtom } from "../../../common/hooks/useCerfa/parts/useCerfaEmployeurAtoms";
import { cerfaPartMaitresCompletionAtom } from "../../../common/hooks/useCerfa/parts/useCerfaMaitresAtoms";

import FormEmployer from "./components/FormEmployer";
import FormLearner from "./components/FormLearner";
import FormLearningMaster from "./components/FormLearningMaster";
import FormContract from "./components/FormContract";
import FormFormation from "./components/FormFormation";

export default () => {
  const { isLoading } = useCerfa();
  const formationCompletion = useRecoilValueLoadable(cerfaPartFormationCompletionAtom);
  const employeurCompletionAtom = useRecoilValueLoadable(cerfaPartEmployeurCompletionAtom);
  const maitresCompletionAtom = useRecoilValueLoadable(cerfaPartMaitresCompletionAtom);

  if (isLoading)
    return (
      <Center>
        <Spinner />
      </Center>
    );

  return (
    <Accordion allowMultiple allowToggle mt={12}>
      {[
        {
          title: "Employeur",
          Component: FormEmployer,
          completion: employeurCompletionAtom?.contents,
        },
        {
          title: "Apprenti(e)",
          Component: FormLearner,
          completion: 0,
        },
        {
          title: "Maître d'apprentissage",
          Component: FormLearningMaster,
          completion: maitresCompletionAtom?.contents,
        },
        {
          title: "Contrat",
          Component: FormContract,
          completion: 0,
        },
        {
          title: "Formation",
          Component: FormFormation,
          completion: formationCompletion?.contents,
        },
        // {
        //   title: "CADRE RÉSERVÉ À L’ORGANISME EN CHARGE DU DÉPÔT DU CONTRAT",
        //   Component: FormSubmittingContract,
        // },
      ].map(({ title, Component, completion }, key) => {
        return (
          <AccordionItem border="none" key={key}>
            {({ isExpanded }) => (
              <>
                <AccordionButton bg="#F9F8F6">
                  {completion < 100 && <StepWip color={"flatwarm"} boxSize="4" mr={2} />}
                  {completion >= 100 && <StepComplete color={"greensoft.500"} boxSize="4" mr={2} />}
                  <Box flex="1" textAlign="left">
                    <HStack>
                      <Text fontWeight="bold">{title}</Text>
                      <Text> - {Math.round(completion)}%</Text>
                    </HStack>
                  </Box>
                  {isExpanded ? (
                    <SubtractLine fontSize="12px" color="bluefrance" />
                  ) : (
                    <AddFill fontSize="12px" color="bluefrance" />
                  )}
                </AccordionButton>
                <AccordionPanel pb={4}>{isExpanded && <Component />}</AccordionPanel>
              </>
            )}
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
