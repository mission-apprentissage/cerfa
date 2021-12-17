import React, { lazy } from "react";
import { Box, Accordion, AccordionItem, AccordionButton, AccordionPanel } from "@chakra-ui/react";

import { AddFill, SubtractLine } from "../../../theme/components/icons";

const FormFormation = lazy(() => import("./components/FormFormation"));

export default () => {
  return (
    <Accordion allowMultiple allowToggle mt={12}>
      {[
        {
          title: "LA FORMATION",
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
