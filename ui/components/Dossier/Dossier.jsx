import React, { useState, useEffect, useCallback } from "react";
import { Box, Flex, Center, Container, Spinner, useDisclosure } from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps-rework-mna";
import { useRouter } from "next/router";
import { useSetRecoilState, useRecoilValueLoadable, useRecoilValue } from "recoil";

import useAuth from "../../hooks/useAuth";
import { hasPageAccessTo } from "../../common/utils/rolesUtils";

import PiecesJustificatives from "./PiecesJustificatives/PiecesJustificatives";
import Signatures from "./Signatures/Signatures";

import DossierHeader from "./components/DossierHeader";
import DossierFooterControls from "./components/DossierFooterControls";

import AskBetaTestModal from "./components/AskBetaTestModal";
import IsPrivateEmployeurModal from "./components/IsPrivateEmployeurModal";
import FinalizeModal from "./components/FinalizeModal";
import ESignatureModal from "./components/ESignatureModal";

import { workspaceTitleAtom } from "../../hooks/workspaceAtoms";
import { StepWip, TickBubble } from "../../theme/components/icons";

import { CerfaForm } from "./cerfaForm/CerfaForm";
import { useCerfa } from "./formEngine/useCerfa";
import { cerfaSchema } from "./formEngine/cerfaSchema";
import { CerfaControllerContext } from "./formEngine/CerfaControllerContext";
import { dossierCompletionStatus } from "./atoms";
import { useInitCerfa } from "./formEngine/hooks/useInitCerfa";
import { useAutoSave } from "./formEngine/hooks/useAutoSave";
import { useDossier } from "./hooks/useDossier";
import { valueSelector } from "./formEngine/atoms";
import { signaturesPdfLoadedAtom } from "./Signatures/atoms";

const steps = [
  { label: "Cerfa", description: "Renseignez les informations" },
  { label: "Pièces justificatives", description: "Ajoutez les pièces justificatives" },
  { label: "Signatures et envoi", description: "Signatures" },
];

const stepByPath = ["cerfa", "documents", "signatures"];

const Dossier = () => {
  const router = useRouter();
  // TODO BETTER GETTER SLUGS
  const { slug } = router.query;
  const dossierIdParam = slug?.[slug.length - 2];
  const paramstep = slug?.[slug.length - 1];

  let [auth] = useAuth();
  const { nextStep, prevStep, activeStep, setStep } = useSteps({
    initialStep: stepByPath.indexOf(paramstep),
  });
  const [stepState1, setStep1State] = useState();
  const [stepState2, setStep2State] = useState();
  const [stepState3, setStep3State] = useState();
  const [step1Visited, setStep1Visited] = useState(false);
  const [step2Visited, setStep2Visited] = useState(false);
  const [step3Visited, setStep3Visited] = useState(false);

  const { isloaded, dossier } = useDossier(dossierIdParam);
  const { controller: cerfaController } = useCerfa({ schema: cerfaSchema });
  const { isLoading } = useInitCerfa({ controller: cerfaController });
  useAutoSave({ controller: cerfaController });

  const [documentsComplete, setDocumentsComplete] = useState(false);
  // const { signaturesCompletion, sca, setSignaturesCompletion } = useSignatures();
  const [signaturesComplete, setSignaturesComplete] = useState(false);

  const setWorkspaceTitle = useSetRecoilState(workspaceTitleAtom);
  const isEmployeurPrive = useRecoilValue(valueSelector("employeur.privePublic")) === false;
  const [hasSeenPrivateSectorModal, setHasSeenPrivateSectorModal] = useState(false);
  const isPrivateSectorAckModal = useDisclosure({ defaultIsOpen: true });
  const finalizeModalDisclosure = useDisclosure();
  const eSignatureModalDisclosure = useDisclosure();

  const signaturesPdfLoaded = useRecoilValueLoadable(signaturesPdfLoadedAtom);

  const dossierStatus = useRecoilValue(dossierCompletionStatus);
  const cerfaComplete = dossierStatus?.cerfa?.complete;
  const cerfaCompletion = dossierStatus?.cerfa?.completion;
  const documentsCompletion = dossierStatus?.documents?.completion;
  const signatureCompletion = dossierStatus?.signature?.completion;
  const { signaturesCompletion, sca, setSignaturesCompletion } = {
    signaturesCompletion: signatureCompletion,
    sca: signatureCompletion,
  };

  useEffect(() => {
    const run = async () => {
      if (isloaded && dossier) {
        setWorkspaceTitle(dossier.nom);
      }

      if (documentsCompletion !== null && signaturesCompletion !== null) {
        const documentsCompleteTmp = documentsCompletion === 100;
        const signaturesCompleteTmp = sca === 100;

        setDocumentsComplete(documentsCompleteTmp);
        setSignaturesComplete(signaturesCompleteTmp);

        if (paramstep === "cerfa") {
          if (cerfaCompletion > 0) {
            setStep1Visited(true);
            setStep2State(documentsCompleteTmp ? "success" : "error");
            setStep3State(!signaturesCompleteTmp ? "error" : "success");
          }
        } else if (paramstep === "documents") {
          setStep2Visited(true);
          setStep3Visited(true);
          setStep1State(!cerfaComplete ? "error" : undefined);
          setStep3State(!signaturesCompleteTmp ? "error" : "success");
        } else if (paramstep === "signatures") {
          setStep3Visited(true);
          setStep2Visited(true);
          setStep1State(!cerfaComplete ? "error" : undefined);
          setStep2State(!documentsCompleteTmp ? "error" : undefined);
        }
      }
    };
    run();
  }, [
    dossierStatus,
    documentsComplete,
    documentsCompletion,
    dossier,
    router,
    isloaded,
    paramstep,
    setSignaturesCompletion,
    setWorkspaceTitle,
    signaturesComplete,
    signaturesCompletion,
    sca,
    cerfaCompletion,
    cerfaComplete,
  ]);

  let stepStateSteps23 = useCallback(
    async (nextActiveStep) => {
      if (!documentsComplete && nextActiveStep !== 1) {
        setStep2State(step2Visited ? "error" : undefined);
      } else {
        setStep2State(documentsComplete ? (nextActiveStep === 0 ? "success" : undefined) : undefined);
      }

      if (!signaturesComplete && nextActiveStep !== 2) {
        setStep3State(step3Visited ? "error" : undefined);
      } else {
        setStep3State(undefined);
      }

      if (nextActiveStep === 1) setStep2Visited(true);
      if (nextActiveStep === 2) setStep3Visited(true);
    },
    [documentsComplete, signaturesComplete, step2Visited, step3Visited]
  );
  let onClickNextStep = useCallback(async () => {
    const nextActiveStep = activeStep + 1;

    if (!cerfaComplete && nextActiveStep !== 0) {
      setStep1State("error");
      setStep1Visited(true);
    } else {
      setStep1State(undefined);
    }

    stepStateSteps23(nextActiveStep);

    if (nextActiveStep === 0) setStep1Visited(true);

    let newSlug = "/cerfa";
    if (nextActiveStep === 1) newSlug = "/documents";
    if (nextActiveStep === 2) newSlug = "/signatures";
    router.replace(router.asPath.replace(/\/[^/]*$/, newSlug));

    nextStep();
  }, [activeStep, router, nextStep, stepStateSteps23, cerfaComplete]);

  let onClickPrevStep = useCallback(async () => {
    const nextActiveStep = activeStep - 1;

    if (!cerfaComplete && nextActiveStep !== 0) {
      setStep1State(step1Visited ? "error" : undefined);
    } else {
      setStep1State(undefined);
    }

    stepStateSteps23(nextActiveStep);

    if (nextActiveStep === 0) setStep1Visited(true);

    let newSlug = "/cerfa";
    if (nextActiveStep === 1) newSlug = "/documents";
    if (nextActiveStep === 2) newSlug = "/signatures";
    router.replace(router.asPath.replace(/\/[^/]*$/, newSlug));

    prevStep();
  }, [activeStep, cerfaComplete, router, prevStep, step1Visited, stepStateSteps23]);

  if (!isloaded || isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (!dossier) {
    router.push("/404");
  }

  // TODO not Authorize handler

  return (
    <CerfaControllerContext.Provider value={cerfaController}>
      <Box w="100%" px={[1, 1, 6, 6]} mb={10}>
        {hasPageAccessTo(auth, "signature_beta") && <AskBetaTestModal />}
        {finalizeModalDisclosure.isOpen && <FinalizeModal {...finalizeModalDisclosure} dossier={dossier} />}
        {eSignatureModalDisclosure.isOpen && <ESignatureModal {...eSignatureModalDisclosure} />}
        <IsPrivateEmployeurModal
          isOpen={isEmployeurPrive && !hasSeenPrivateSectorModal && isPrivateSectorAckModal.isOpen}
          onClose={() => {
            setHasSeenPrivateSectorModal(true);
            isPrivateSectorAckModal.onClose();
          }}
          onAcknowledgement={() => {
            setHasSeenPrivateSectorModal(true);
            isPrivateSectorAckModal.onClose();
          }}
        />
        <Container maxW="xl">
          <DossierHeader dossier={dossier} />

          <Flex flexDir="column" width="100%" mt={9}>
            <Steps
              onClickStep={(step) => {
                if (isEmployeurPrive) return false;
                if (!cerfaComplete && step !== 0) {
                  setStep1State(step1Visited ? "error" : "error");
                } else {
                  setStep1State(undefined);
                }
                stepStateSteps23(step);
                if (step === 0) setStep1Visited(true);

                let newSlug = "/cerfa";
                if (step === 1) newSlug = "/documents";
                if (step === 2) newSlug = "/signatures";
                router.replace(router.asPath.replace(/\/[^/]*$/, newSlug));

                return setStep(step);
              }}
              activeStep={activeStep}
              checkIcon={() => {
                return <TickBubble color={"white"} boxSize="4" />;
              }}
              errorIcon={() => {
                return <StepWip color={"white"} boxSize="4" />;
              }}
            >
              {steps.map(({ label, description }, index) => {
                return (
                  <Step
                    label={
                      <Box color="labelgrey" fontWeight={activeStep === index ? "bold" : "normal"} mb={1}>
                        {label}
                      </Box>
                    }
                    key={label}
                    description={description}
                    icon={() => {
                      return (
                        <Box color={activeStep === index ? "white" : "black"} fontWeight="bold">
                          {index + 1}
                        </Box>
                      );
                    }}
                    state={index === 0 ? stepState1 : index === 1 ? stepState2 : stepState3}
                  >
                    {index === 1 && <PiecesJustificatives />}
                    {index === 2 && <Signatures />}
                  </Step>
                );
              })}
            </Steps>
            <Box opacity={activeStep === 0 ? 1 : 0} h={activeStep === 0 ? "auto" : 0}>
              {(step1Visited || activeStep === 0) && <CerfaForm />}
            </Box>
            <DossierFooterControls
              activeStep={activeStep}
              steps={steps}
              onClickPrevStep={onClickPrevStep}
              onClickNextStep={onClickNextStep}
              finalizeModalDisclosure={finalizeModalDisclosure}
              eSignatureModalDisclosure={eSignatureModalDisclosure}
              dossierComplete={dossierStatus.dossier.complete}
              isEmployeurPrive={isEmployeurPrive}
              signaturesPdfLoaded={signaturesPdfLoaded}
            />
          </Flex>
        </Container>
      </Box>
    </CerfaControllerContext.Provider>
  );
};

export default Dossier;
