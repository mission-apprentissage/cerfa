import React, { useEffect, useState } from "react";
import {
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
} from "@chakra-ui/react";

import { _get } from "../../../common/httpClient";

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
  const [schema, setSchema] = useState(null);
  useEffect(() => {
    async function run() {
      try {
        const response = await _get("/api/v1/cerfa/schema");
        setSchema(response);
      } catch (e) {
        console.log(e);
      }
    }
    run();
  }, []);

  if (!schema) return null;

  return (
    <Accordion allowToggle mt={16}>
      <Input
        name="siret"
        label="N° SIRET CFA :"
        schema={schema.organismeFormation.siret}
        onSubmitted={(values) => {
          console.log(JSON.stringify(values, null, 2));
        }}
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
