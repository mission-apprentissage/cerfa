import React from "react";
import {
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
} from "@chakra-ui/react";

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
  return (
    <Accordion allowToggle mt={16}>
      {tabsFormAccordion.map(({ title, Component }, key) => {
        return (
          <AccordionItem key={key}>
            <AccordionButton bg="secondaryBackground">
              <Box flex="1" textAlign="left">
                <Heading fontSize="1rem">{title}</Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Component />
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
