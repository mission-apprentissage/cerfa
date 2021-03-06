import React, { useCallback, useMemo } from "react";
import {
  Flex,
  Center,
  Button,
  Link,
  Text,
  HStack,
  Heading,
  OrderedList,
  ListItem,
  useToast,
  Box,
} from "@chakra-ui/react";

import { _post, _put } from "../../../common/httpClient";
import useAuth from "../../../hooks/useAuth";
import { DownloadLine, SentPaperPlane, BallPenFill, ExternalLinkLine } from "../../../theme/components/icons";
import { hasPageAccessTo, hasContextAccessTo } from "../../../common/utils/rolesUtils";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { dossierAtom } from "../atoms";

const DossierFooterControls = ({
  activeStep,
  steps,
  onClickPrevStep,
  onClickNextStep,
  finalizeModalDisclosure,
  eSignatureModalDisclosure,
  dossierComplete,
  isEmployeurPrive,
  signaturesPdfLoaded,
}) => {
  let [auth] = useAuth();
  const toast = useToast();
  const setDossier = useSetRecoilState(dossierAtom);
  const dossier = useRecoilValue(dossierAtom);

  let onSendToAgecap = useCallback(async () => {
    try {
      await _post(`/api/v1/agecap/`, {
        dossierId: dossier._id,
      });
      // On redirige vers le suivi du dossier une fois qu'il est télétransmis
      window.location.replace(window.location.pathname.replace(/\/[^/]*$/, "/suivi"));
    } catch (error) {
      console.log({ error });
      let details = "";
      if (error.messages.details?.reason?.objectFieldErrors) {
        details = " : ";
        const fieldErrors = error.messages.details?.reason?.objectFieldErrors;
        const fieldKeys = Object.keys(fieldErrors);
        for (let index = 0; index < fieldKeys.length; index++) {
          const field = fieldErrors[fieldKeys[index]];
          const subFieldKeys = Object.keys(field);
          for (let j = 0; j < subFieldKeys.length; j++) {
            const element = field[subFieldKeys[j]];
            details += `${element.join(" ")}`;
          }
        }
      } else if (error.messages.details?.reason?.globalErrors) {
        details = error.messages.details?.reason?.globalErrors[0];
      }
      toast({
        title: `Une erreur est survenue lors de la transmission${details}`,
        status: "error",
        duration: null,
        isClosable: true,
      });
    }
  }, [dossier._id, toast]);

  let unpublishClicked = useCallback(async () => {
    try {
      await _put(`/api/v1/dossier/entity/${dossier._id}/unpublish`, {
        dossierId: dossier._id,
      });
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  }, [dossier._id]);

  const buttonDownloadStyleProps = useMemo(
    () => ({
      isExternal: true,
      size: "md",
      variant: "primary",

      borderRadius: 0,
      px: 8,
      mt: 16,
    }),
    []
  );

  let onMethodSignatureClicked = useCallback(
    async (mode) => {
      try {
        const upDossier = await _put(`/api/v1/dossier/entity/${dossier._id}/mode`, {
          dossierId: dossier._id,
          mode,
        });
        setDossier(upDossier);
      } catch (e) {
        console.error(e);
      }
    },
    [dossier._id, setDossier]
  );

  const buttonTextProp = useMemo(() => {
    if (
      dossier.etat === "DOSSIER_FINALISE_EN_ATTENTE_ACTION" ||
      dossier.etat === "EN_ATTENTE_DECLENCHEMENT_SIGNATURES" ||
      dossier.etat === "DOSSIER_TERMINE_SANS_SIGNATURE" ||
      dossier.etat === "EN_ATTENTE_SIGNATURES"
    )
      return "Télécharger le contrat non signé";
    if (dossier.etat === "SIGNATURES_REFUS") return "Télécharger le contrat";
    if (dossier.etat === "SIGNATURES_EN_COURS") return "Télécharger le contrat en cours de signature";
    if (
      dossier.etat === "DOSSIER_TERMINE_AVEC_SIGNATURE" ||
      dossier.etat === "TRANSMIS" ||
      dossier.etat === "EN_COURS_INSTRUCTION" ||
      dossier.etat === "INCOMPLET" ||
      dossier.etat === "DEPOSE" ||
      dossier.etat === "REFUSE" ||
      dossier.etat === "ENGAGE" ||
      dossier.etat === "ANNULE" ||
      dossier.etat === "RUTPURE" ||
      dossier.etat === "SOLDE"
    )
      return "Télécharger le contrat signé";
  }, [dossier.etat]);

  return (
    <>
      {dossier.etat === "BROUILLON" && (
        <Flex width="100%" justify="flex-start" mt={8} mb={10}>
          {activeStep <= steps.length - 1 && dossier.draft && (
            <Button mr={8} size="md" variant="secondary" onClick={onClickPrevStep} isDisabled={activeStep === 0}>
              Revenir
            </Button>
          )}
          {activeStep < steps.length - 2 && (
            <Button size="md" onClick={onClickNextStep} variant="primary" isDisabled={isEmployeurPrive}>
              Passer à l&apos;étape suivante
            </Button>
          )}

          {activeStep === 2 && dossier.draft && (
            <>
              {hasContextAccessTo(dossier, "dossier/voir_contrat_pdf/telecharger") && (
                <Button
                  mr={8}
                  variant="secondary"
                  size="md"
                  as={Link}
                  target={"_blank"}
                  href={`/api/v1/cerfa/pdf/${dossier.cerfaId}/?dossierId=${dossier._id}`}
                >
                  <DownloadLine w={"0.75rem"} h={"0.75rem"} mr={2} /> Télécharger
                </Button>
              )}
              <Button
                size="md"
                onClick={() => {
                  finalizeModalDisclosure.onOpen();
                }}
                variant="primary"
                isDisabled={!dossierComplete || isEmployeurPrive}
              >
                Choisir le mode de signature
              </Button>
            </>
          )}
        </Flex>
      )}
      {activeStep === 2 && !dossier.draft && dossier.etat === "DOSSIER_FINALISE_EN_ATTENTE_ACTION" && !dossier.mode && (
        <Flex width="100%" justify="flex-start" mt={16} flexDirection="column">
          <HStack>
            <Text>Choisissez une méthode de signature:</Text>
          </HStack>
          <HStack spacing={16} justifyContent="center" mt={10}>
            {
              //hasContextAccessTo(dossier, "dossier/page_signatures/signature_electronique") ||
              hasPageAccessTo(auth, "dossier/page_signatures/signature_electronique") && (
                <Flex flexDirection="column" borderWidth="1px" borderColor="bluefrance" p={10} w="55%" h="50vh">
                  <Box flexGrow="1">
                    <Flex flexDirection="column" alignItems="flex-start" p={0}>
                      <Heading as="h4" fontSize="1.5rem" mb={4}>
                        Signature en ligne
                      </Heading>
                      <Heading as="h5" fontSize="1rem" mb={4}>
                        Processus dématérialisé
                      </Heading>
                    </Flex>
                    <OrderedList>
                      <ListItem>
                        Vous ajoutez les coordonnées des signataires en cliquant sur &laquo;&nbsp;signature
                        électronique&nbsp;&raquo;
                      </ListItem>
                      <ListItem>Chaque signataire reçoit une notification l&apos;invitant à signer le contrat</ListItem>
                      <ListItem>
                        Lorsque toutes les signatures sont réunies, le contrat est automatiquement télétransmis
                      </ListItem>
                    </OrderedList>
                    <br />
                    <Text>
                      La signature électronique est opérée par notre partenaire YouSign. <br />
                      <Link
                        href={"https://yousign.com/fr-fr/signature-electronique"}
                        textDecoration={"underline"}
                        isExternal
                      >
                        Plus d&apos;informations&nbsp;
                        <ExternalLinkLine w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} />
                      </Link>
                    </Text>
                  </Box>
                  <Center h="25%">
                    <Button
                      onClick={() => {
                        onMethodSignatureClicked("NOUVEAU_CONTRAT_SIGNATURE_ELECTRONIQUE");
                      }}
                      size={"md"}
                      variant={"primary"}
                    >
                      <BallPenFill w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} mr="0.5rem" />
                      Signature électronique
                    </Button>
                  </Center>
                </Flex>
              )
            }
            {hasContextAccessTo(dossier, "dossier/page_signatures/signature_papier") && (
              <Flex flexDirection="column" bg="galt" p={10} w="45%" h="50vh">
                <Box flexGrow="1">
                  <Flex flexDirection="column" alignItems="flex-start" p={0}>
                    <Heading as="h4" fontSize="1.5rem" mb={4}>
                      Signature papier
                    </Heading>
                    <Heading as="h5" fontSize="1rem" mb={4}>
                      Processus classique
                    </Heading>
                  </Flex>
                  <OrderedList>
                    <ListItem>
                      Téléchargez et imprimez le contrat finalisé en cliquant sur &laquo;&nbsp;signature
                      papier&nbsp;&raquo;
                    </ListItem>
                    <ListItem>Recueillez les différentes signatures manuscrites par vos propres moyens</ListItem>
                    <ListItem>
                      Lorsque toutes les signatures sont réunies, revenez sur la plateforme pour télétransmettre le
                      contrat
                    </ListItem>
                  </OrderedList>
                  <br />
                  <Text>Il n&apos;est plus nécessaire de joindre le contrat signé en pièce jointe du dossier.</Text>
                </Box>
                <Center h="25%">
                  <Button
                    onClick={() => {
                      onMethodSignatureClicked("NOUVEAU_CONTRAT_SIGNATURE_PAPIER");
                    }}
                    size={"md"}
                    variant={"secondary"}
                    bg="galt"
                  >
                    <BallPenFill w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} mr="0.5rem" />
                    Signature papier
                  </Button>
                </Center>
              </Flex>
            )}
          </HStack>
        </Flex>
      )}
      {/*TODO factoriser ce bouton qui est dupliqué juste en dessous => quickwin*/}
      {activeStep === 3 &&
        (dossier.etat === "TRANSMIS" ||
          dossier.etat === "EN_COURS_INSTRUCTION" ||
          dossier.etat === "REFUSE" ||
          dossier.etat === "DEPOSE") && (
          <Flex width="100%" justify="flex-start" mt={8} mb={10}>
            <Center w="full">
              <Button
                as={Link}
                href={`/api/v1/cerfa/pdf/${dossier.cerfaId}/?dossierId=${dossier._id}`}
                {...buttonDownloadStyleProps}
                variant="secondary"
                isDisabled={!dossierComplete || isEmployeurPrive}
              >
                <DownloadLine w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} mr="0.5rem" />
                {buttonTextProp}
              </Button>
            </Center>
          </Flex>
        )}
      {activeStep === 2 && !dossier.draft && dossier.mode && (
        <Flex width="100%" justify="flex-start" mt={8} mb={10}>
          <Center w="full">
            {(dossier.etat === "DOSSIER_TERMINE_SANS_SIGNATURE" ||
              dossier.etat === "EN_ATTENTE_DECLENCHEMENT_SIGNATURES" ||
              dossier.etat === "EN_ATTENTE_SIGNATURES" ||
              dossier.etat === "SIGNATURES_EN_COURS" ||
              dossier.etat === "SIGNATURES_REFUS") && (
              <Button
                as={Link}
                href={`/api/v1/cerfa/pdf/${dossier.cerfaId}/?dossierId=${dossier._id}`}
                {...buttonDownloadStyleProps}
                variant="secondary"
                isDisabled={!dossierComplete || isEmployeurPrive}
              >
                <DownloadLine w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} mr="0.5rem" />
                {buttonTextProp}
              </Button>
            )}
            {dossier.mode === "NOUVEAU_CONTRAT_SIGNATURE_ELECTRONIQUE" &&
              dossier.etat === "EN_ATTENTE_DECLENCHEMENT_SIGNATURES" && (
                <Button
                  size="md"
                  onClick={() => {
                    eSignatureModalDisclosure.onOpen();
                  }}
                  variant="primary"
                  ml={12}
                  px={8}
                  mt={16}
                  isDisabled={!dossier.signataires.complete}
                >
                  <BallPenFill boxSize="5" mr={"0.5rem"} />
                  Démarrer la procédure de signature électronique
                </Button>
              )}

            {hasContextAccessTo(dossier, "dossier/publication") && dossier.etat === "DOSSIER_TERMINE_SANS_SIGNATURE" && (
              <Button
                size="md"
                onClick={onSendToAgecap}
                variant="primary"
                ml={12}
                isDisabled={!dossierComplete || isEmployeurPrive || !signaturesPdfLoaded?.contents}
                bg="orangemedium.500"
                _hover={{ bg: "orangemedium.600" }}
                px={8}
                mt={16}
              >
                <SentPaperPlane boxSize="4" mr="0.5rem" />
                Télétransmettre
              </Button>
            )}

            {auth && hasPageAccessTo(auth, "admin/dossier_depublier") && (
              <Button
                size="md"
                onClick={unpublishClicked}
                variant="primary"
                ml={12}
                bg="redmarianne"
                _hover={{ bg: "redmarianne" }}
                px={8}
                mt={16}
              >
                Dépublier
              </Button>
            )}
          </Center>
        </Flex>
      )}
    </>
  );
};

export default DossierFooterControls;
