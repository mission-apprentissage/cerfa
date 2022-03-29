import React, { useRef, useEffect, useState } from "react";
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
import { useLocation } from "react-router-dom";
import { useRecoilValueLoadable } from "recoil";
import { useCerfa } from "../../../common/hooks/useCerfa/useCerfa";
import { AddFill, SubtractLine, StepWip, StepComplete } from "../../../theme/components/icons";

import {
  cerfaPartFormationCompletionAtom,
  // cerfaPartFormationIsLoadingAtom,
} from "../../../common/hooks/useCerfa/parts/useCerfaFormationAtoms";
import {
  cerfaPartEmployeurCompletionAtom,
  // cerfaPartEmployeurIsLoadingAtom,
} from "../../../common/hooks/useCerfa/parts/useCerfaEmployeurAtoms";
import {
  cerfaPartMaitresCompletionAtom,
  // cerfaPartMaitresIsLoadingAtom,
} from "../../../common/hooks/useCerfa/parts/useCerfaMaitresAtoms";
import {
  cerfaPartApprentiCompletionAtom,
  // cerfaPartApprentiIsLoadingAtom,
} from "../../../common/hooks/useCerfa/parts/useCerfaApprentiAtoms";
import {
  cerfaPartContratCompletionAtom,
  // cerfaPartContratIsLoadingAtom,
} from "../../../common/hooks/useCerfa/parts/useCerfaContratAtoms";

import FormEmployer from "./components/FormEmployer";
import FormLearner from "./components/FormLearner";
import FormLearningMaster from "./components/FormLearningMaster";
import FormContract from "./components/FormContract";
import FormFormation from "./components/FormFormation";
import { CerfaForm } from "../cerfaForm/CerfaForm";

const useOpenAccordionToLocation = () => {
  const scrolledRef = useRef(false);
  const { hash } = useLocation();
  const hashRef = useRef(hash);
  const [accordionIndex, setAccordionIndex] = useState([]);

  useEffect(() => {
    if (hash) {
      // We want to reset if the hash has changed
      if (hashRef.current !== hash) {
        hashRef.current = hash;
        scrolledRef.current = false;
      }

      // only attempt to scroll if we haven't yet (this could have just reset above if hash changed)
      if (!scrolledRef.current) {
        const id = hash.replace("#", "");

        if (id.startsWith("apprenti_")) {
          setAccordionIndex([1]);
        }
      }
    }
    return () => {
      return false;
    };
  }, [hash]);

  return { accordionIndex, setAccordionIndex };
};

const useScrollToLocationSub = (isExpanded) => {
  const scrolledRef = useRef(false);
  const { hash } = useLocation();
  const hashRef = useRef(hash);

  useEffect(() => {
    let scrollTimeoutId = 0;
    if (hash && isExpanded) {
      // We want to reset if the hash has changed
      if (hashRef.current !== hash) {
        hashRef.current = hash;
        scrolledRef.current = false;
      }

      // only attempt to scroll if we haven't yet (this could have just reset above if hash changed)
      if (!scrolledRef.current) {
        const id = hash.replace("#", "");

        // console.log(hash);
        //#accordion-button-accordion_apprenti  // apprenti_adresse_commune_input // #apprenti_adresse_commune_section-label
        //apprenti_intituleDiplomePrepare_section-label

        scrollTimeoutId = setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            scrolledRef.current = true;
          }
        }, 100);
      }
    }
    return () => {
      clearTimeout(scrollTimeoutId);
    };
  }, [hash, isExpanded]);
};

const AccordionItemChild = React.memo(({ title, Component, completion, id, isExpanded }) => {
  useScrollToLocationSub(isExpanded);
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
      <AccordionPanel pb={4}>{<Component />}</AccordionPanel>
    </>
  );
});

export default React.memo(() => {
  const { isLoading, isFetching } = useCerfa();
  const formationCompletion = useRecoilValueLoadable(cerfaPartFormationCompletionAtom);
  const employeurCompletionAtom = useRecoilValueLoadable(cerfaPartEmployeurCompletionAtom);
  const maitresCompletionAtom = useRecoilValueLoadable(cerfaPartMaitresCompletionAtom);
  const apprentiCompletionAtom = useRecoilValueLoadable(cerfaPartApprentiCompletionAtom);
  const contratCompletionAtom = useRecoilValueLoadable(cerfaPartContratCompletionAtom);

  const { accordionIndex, setAccordionIndex } = useOpenAccordionToLocation();

  // const formationIsLoading = useRecoilValueLoadable(cerfaPartFormationIsLoadingAtom);
  // const employeurIsLoading = useRecoilValueLoadable(cerfaPartEmployeurIsLoadingAtom);
  // const maitresIsLoading = useRecoilValueLoadable(cerfaPartMaitresIsLoadingAtom);
  // const apprentiIsLoading = useRecoilValueLoadable(cerfaPartApprentiIsLoadingAtom);
  // const contratIsLoading = useRecoilValueLoadable(cerfaPartContratIsLoadingAtom);

  // const allBlocksLoaded =
  //   !formationIsLoading.contents &&
  //   !employeurIsLoading.contents &&
  //   !maitresIsLoading.contents &&
  //   !apprentiIsLoading.contents &&
  //   !contratIsLoading.contents;

  if (isLoading || isFetching)
    return (
      <Center>
        <Spinner />
      </Center>
    );

  return (
    <>
      <CerfaForm />
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
        {[
          {
            id: "employeur",
            title: "Employeur",
            Component: FormEmployer,
            completion: employeurCompletionAtom?.contents,
          },
          {
            id: "apprenti",
            title: "Apprenti(e)",
            Component: FormLearner,
            completion: apprentiCompletionAtom?.contents,
          },
          {
            id: "maitres",
            title: "Maître d'apprentissage",
            Component: FormLearningMaster,
            completion: maitresCompletionAtom?.contents,
          },
          {
            id: "contrat",
            title: "Contrat",
            Component: FormContract,
            completion: contratCompletionAtom?.contents,
          },
          {
            id: "formation",
            title: "Formation",
            Component: FormFormation,
            completion: formationCompletion?.contents,
          },
        ].map(({ id, ...rest }, key) => {
          return (
            <AccordionItem border="none" key={key} id={`accordion_${id}`}>
              {({ isExpanded }) => <AccordionItemChild isExpanded={isExpanded} {...rest} />}
            </AccordionItem>
          );
        })}
      </Accordion>
    </>
  );
});
