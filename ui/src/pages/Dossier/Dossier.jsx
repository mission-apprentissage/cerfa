import React, { useState } from "react";
import {
  Box,
  Flex,
  Center,
  Heading,
  Button,
  Container,
  Badge,
  HStack,
  AvatarGroup,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { useHistory, useRouteMatch } from "react-router-dom";
import { _delete } from "../../common/httpClient";
import { prettyPrintDate } from "../../common/utils/dateUtils";

import Cerfa from "./Cerfa/Cerfa";
import PiecesJustificatives from "./PiecesJustificatives/PiecesJustificatives";
import Signatures from "./Signatures/Signatures";
import Statuts from "./Statuts/Statuts";

import { useDossier } from "../../common/hooks/useDossier";

const steps = [
  { label: "Cerfa", description: "Information contenu dans le Cerfa" },
  { label: "Piéces justificatives", description: "À ajouter au dossier" },
  { label: "Signatures", description: "Signatures électronique" },
  { label: "État", description: "Statut de votre dossier" },
];

const stepByPath = ["cerfa", "documents", "signatures", "etat"];

export default ({ onLoaded }) => {
  let match = useRouteMatch();
  const { nextStep, prevStep, reset, activeStep, setStep } = useSteps({
    initialStep: stepByPath.indexOf(match.params.step),
  });
  const [stepState, setStepState] = useState();
  const { isloaded, dossier } = useDossier(match.params.id);
  const history = useHistory();

  const onClickNextStep = async () => {
    setStepState("loading"); // type StateValue = "loading" | "error" | undefined
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStepState("error");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStepState();
    nextStep();
  };

  if (!isloaded) return null;

  if (!dossier) {
    history.push("/404");
  }

  // TODO not Authorize handler

  // TODO useeffect
  onLoaded({
    title: dossier.nom,
    onLeave: async ({ internalLeave }) => {
      if (internalLeave) {
        if (!dossier.saved) {
          // eslint-disable-next-line no-restricted-globals
          const leave = confirm("Voulez-vous vraiment quitter cette page ?");
          if (leave) {
            await _delete(`/api/v1/dossier/${dossier._id}`);
          } else {
            history.goBack();
          }
        }
      }
    },
  });

  return (
    <Box w="100%" px={[1, 1, 12, 24]}>
      <Container maxW="xl">
        <HStack mt={6}>
          <Heading as="h1" flexGrow="1">
            {dossier.nom}
            <Badge
              variant="solid"
              bg="orangedark.300"
              borderRadius="16px"
              color="grey.800"
              textStyle="sm"
              px="15px"
              ml="10px"
            >
              Brouillon
            </Badge>
            <Badge variant="solid" bg="grey.100" color="grey.500" textStyle="sm" px="15px" ml="10px">
              <Text as="i">
                {!dossier.saved ? "Non sauvegardé" : `Dernière sauvegarde ${prettyPrintDate(dossier.lastModified)}`}
              </Text>
            </Badge>
          </Heading>
          <HStack>
            <AvatarGroup size="md" max={2}>
              <Avatar name="Paul Pierre" />
              <Avatar name="Pablo Hanry" />
            </AvatarGroup>
            <Button size="md" onClick={() => {}} variant="secondary">
              Partager
            </Button>
          </HStack>
        </HStack>

        <Flex flexDir="column" width="100%" mt={9}>
          <Steps
            onClickStep={(step) => {
              // if (step === 0 || step === 1) return setStep(step);
              return setStep(step);
            }}
            activeStep={activeStep}
            state={stepState}
          >
            {steps.map(({ label, description }, index) => (
              <Step label={label} key={label} description={description}>
                {index === 0 && <Cerfa />}
                {index === 1 && <PiecesJustificatives />}
                {index === 2 && <Signatures dossierId={dossier._id} />}
                {index === 3 && <Statuts />}
              </Step>
            ))}
          </Steps>
          {activeStep === 4 ? (
            <Center p={4} flexDir="column">
              <Heading fontSize="xl">Woohoo! C'est fini!</Heading>
              <Button mt={6} size="sm" onClick={reset}>
                Remise à zero
              </Button>
            </Center>
          ) : (
            <Flex width="100%" justify="flex-end" mt={8} mb={10}>
              <Button mr={4} size="md" variant="primary" onClick={prevStep} isDisabled={activeStep === 0}>
                Retourner à l'étape précédente
              </Button>
              <Button size="md" onClick={onClickNextStep} variant="primary">
                {activeStep === steps.length - 1 ? "Soumettre" : "Passer à l'étape suivante"}
              </Button>
            </Flex>
          )}
        </Flex>
      </Container>
    </Box>
  );
};
