import React from "react";
import { Box, Center, Spinner, Accordion, AccordionItem, AccordionButton, AccordionPanel } from "@chakra-ui/react";
import { useCerfa } from "../../../common/hooks/useCerfa/useCerfa";
import { AddFill, SubtractLine } from "../../../theme/components/icons";

import FormEmployer from "./components/FormEmployer";
import FormLearner from "./components/FormLearner";
import FormLearningMaster from "./components/FormLearningMaster";
import FormContract from "./components/FormContract";
import FormFormation from "./components/FormFormation";

export default () => {
  const { isLoading } = useCerfa();

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
        },
        {
          title: "Apprenti(e)",
          Component: FormLearner,
        },
        {
          title: "Maître d'apprentissage",
          Component: FormLearningMaster,
        },
        {
          title: "Contrat",
          Component: FormContract,
        },
        {
          title: "Formation",
          Component: FormFormation,
        },
        // {
        //   title: "CADRE RÉSERVÉ À L’ORGANISME EN CHARGE DU DÉPÔT DU CONTRAT",
        //   Component: FormSubmittingContract,
        // },
      ].map(({ title, Component }, key) => {
        return (
          <AccordionItem border="none" key={key}>
            {({ isExpanded }) => (
              <>
                <AccordionButton bg="#F9F8F6">
                  <Box flex="1" textAlign="left">
                    {title}
                  </Box>
                  {isExpanded ? (
                    <SubtractLine fontSize="12px" color="bluefrance" />
                  ) : (
                    <AddFill fontSize="12px" color="bluefrance" />
                  )}
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Component />
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
