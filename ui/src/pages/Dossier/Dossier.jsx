import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Center,
  Heading,
  Button,
  Container,
  Badge,
  HStack,
  Text,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { prettyPrintDate } from "../../common/utils/dateUtils";
import { hasContextAccessTo } from "../../common/utils/rolesUtils";
import { _put } from "../../common/httpClient";
import useAuth from "../../common/hooks/useAuth";
import PromptModal from "../../common/components/Modals/PromptModal";
import { betaVersion, BetaFeatures } from "../../common/components/BetaFeatures";

import Cerfa from "./Cerfa/Cerfa";
import PiecesJustificatives from "./PiecesJustificatives/PiecesJustificatives";
import Signatures from "./Signatures/Signatures";
import Statuts from "./Statuts/Statuts";
import { InviteModal } from "./components/InviteModal";
import LivePeopleAvatar from "./components/LivePeopleAvatar";

import { useDossier } from "../../common/hooks/useDossier/useDossier";
import { workspaceTitleAtom } from "../../common/hooks/workspaceAtoms";
import { AvatarPlus } from "../../theme/components/icons";

const steps = [
  { label: "Cerfa", description: "Information contenu dans le Cerfa" },
  { label: "Piéces justificatives", description: "À ajouter au dossier" },
  { label: "Signatures", description: "Signatures électronique" },
  { label: "État", description: "Statut de votre dossier" },
];

const stepByPath = ["cerfa", "documents", "signatures", "etat"];

const AskBetaTest = () => {
  let [auth, setAuth] = useAuth();
  const betaModal = useDisclosure({ defaultIsOpen: auth.beta === null });

  const onReplyClicked = async (answer) => {
    try {
      let user = await _put(`/api/v1/profile/becomeBeta`, {
        beta: answer,
      });
      setAuth(user);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {auth.sub !== "anonymous" && auth.confirmed && auth.account_status === "CONFIRMED" && (
        <PromptModal
          title="Fonctionnalités avancées  - expérimentales"
          isOpen={betaModal.isOpen}
          onClose={betaModal.onClose}
          onOk={() => {
            onReplyClicked(betaVersion());
            betaModal.onClose();
          }}
          onKo={() => {
            onReplyClicked("non");
            betaModal.onClose();
          }}
          bgOverlay="rgba(0, 0, 0, 0.28)"
        >
          <Text mb={1}>Souhaitez-vous activer les fonctionnalité expérimentales de la plateforme ?</Text>
          <Text>Cette activation vous donnera accès à :</Text>
          <BetaFeatures borderColor={"dgalt"} borderWidth={1} px={4} py={3} maxH="30vh" my={3} />
          <Text>Vous pouvez à tout moment (dés)activer les fonctionnalités expérimentales dans votre profile.</Text>
        </PromptModal>
      )}
    </>
  );
};

export default () => {
  let match = useRouteMatch();
  const inviteModal = useDisclosure();
  const { nextStep, prevStep, reset, activeStep, setStep } = useSteps({
    initialStep: stepByPath.indexOf(match.params.step),
  });
  const [stepState, setStepState] = useState();
  const { isloaded, dossier } = useDossier(match.params.id);
  const history = useHistory();
  const setWorkspaceTitle = useSetRecoilState(workspaceTitleAtom);

  useEffect(() => {
    const run = async () => {
      if (isloaded && dossier) {
        setWorkspaceTitle(dossier.nom);
      }
    };
    run();
  }, [dossier, history, isloaded, setWorkspaceTitle]);

  const onClickNextStep = async () => {
    setStepState("loading"); // type StateValue = "loading" | "error" | undefined
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStepState("error");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStepState();
    nextStep();
  };

  if (!isloaded)
    return (
      <Center>
        <Spinner />
      </Center>
    );

  if (!dossier) {
    history.push("/404");
  }

  // TODO not Authorize handler

  return (
    <Box w="100%" px={[1, 1, 6, 6]}>
      <AskBetaTest />
      <Container maxW="xl">
        <HStack mt={6}>
          <Heading as="h1" flexGrow="1">
            {dossier.nom}
            <Badge variant="draft" ml={5}>
              Brouillon
            </Badge>
            <Badge variant="solid" bg="grey.100" color="grey.500" textStyle="sm" px="15px" ml="10px">
              <Text as="i">
                {!dossier.saved ? "Non sauvegardé" : `Dernière sauvegarde ${prettyPrintDate(dossier.lastModified)}`}
              </Text>
            </Badge>
          </Heading>
          <HStack>
            <LivePeopleAvatar />
            {hasContextAccessTo(dossier, "dossier/page_parametres/gestion_acces") && (
              <>
                <Button size="md" onClick={inviteModal.onOpen} variant="secondary">
                  <AvatarPlus />
                  <Text as="span" ml={2}>
                    Partager
                  </Text>
                </Button>
                <InviteModal
                  title="Partager le dossier"
                  size="md"
                  isOpen={inviteModal.isOpen}
                  onClose={inviteModal.onClose}
                />
              </>
            )}
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
              <Heading fontSize="xl">Ce dossier est terminé.</Heading>
              <Button mt={6} size="sm" onClick={reset}>
                (Test) Remise à zero
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
