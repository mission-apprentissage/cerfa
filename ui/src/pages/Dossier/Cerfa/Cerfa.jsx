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

import { useDossier } from "../../../common/hooks/useDossier";

import FormEmployer from "./components/FormEmployer";
import FormLearner from "./components/FormLearner";
import FormLearningMaster from "./components/FormLearningMaster";
import FormContract from "./components/FormContract";
import FormFormation from "./components/FormFormation";
// import FormSubmittingContract from "./components/FormSubmittingContract";
import Input from "./components/Input";

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
  const { isloaded, cerfa } = useDossier();

  if (!isloaded) return null;

  return (
    <Accordion allowToggle mt={16}>
      <Input
        name={cerfa.siretCFA.name}
        label={cerfa.siretCFA.label}
        requiredMessage={cerfa.siretCFA.requiredMessage}
        schema={cerfa.siretCFA.schema}
        onSubmitted={cerfa.siretCFA.onSubmitted}
        onFetch={cerfa.siretCFA.onFetch}
        history={cerfa.siretCFA.history}
        mb="3"
      />
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
