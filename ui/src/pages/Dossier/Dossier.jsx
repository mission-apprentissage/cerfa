import React, { useState } from "react";
import { setTitle } from "../../common/utils/pageUtils";
import { Box, Flex, Center, Heading, Button, Container } from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import Layout from "../layout/Layout";
import { Breadcrumb } from "../../common/components/Breadcrumb";
import UploadFiles from "../../common/components/UploadFiles";
import Cerfa from "./Cerfa/Cerfa";

const steps = [
  { label: "Cerfa", description: "Information contenu dans le Cerfa" },
  { label: "Piéces justificatives", description: "À ajouter au dossier" },
  { label: "Signatures", description: "Signatures électronique" },
  { label: "État", description: "Statut de votre dossier" },
];

export default () => {
  const { nextStep, prevStep, reset, activeStep, setStep } = useSteps({
    initialStep: 0,
  });
  const [stepState, setStepState] = useState();

  const onClickNextStep = async () => {
    setStepState("loading"); // type StateValue = "loading" | "error" | undefined
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStepState("error");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStepState();
    nextStep();
  };

  const title = "Nouveau contrat";
  setTitle(title);

  return (
    <Layout>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]} color="grey.800">
        <Container maxW="xl">
          <Breadcrumb pages={[{ title: "Accueil", to: "/" }, { title: title }]} />
        </Container>
      </Box>
      <Box w="100%" minH="100vh" px={[1, 1, 12, 24]}>
        <Container maxW="xl">
          <Heading as="h1" mb={8} mt={6}>
            {title}
          </Heading>
          <Flex flexDir="column" width="100%" mt={6}>
            <Steps onClickStep={(step) => setStep(step)} activeStep={activeStep} state={stepState}>
              {steps.map(({ label, description }, index) => (
                <Step label={label} key={label} description={description}>
                  {index === 0 && <Cerfa />}
                  {index === 1 && (
                    <Box mt={16}>
                      Pieces jointes
                      <UploadFiles />
                    </Box>
                  )}
                  {index === 2 && <Box mt={16}>Signatures</Box>}
                  {index === 3 && <Box mt={16}>Statuts</Box>}
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
              <Flex width="100%" justify="flex-end" mt={8}>
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
    </Layout>
  );
};
