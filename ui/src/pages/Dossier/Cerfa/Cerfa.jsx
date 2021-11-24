import React from "react";
import { Box, Accordion, AccordionItem, AccordionButton, AccordionPanel } from "@chakra-ui/react";

import { AddFill, SubtractLine } from "../../../theme/components/icons";

import { useCerfa } from "../../../common/hooks/useCerfa";

import FormEmployer from "./components/FormEmployer";
import FormLearner from "./components/FormLearner";
import FormLearningMaster from "./components/FormLearningMaster";
import FormContract from "./components/FormContract";
import FormFormation from "./components/FormFormation";
// import FormSubmittingContract from "./components/FormSubmittingContract";

const tabsFormAccordion = [
  {
    title: "EMPLOYEUR",
    Component: FormEmployer,
  },
  {
    title: "APPRENTI(E)",
    Component: FormLearner,
  },
  {
    title: "LE MAÎTRE D’APPRENTISSAGE",
    Component: FormLearningMaster,
  },
  {
    title: "LE CONTRAT",
    Component: FormContract,
  },
  {
    title: "LA FORMATION",
    Component: FormFormation,
  },
  // {
  //   title: "CADRE RÉSERVÉ À L’ORGANISME EN CHARGE DU DÉPÔT DU CONTRAT",
  //   Component: FormSubmittingContract,
  // },
];

export default () => {
  const { isloaded } = useCerfa();

  if (!isloaded) return null;

  return (
    <Accordion allowMultiple allowToggle mt={12}>
      {tabsFormAccordion.map(({ title, Component }, key) => {
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
