import { useCerfa } from "./formEngine/useCerfa";
import { cerfaSchema } from "./schema";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, HStack, Text } from "@chakra-ui/react";
import { AddFill, StepComplete, StepWip, SubtractLine } from "../../../theme/components/icons";
import { CerfaMaitre } from "./blocks/maitre/CerfaMaitre";
import { CerfaEmployer } from "./blocks/employer/CerfaEmployer";
import { CerfaControllerContext } from "./common/CerfaControllerContext";
import { getValues } from "./common/utils/getValues";
import { cerfaAtom } from "./formEngine/atoms";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { employerSchema } from "./blocks/employer/employerSchema";
import { maitreSchema } from "./blocks/maitre/maitreSchema";
import { dossierAtom } from "../../../common/hooks/useDossier/dossierAtom";
import { _get } from "../../../common/httpClient";
import { CerfaApprenti } from "./blocks/apprenti/CerfaApprenti";
import { apprentiSchema } from "./blocks/apprenti/apprentiSchema";
import { isRequired } from "./common/utils/isRequired";
import { CerfaContrat } from "./blocks/contrat/cerfaContrat";
import { isHidden } from "./common/utils/isHidden";
import { initFields } from "./initFields";
import { CerfaFormation } from "./blocks/formation/CerfaFormation";
import { formationSchema } from "./blocks/formation/formationSchema";
import { contratSchema } from "./blocks/contrat/contratSchema";

const getCompletion = (fieldNames, fields) => {
  let done = 0;
  let todo = 0;
  const values = getValues(fields);
  fieldNames.forEach((current) => {
    if (current.includes("[]")) return;
    const field = fields[current];
    if (!field) return;
    const required = isRequired(field, values);
    const hidden = isHidden(field, values);
    const isTodo = (required || field.error) && !hidden;
    if (isTodo) todo += 1;
    if (isTodo && field.success) done += 1;
  }, 0);

  if (todo === 0) return 100;
  return (done / todo) * 100;
};

const useCompletions = () => {
  const fields = useRecoilValue(cerfaAtom);
  return useMemo(
    () =>
      fields
        ? {
            employerCompletion: getCompletion(Object.keys(employerSchema), fields),
            apprentiCompletion: getCompletion(Object.keys(apprentiSchema), fields),
            maitreCompletion: getCompletion(Object.keys(maitreSchema), fields),
            contratCompletion: getCompletion(Object.keys(contratSchema), fields),
            formationCompletion: getCompletion(Object.keys(formationSchema), fields),
          }
        : {},
    [fields]
  );
};

const useAutoSave = ({ controller }) => {
  const savedFields = useRef();
  useEffect(() => {
    const handler = (v) => {
      const changed = Object.fromEntries(
        Object.entries(v).filter(([key, value]) => value !== savedFields.current?.[key])
      );
      const toSave = Object.fromEntries(
        Object.entries(changed).map(([name, field]) => {
          if (field.success) {
            return [name, field.value];
          }
          return [name, null];
        })
      );
      console.log("save", v, getValues(v), toSave);
      savedFields.current = v;
    };
    controller.on("CHANGE", handler);
    return () => controller.off("CHANGE", handler);
  }, [controller]);
};

export const CerfaForm = memo(() => {
  const { controller: cerfaController } = useCerfa({
    schema: cerfaSchema,
  });

  useAutoSave({ controller: cerfaController });

  const getDossier = useRecoilCallback(
    ({ snapshot }) =>
      () =>
        snapshot.getPromise(dossierAtom),
    []
  );

  const readyRef = useRef(false);
  useEffect(() => {
    (async () => {
      const dossier = await getDossier();
      const cerfa = await _get(`/api/v1/cerfa?dossierId=${dossier._id}`);
      const fields = initFields({ cerfa, schema: cerfaSchema });
      console.log(fields);
      readyRef.current = true;
      cerfaController.setFields(fields);
    })();
  }, [cerfaController, getDossier]);

  const [accordionIndex, setAccordionIndex] = useState(0);
  const { employerCompletion, maitreCompletion, apprentiCompletion, formationCompletion, contratCompletion } =
    useCompletions();

  return (
    <CerfaControllerContext.Provider value={cerfaController}>
      <div>
        {readyRef.current && (
          <Accordion allowMultiple allowToggle mt={12} minH="25vh" index={accordionIndex} onChange={setAccordionIndex}>
            <AccordionItem border="none" id={`employeur`}>
              {({ isExpanded }) => (
                <AccordionItemChild isExpanded={isExpanded} title={"Employeur"} completion={employerCompletion}>
                  <CerfaEmployer />
                </AccordionItemChild>
              )}
            </AccordionItem>
            <AccordionItem border="none" id={`employeur`}>
              {({ isExpanded }) => (
                <AccordionItemChild isExpanded={isExpanded} title={"Apprenti"} completion={apprentiCompletion}>
                  <CerfaApprenti />
                </AccordionItemChild>
              )}
            </AccordionItem>
            <AccordionItem border="none" id={`maitre`}>
              {({ isExpanded }) => (
                <AccordionItemChild
                  isExpanded={isExpanded}
                  title={"Maître d'apprentissage"}
                  completion={maitreCompletion}
                >
                  <CerfaMaitre />
                </AccordionItemChild>
              )}
            </AccordionItem>
            <AccordionItem border="none" id={`contrat`}>
              {({ isExpanded }) => (
                <AccordionItemChild isExpanded={isExpanded} title={"Contrat"} completion={contratCompletion}>
                  <CerfaContrat />
                </AccordionItemChild>
              )}
            </AccordionItem>
            <AccordionItem border="none" id={`formation`}>
              {({ isExpanded }) => (
                <AccordionItemChild isExpanded={isExpanded} title={"Formation"} completion={formationCompletion}>
                  <CerfaFormation />
                </AccordionItemChild>
              )}
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </CerfaControllerContext.Provider>
  );
});

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
      <AccordionPanel pb={4}>{isExpanded && children}</AccordionPanel>
    </>
  );
});
