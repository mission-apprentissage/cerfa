import React, { useState, useEffect, useCallback } from "react";
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
  Link,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps-rework-mna";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSetRecoilState, useRecoilValueLoadable, useRecoilValue } from "recoil";
import { hasContextAccessTo, hasPageAccessTo } from "../../common/utils/rolesUtils";
import { _put, _post } from "../../common/httpClient";
import useAuth from "../../common/hooks/useAuth";
import PromptModal from "../../common/components/Modals/PromptModal";
// import { betaVersion, BetaFeatures } from "../../common/components/BetaFeatures";
import { StatusBadge } from "../../common/components/StatusBadge";
import AcknowledgeModal from "../../common/components/Modals/AcknowledgeModal";

import Cerfa from "./Cerfa/Cerfa";
import PiecesJustificatives from "./PiecesJustificatives/PiecesJustificatives";
import Signatures from "./Signatures/Signatures";
import { InviteModal } from "./components/InviteModal";
import LivePeopleAvatar from "./components/LivePeopleAvatar";

import { useDossier } from "../../common/hooks/useDossier/useDossier";
import { useDocuments } from "../../common/hooks/useDossier/useDocuments";
import { useSignatures } from "../../common/hooks/useDossier/useSignatures";
import { workspaceTitleAtom } from "../../common/hooks/workspaceAtoms";
import { cerfaAtom } from "../../common/hooks/useCerfa/cerfaAtom";
import {
  cerfaEmployeurAdresseDepartementAtom,
  cerfaEmployeurAdresseRegionAtom,
} from "../../common/hooks/useCerfa/parts/useCerfaEmployeurAtoms";
import { AvatarPlus, StepWip, TickBubble, DownloadLine, SentPaperPlane } from "../../theme/components/icons";

import { signaturesPdfLoadedAtom } from "../../common/hooks/useDossier/signaturesAtoms";
import { cerfaPartFormationCompletionAtom } from "../../common/hooks/useCerfa/parts/useCerfaFormationAtoms";
import {
  cerfaPartEmployeurCompletionAtom,
  cerfaEmployeurPrivePublicAtom,
} from "../../common/hooks/useCerfa/parts/useCerfaEmployeurAtoms";
import { cerfaPartMaitresCompletionAtom } from "../../common/hooks/useCerfa/parts/useCerfaMaitresAtoms";
import { cerfaPartApprentiCompletionAtom } from "../../common/hooks/useCerfa/parts/useCerfaApprentiAtoms";
import { cerfaPartContratCompletionAtom } from "../../common/hooks/useCerfa/parts/useCerfaContratAtoms";

const steps = [
  { label: "Cerfa", description: "Renseignez les informations" },
  { label: "Pièces justificatives", description: "Ajoutez les pièces justificatives" },
  { label: "Signatures et envoi", description: "Signatures" },
];

const stepByPath = ["cerfa", "documents", "signatures"];

// const AskBetaTest = () => {
//   let [auth, setAuth] = useAuth();
//   const betaModal = useDisclosure({ defaultIsOpen: auth.beta === null });

//   const onReplyClicked = async (answer) => {
//     try {
//       let user = await _put(`/api/v1/profile/becomeBeta`, {
//         beta: answer,
//       });
//       setAuth(user);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   return (
//     <>
//       {auth.sub !== "anonymous" && auth.confirmed && auth.account_status === "CONFIRMED" && (
//         <PromptModal
//           title="Fonctionnalités avancées  - expérimentales"
//           isOpen={betaModal.isOpen}
//           onClose={betaModal.onClose}
//           onOk={() => {
//             onReplyClicked(betaVersion());
//             betaModal.onClose();
//           }}
//           onKo={() => {
//             onReplyClicked("non");
//             betaModal.onClose();
//           }}
//           bgOverlay="rgba(0, 0, 0, 0.28)"
//         >
//           <Text mb={1}>
//             Souhaitez-vous participer à l'amélioration du service, en testant de nouvelles fonctionnalités ?
//           </Text>
//           <Text>Cette activation vous donnera accès à :</Text>
//           <BetaFeatures borderColor={"dgalt"} borderWidth={1} px={4} py={3} maxH="30vh" my={3} />
//           <Text>Vous pouvez à tout moment (dés)activer depuis votre profil les fonctionnalités en test</Text>
//         </PromptModal>
//       )}
//     </>
//   );
// };

const EndModal = ({ dossier, ...modal }) => {
  const cerfa = useRecoilValue(cerfaAtom);
  const employeurAdresseDepartement = useRecoilValue(cerfaEmployeurAdresseDepartementAtom);
  const employeurAdresseRegion = useRecoilValue(cerfaEmployeurAdresseRegionAtom);

  const [ddets, setDdets] = useState(null);

  let onReplyClicked = useCallback(
    async (answer) => {
      try {
        await _put(`/api/v1/dossier/entity/${dossier._id}/publish`, {
          dossierId: dossier._id,
        });
        window.location.replace(window.location.pathname.replace(/\/[^/]*$/, "/signatures"));
      } catch (e) {
        console.error(e);
      }
    },
    [dossier._id]
  );

  useEffect(() => {
    const run = async () => {
      const code_region = cerfa.employeur.adresse.region.value || employeurAdresseRegion.value;
      const code_dpt = cerfa.employeur.adresse.departement.value || employeurAdresseDepartement.value;

      if (code_region && code_dpt) {
        const response = await _post(`/api/v1/dreetsddets/`, {
          code_region,
          code_dpt,
          dossierId: dossier._id,
        });
        setDdets(response.ddets);
      }
    };
    run();
  }, [
    cerfa.employeur.adresse.departement.value,
    cerfa.employeur.adresse.region.value,
    dossier._id,
    employeurAdresseDepartement,
    employeurAdresseRegion,
  ]);

  return (
    <>
      <PromptModal
        title="Souhaitez-vous terminer ce dossier ?"
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        onOk={() => {
          onReplyClicked();
          modal.onClose();
        }}
        onKo={() => {
          onReplyClicked("non");
          modal.onClose();
        }}
        bgOverlay="rgba(0, 0, 0, 0.28)"
        okText={"Oui, passer au téléchargement"}
        koText={"Non, continuer l'édition"}
      >
        <Text mb={1}>
          Cette opération clôturera l'édition de ce dossier. Vous pourrez néanmoins le consulter à tout moment.
        </Text>
        <Text mb={1}>
          <br />
          Vous pourrez par la suite, télécharger le contrat généré au format pdf.
        </Text>
        {ddets && (
          <Box mt={8}>
            <Text fontWeight="bold" mb={5}>
              DDETS destinataire du contrat
            </Text>
            <UnorderedList ml="30px !important">
              <ListItem>{ddets.DDETS}</ListItem>
              <ListItem>
                Email de dépôt: <strong>{ddets["Mail_depot"]}</strong>
              </ListItem>
              <ListItem>Téléphone: {ddets["Telephone"]}</ListItem>
              <ListItem>
                Informations complémentaires:
                <br /> {ddets["Informations_complementaires"]}
              </ListItem>
            </UnorderedList>
          </Box>
        )}
      </PromptModal>
    </>
  );
};

export default () => {
  let match = useRouteMatch();
  let [auth] = useAuth();
  const history = useHistory();
  const inviteModal = useDisclosure();
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
  const cerfa = useRecoilValue(cerfaAtom);
  const { documentsCompletion, setDocumentsCompletion } = useDocuments();
  const [documentsComplete, setDocumentsComplete] = useState(false);
  const { signaturesCompletion, sca, setSignaturesCompletion } = useSignatures();
  const [signaturesComplete, setSignaturesComplete] = useState(false);

  const setWorkspaceTitle = useSetRecoilState(workspaceTitleAtom);
  const employeurPrivePublic = useRecoilValueLoadable(cerfaEmployeurPrivePublicAtom);
  const [hasSeenPrivateSectorModal, setHasSeenPrivateSectorModal] = useState(false);
  const isPrivateSectorAckModal = useDisclosure({ defaultIsOpen: true });
  const endModal = useDisclosure();

  const formationCompletion = useRecoilValueLoadable(cerfaPartFormationCompletionAtom);
  const employeurCompletionAtom = useRecoilValueLoadable(cerfaPartEmployeurCompletionAtom);
  const maitresCompletionAtom = useRecoilValueLoadable(cerfaPartMaitresCompletionAtom);
  const apprentiCompletionAtom = useRecoilValueLoadable(cerfaPartApprentiCompletionAtom);
  const contratCompletionAtom = useRecoilValueLoadable(cerfaPartContratCompletionAtom);

  const signaturesPdfLoaded = useRecoilValueLoadable(signaturesPdfLoadedAtom);

  const cerfaPercentageCompletion =
    (employeurCompletionAtom?.contents +
      apprentiCompletionAtom?.contents +
      maitresCompletionAtom?.contents +
      contratCompletionAtom?.contents +
      formationCompletion?.contents) /
    5;
  const cerfaComplete =
    employeurCompletionAtom?.contents === 100 &&
    apprentiCompletionAtom?.contents === 100 &&
    maitresCompletionAtom?.contents === 100 &&
    contratCompletionAtom?.contents === 100 &&
    formationCompletion?.contents === 100;
  const dossierComplete = cerfaComplete && documentsComplete && signaturesComplete;

  useEffect(() => {
    const run = async () => {
      if (isloaded && dossier) {
        setWorkspaceTitle(dossier.nom);
      }

      if (documentsCompletion === null && cerfa && dossier) {
        setDocumentsCompletion(cerfa, dossier);
      }
      // if (signaturesCompletion === null && cerfa) {
      //   setSignaturesCompletion(cerfa);
      // }
      // console.log(signaturesCompletion, cerfa);
      if (cerfa) {
        setSignaturesCompletion(cerfa);
      }

      if (cerfa && documentsCompletion !== null && signaturesCompletion !== null) {
        const documentsCompleteTmp = documentsCompletion === 100;
        const signaturesCompleteTmp = sca === 100;

        setDocumentsComplete(documentsCompleteTmp);
        setSignaturesComplete(signaturesCompleteTmp);

        if (match.params.step === "cerfa") {
          if (cerfaPercentageCompletion > 0) {
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
    cerfa,
    cerfaComplete,
    cerfaPercentageCompletion,
    documentsComplete,
    documentsCompletion,
    dossier,
    history,
    isloaded,
    match.params.step,
    setDocumentsCompletion,
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
  }, [activeStep, cerfaComplete, history, match, nextStep, stepStateSteps23]);

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

  let onSendToAgecap = useCallback(async () => {
    try {
      const response = await _post(`/api/v1/agecap/`, {
        dossierId: dossier._id,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }, [dossier?._id]);

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
      {/* <AskBetaTest /> */}
      {endModal.isOpen && <EndModal {...endModal} dossier={dossier} />}
      <AcknowledgeModal
        title="Vous êtes employeur privé"
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
      >
        <Text>
          Ce service de dépôt en ligne est reservé aux employeurs publics pour le moment. <br />
          Vous ne pourrez pas continuer ce dossier. <br />
          <br />
          Veuillez consulter{" "}
          <Link href={"/"} color={"bluefrance"} textDecoration={"underline"} isExternal>
            la fiche pratique
          </Link>{" "}
          pour établir un contrat d'apprentissage en tant qu'employeur privé.
        </Text>
      </AcknowledgeModal>
      <Container maxW="xl">
        <HStack mt={6}>
          <Heading as="h1" flexGrow="1">
            {dossier.nom}
            <StatusBadge status={dossier.etat} ml={5} />
            <Badge variant="solid" bg="grey.100" color="grey.500" textStyle="sm" px="15px" ml="10px">
              <Text as="i">
                {/* {!dossier.saved ? "Non sauvegardé" : `Dernière sauvegarde ${prettyPrintDate(dossier.lastModified)}`} */}
                {!dossier.saved ? "Non sauvegardé" : `Sauvegarde automatique activée`}
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
                  {index === 2 && <Signatures dossierId={dossier._id} />}
                </Step>
              );
            })}
          </Steps>
          <Box opacity={activeStep === 0 ? 1 : 0} h={activeStep === 0 ? "auto" : 0}>
            {(step1Visited || activeStep === 0) && <Cerfa />}
          </Box>
          <Flex width="100%" justify="flex-start" mt={8} mb={10}>
            {activeStep <= steps.length - 1 && dossier.draft && (
              <Button mr={4} size="md" variant="secondary" onClick={onClickPrevStep} isDisabled={activeStep === 0}>
                Revenir
              </Button>
            )}

            {activeStep < steps.length - 1 && (
              <Button
                size="md"
                onClick={onClickNextStep}
                variant="primary"
                isDisabled={employeurPrivePublic?.contents?.value === "Employeur privé"}
              >
                Passer à l'étape suivante
              </Button>
            )}
            {activeStep === steps.length - 1 && dossier.draft && (
              <Button
                size="md"
                onClick={() => {
                  endModal.onOpen();
                }}
                variant="primary"
                isDisabled={
                  !dossierComplete ||
                  employeurPrivePublic?.contents?.value === "Employeur privé" ||
                  !signaturesPdfLoaded?.contents
                }
                bg="greenmedium.500"
                _hover={{ bg: "greenmedium.600" }}
              >
                Finaliser et Télécharger le dossier
              </Button>
            )}
            {activeStep === steps.length - 1 && !dossier.draft && (
              <Center w="full">
                <Button
                  as={Link}
                  href={`/api/v1/cerfa/pdf/${dossier.cerfaId}/?workspaceId=${auth.workspaceId}&dossierId=${dossier._id}`}
                  isExternal
                  size="md"
                  variant="primary"
                  bg="greenmedium.500"
                  _hover={{ bg: "greenmedium.600" }}
                  color="white"
                  isDisabled={
                    !dossierComplete ||
                    employeurPrivePublic?.contents?.value === "Employeur privé" ||
                    !signaturesPdfLoaded?.contents
                  }
                  borderRadius={0}
                >
                  <DownloadLine w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} mr="0.5rem" />
                  Télécharger le pdf
                </Button>
                {hasPageAccessTo(auth, "dossier/send_agecap") && dossier.etat === "DOSSIER_TERMINE" && (
                  <Button
                    size="md"
                    onClick={onSendToAgecap}
                    variant="primary"
                    ml={12}
                    isDisabled={
                      !dossierComplete ||
                      employeurPrivePublic?.contents?.value === "Employeur privé" ||
                      !signaturesPdfLoaded?.contents
                    }
                    bg="orangemedium.500"
                    _hover={{ bg: "orangemedium.600" }}
                  >
                    <SentPaperPlane boxSize="4" mr="0.5rem" />
                    Télétransmettre vers Agecap
                  </Button>
                )}
              </Center>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};
