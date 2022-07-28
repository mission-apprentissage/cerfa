import React, { useState, useEffect, useMemo } from "react";
import { Box, Flex, Center, Container, Spinner, useDisclosure, Text } from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps-rework-mna";
import { useRouter } from "next/router";
import { useSetRecoilState, useRecoilValueLoadable, useRecoilValue } from "recoil";
import PiecesJustificatives from "./PiecesJustificatives/PiecesJustificatives";
import Signatures from "./Signatures/Signatures";
import Suivi from "./Suivi/Suivi";
import DossierHeader from "./components/DossierHeader";
import DossierFooterControls from "./components/DossierFooterControls";
import IsPrivateEmployeurModal from "./components/IsPrivateEmployeurModal";
import FinalizeModal from "./components/FinalizeModal";
import ESignatureModal from "./components/ESignatureModal";
import { workspaceTitleAtom } from "../../hooks/workspaceAtoms";
import { StepWip, TickBubble } from "../../theme/components/icons";
import { CerfaForm } from "./cerfaForm/CerfaForm";
import { useCerfa } from "./formEngine/useCerfa";
import { cerfaSchema } from "./formEngine/cerfaSchema";
import { CerfaControllerContext } from "./formEngine/CerfaControllerContext";
import { dossierCompletionStatus, dossierNameSelector } from "./atoms";
import { useInitCerfa } from "./formEngine/hooks/useInitCerfa";
import { useAutoSave } from "./formEngine/hooks/useAutoSave";
import { useDossier } from "./hooks/useDossier";
import { valueSelector } from "./formEngine/atoms";
import { signaturesPdfLoadedAtom } from "./Signatures/atoms";
import Ribbons from "../../components/Ribbons/Ribbons";

const steps = [
  { label: "Cerfa", description: "Renseignez les informations" },
  { label: "Pièces justificatives", description: "Ajoutez les documents" },
  { label: "Signatures", description: "Récolter les signatures" },
  { label: "Télétransmission", description: "Envoyer et suivre le statut" },
];

const stepByPath = ["cerfa", "documents", "signatures", "suivi"];

const Dossier = () => {
  const router = useRouter();
  const { slug } = router.query;
  const dossierIdParam = slug?.[slug.length - 2];
  const paramstep = slug?.[slug.length - 1];

  // let [auth] = useAuth();
  const { activeStep, setStep } = useSteps({ initialStep: stepByPath.indexOf(paramstep) });

  const { isloaded, dossier } = useDossier(dossierIdParam);
  const { controller: cerfaController } = useCerfa({ schema: cerfaSchema });
  const { isLoading } = useInitCerfa({ controller: cerfaController });
  useAutoSave({ controller: cerfaController });

  const setWorkspaceTitle = useSetRecoilState(workspaceTitleAtom);
  const isEmployeurPrive = useRecoilValue(valueSelector("employeur.privePublic")) === false;
  const [hasSeenPrivateSectorModal, setHasSeenPrivateSectorModal] = useState(false);
  const isPrivateSectorAckModal = useDisclosure({ defaultIsOpen: true });
  const finalizeModalDisclosure = useDisclosure();
  const eSignatureModalDisclosure = useDisclosure();

  const signaturesPdfLoaded = useRecoilValueLoadable(signaturesPdfLoadedAtom);

  const dossierStatus = useRecoilValue(dossierCompletionStatus);
  const cerfaComplete = dossierStatus?.cerfa?.complete;
  const documentsComplete = dossierStatus?.documents?.complete;
  const signatureComplete = dossierStatus?.signature?.complete;

  const dossierName = useRecoilValue(dossierNameSelector);

  useEffect(() => setWorkspaceTitle(dossierName), [dossierName, setWorkspaceTitle]);

  const stepStatuses = useMemo(
    () => ({
      0: { state: activeStep >= 0 ? (cerfaComplete ? "success" : "error") : undefined },
      1: { state: activeStep >= 1 ? (documentsComplete ? "success" : "error") : undefined },
      2: { state: activeStep >= 2 ? (signatureComplete ? "success" : "error") : undefined },
      3: { state: undefined },
    }),
    [activeStep, cerfaComplete, documentsComplete, signatureComplete]
  );

  const goToStep = async (targetIndex) => {
    if (isEmployeurPrive) return false;
    let newSlug = "/cerfa";
    if (targetIndex === 1) newSlug = "/documents";
    if (targetIndex === 2) newSlug = "/signatures";
    if (targetIndex === 3) newSlug = "/suivi";
    router.replace(router.asPath.replace(/\/[^/]*$/, newSlug));
    setStep(targetIndex);
  };

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

  return (
    <CerfaControllerContext.Provider value={cerfaController}>
      <Box w="100%" px={[1, 1, 6, 6]} mb={10}>
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
          <DossierHeader activeStep={activeStep} dossier={dossier} />

          <Flex flexDir="column" width="100%" mt={9}>
            <Steps
              onClickStep={(step) => goToStep(step)}
              activeStep={activeStep}
              checkIcon={() => <TickBubble color={"white"} boxSize="4" />}
              errorIcon={() => <StepWip color={"white"} boxSize="4" />}
            >
              {steps.map(({ label, description }, index) => (
                <Step
                  label={
                    <Box color="labelgrey" fontWeight={activeStep === index ? "bold" : "normal"} mb={1}>
                      {label}
                    </Box>
                  }
                  key={label}
                  description={description}
                  icon={() => (
                    <Box color={activeStep === index ? "white" : "black"} fontWeight="bold">
                      {index + 1}
                    </Box>
                  )}
                  state={stepStatuses[index].state}
                >
                  {dossier.version > 1 &&
                    (index === 0 || index === 3) &&
                    dossier.etat !== "TRANSMIS" &&
                    dossier.etat !== "EN_COURS_INSTRUCTION" &&
                    dossier.etat !== "REFUSE" &&
                    dossier.etat !== "DEPOSE" && (
                      <Ribbons
                        variant={"info_clear"}
                        marginTop={"2rem"}
                        paddingRight={"2rem"}
                        borderColor={"bluefrance"}
                        borderWidth={"1px"}
                        borderStyle={"solid"}
                      >
                        <Text color={"grey.800"}>
                          Commentaire de la demande de complément <br />
                          <br />
                          <strong>{dossier.statutAgecap[dossier.statutAgecap.length - 1].commentaire}</strong>
                        </Text>
                      </Ribbons>
                    )}
                  {index === 0 && <CerfaForm />}
                  {index === 1 && <PiecesJustificatives />}
                  {index === 2 && <Signatures />}
                  {index === 3 && <Suivi />}
                </Step>
              ))}
            </Steps>
            <DossierFooterControls
              activeStep={activeStep}
              steps={steps}
              onClickPrevStep={() => goToStep(activeStep - 1)}
              onClickNextStep={() => goToStep(activeStep + 1)}
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
