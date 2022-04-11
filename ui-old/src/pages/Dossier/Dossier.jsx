import React, { useState, useEffect, useCallback } from "react";
import { Box, Flex, Center, Container, Spinner, useDisclosure } from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps-rework-mna";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSetRecoilState, useRecoilValueLoadable, useRecoilValue } from "recoil";

import useAuth from "../../common/hooks/useAuth";
import { hasPageAccessTo } from "../../common/utils/rolesUtils";

import PiecesJustificatives from "./PiecesJustificatives/PiecesJustificatives";
import Signatures from "./Signatures/Signatures";

import DossierHeader from "./components/DossierHeader";
import DossierFooterControls from "./components/DossierFooterControls";

import AskBetaTestModal from "./components/AskBetaTestModal";
import IsPrivateEmployeurModal from "./components/IsPrivateEmployeurModal";
import FinalizeModal from "./components/FinalizeModal";
import ESignatureModal from "./components/ESignatureModal";

import { workspaceTitleAtom } from "../../common/hooks/workspaceAtoms";
import { StepWip, TickBubble } from "../../theme/components/icons";

import { signaturesPdfLoadedAtom } from "../../common/hooks/useDossier/signaturesAtoms";
import { cerfaEmployeurPrivePublicAtom } from "../../common/hooks/useCerfa/parts/useCerfaEmployeurAtoms";
import { CerfaForm } from "./cerfaForm/CerfaForm";
import { useCerfa } from "./formEngine/useCerfa";
import { cerfaSchema } from "./formEngine/cerfaSchema";
import { CerfaControllerContext } from "./formEngine/CerfaControllerContext";
import { dossierCompletionStatus } from "./dossierCompletionAtoms";
import { useInitCerfa } from "./formEngine/hooks/useInitCerfa";
import { useAutoSave } from "./formEngine/hooks/useAutoSave";
import { useDossier } from "./hooks/useDossier";

const steps = [
  { label: "Cerfa", description: "Renseignez les informations" },
  { label: "Pièces justificatives", description: "Ajoutez les pièces justificatives" },
  { label: "Signatures et envoi", description: "Signatures" },
];

const stepByPath = ["cerfa", "documents", "signatures"];

export default () => {
  let match = useRouteMatch();
  const history = useHistory();
  let [auth] = useAuth();
  const { nextStep, prevStep, activeStep, setStep } = useSteps({
    initialStep: stepByPath.indexOf(match.params.step),
  });
  const [stepState1, setStep1State] = useState();
  const [stepState2, setStep2State] = useState();
  const [stepState3, setStep3State] = useState();
  const [step1Visited, setStep1Visited] = useState(false);
  const [step2Visited, setStep2Visited] = useState(false);
  const [step3Visited, setStep3Visited] = useState(false);

  const { isloaded, dossier } = useDossier(match.params.id);
  const { controller: cerfaController } = useCerfa({ schema: cerfaSchema });
  const { isLoading } = useInitCerfa({ controller: cerfaController });
  useAutoSave({ controller: cerfaController });

  const [documentsComplete, setDocumentsComplete] = useState(false);
  // const { signaturesCompletion, sca, setSignaturesCompletion } = useSignatures();
  const { signaturesCompletion, sca, setSignaturesCompletion } = { signaturesCompletion: 0, sca: 0 };
  const [signaturesComplete, setSignaturesComplete] = useState(false);

  const setWorkspaceTitle = useSetRecoilState(workspaceTitleAtom);
  const employeurPrivePublic = useRecoilValueLoadable(cerfaEmployeurPrivePublicAtom);
  const [hasSeenPrivateSectorModal, setHasSeenPrivateSectorModal] = useState(false);
  const isPrivateSectorAckModal = useDisclosure({ defaultIsOpen: true });
  const finalizeModalDisclosure = useDisclosure();
  const eSignatureModalDisclosure = useDisclosure();

  const signaturesPdfLoaded = useRecoilValueLoadable(signaturesPdfLoadedAtom);

  const dossierStatus = useRecoilValue(dossierCompletionStatus);
  const cerfaComplete = dossierStatus?.cerfa?.complete;
  const cerfaCompletion = dossierStatus?.cerfa?.completion;
  const documentsCompletion = dossierStatus?.documents?.completion;

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

        if (match.params.step === "cerfa") {
          if (cerfaCompletion > 0) {
            setStep1Visited(true);
            setStep2State(documentsCompleteTmp ? "success" : "error");
            setStep3State(!signaturesCompleteTmp ? "error" : "success");
          }
        } else if (match.params.step === "documents") {
          setStep2Visited(true);
          setStep3Visited(true);
          setStep1State(!cerfaComplete ? "error" : undefined);
          setStep3State(!signaturesCompleteTmp ? "error" : "success");
        } else if (match.params.step === "signatures") {
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
    history,
    isloaded,
    match.params.step,
    setSignaturesCompletion,
    setWorkspaceTitle,
    signaturesComplete,
    signaturesCompletion,
    sca,
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
    history.replace(match.url.replace(/\/[^/]*$/, newSlug));

    nextStep();
  }, [activeStep, dossierStatus, history, match, nextStep, stepStateSteps23]);

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
    history.replace(match.url.replace(/\/[^/]*$/, newSlug));

    prevStep();
  }, [activeStep, cerfaComplete, history, match.url, prevStep, step1Visited, stepStateSteps23]);

  if (!isloaded || isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (!dossier) {
    history.push("/404");
  }

  // TODO not Authorize handler

  return (
    <CerfaControllerContext.Provider value={cerfaController}>
      <Box w="100%" px={[1, 1, 6, 6]} mb={10}>
        {hasPageAccessTo(auth, "signature_beta") && <AskBetaTestModal />}
        {finalizeModalDisclosure.isOpen && <FinalizeModal {...finalizeModalDisclosure} dossier={dossier} />}
        {eSignatureModalDisclosure.isOpen && <ESignatureModal {...eSignatureModalDisclosure} />}
        <IsPrivateEmployeurModal
          isOpen={
            employeurPrivePublic?.contents?.value === "Employeur privé" &&
            !hasSeenPrivateSectorModal &&
            isPrivateSectorAckModal.isOpen
          }
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
                if (employeurPrivePublic?.contents?.value === "Employeur privé") return false;
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
                history.replace(match.url.replace(/\/[^/]*$/, newSlug));

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
              employeurPrivePublic={employeurPrivePublic}
              signaturesPdfLoaded={signaturesPdfLoaded}
            />
          </Flex>
        </Container>
      </Box>
    </CerfaControllerContext.Provider>
  );
};
