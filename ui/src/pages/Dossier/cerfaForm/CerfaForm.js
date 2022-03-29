import { useCerfaController } from "./common/useCerfa";
import { defaultValues, cerfaSchema } from "./schema";
import React, { useEffect, useRef, useState } from "react";
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, HStack, Text } from "@chakra-ui/react";
import { AddFill, StepComplete, StepWip, SubtractLine } from "../../../theme/components/icons";
import { CerfaMaitre } from "./maitre/CerfaMaitre";
import { CerfaEmployer } from "./employer/CerfaEmployer";
import { useRecoilValue } from "recoil";
import { dossierAtom } from "../../../common/hooks/useDossier/dossierAtom";

export const CerfaForm = () => {
  const dossier = useRecoilValue(dossierAtom);

  const { controller: cerfaController, values } = useCerfaController({
    schema: cerfaSchema,
    dossier,
  });

  const readyRef = useRef(false);
  useEffect(() => {
    cerfaController.setValues(defaultValues);
    readyRef.current = true;
  }, []);

  const [accordionIndex, setAccordionIndex] = useState(0);
  return (
    <div>
      {readyRef.current && (
        <Accordion allowMultiple allowToggle mt={12} minH="25vh" index={accordionIndex} onChange={setAccordionIndex}>
          <AccordionItem border="none" id={`employeur`}>
            {({ isExpanded }) => (
              <AccordionItemChild isExpanded={isExpanded} title={"Employeur"} completion={10}>
                <CerfaEmployer controller={cerfaController} />
              </AccordionItemChild>
            )}
          </AccordionItem>
          <AccordionItem border="none" id={`maitre`}>
            {({ isExpanded }) => (
              <AccordionItemChild isExpanded={isExpanded} title={"Maître d'apprentissage"} completion={10}>
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
