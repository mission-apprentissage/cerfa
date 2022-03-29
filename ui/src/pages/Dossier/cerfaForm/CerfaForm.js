import { useRecoilValue } from "recoil";
import { useCerfaController } from "./common/useCerfa";
import { defaultValues, SCHEMA } from "./common/schema/SCHEMA";
import React, { useEffect, useState } from "react";
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, HStack, Text } from "@chakra-ui/react";
import { AddFill, StepComplete, StepWip, SubtractLine } from "../../../theme/components/icons";
import { CerfaMaitre } from "./maitre/CerfaMaitre";
import { cerfaAtom } from "./common/atoms";

export const CerfaForm = () => {
  const { controller: cerfaController, values } = useCerfaController({
    schema: SCHEMA,
  });

  const [ready, setReady] = useState(false);
  useEffect(() => {
    cerfaController.setValues(defaultValues);
    setReady(true);
  }, []);

  const cerfa = useRecoilValue(cerfaAtom);
  console.log("cerfa", cerfa, values);

  const [accordionIndex, setAccordionIndex] = useState(0);
  return (
    <div>
      {ready && (
        <Accordion
          allowMultiple
          allowToggle
          mt={12}
          minH="25vh"
          index={accordionIndex}
          onChange={(expandedIndex) => {
            setAccordionIndex(expandedIndex);
          }}
        >
          <AccordionItem border="none" id={`accordion_1`}>
            {({ isExpanded }) => (
              <AccordionItemChild isExpanded={isExpanded} title={"Maitre"} completion={10}>
                <CerfaMaitre controller={cerfaController} />
              </AccordionItemChild>
            )}
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

const AccordionItemChild = React.memo(({ title, children, completion, id, isExpanded }) => {
  return (
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
      <AccordionPanel pb={4}>{children}</AccordionPanel>
    </>
  );
});
