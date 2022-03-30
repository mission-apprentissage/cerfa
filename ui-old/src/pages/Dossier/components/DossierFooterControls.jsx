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
import useAuth from "../../../common/hooks/useAuth";

import { DownloadLine, SentPaperPlane, BallPenFill, InfoCircle } from "../../../theme/components/icons";

import { hasPageAccessTo, hasContextAccessTo } from "../../../common/utils/rolesUtils";

// import InfoTooltip from "../../../common/components/InfoTooltip";

import { useSetRecoilState, useRecoilValue } from "recoil";
import { dossierAtom } from "../../../common/hooks/useDossier/dossierAtom";

export default ({
  activeStep,
  steps,
  onClickPrevStep,
  onClickNextStep,
  finalizeModalDisclosure,
  eSignatureModalDisclosure,
  dossierComplete,
  employeurPrivePublic,
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
      window.location.reload();
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
            // details += `${fieldKeys[index]} > ${subFieldKeys[j]} > ${element.join(" ")}`;
          }
        }
      }
      toast({
        title: `Une erreur est survenue lors de la transmission${details}`,
        status: "error",
        duration: null,
        isClosable: true,
      });
    }
  }, [dossier._id, toast]);

  let unpublishClicked = useCallback(
    async (answer) => {
      try {
        await _put(`/api/v1/dossier/entity/${dossier._id}/unpublish`, {
          dossierId: dossier._id,
        });
        window.location.reload();
      } catch (e) {
        console.error(e);
      }
    },
    [dossier._id]
  );

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

  let onMethodSingatureClickd = useCallback(
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
      dossier.etat === "TRANSMIS" ||
      dossier.etat === "EN_ATTENTE_SIGNATURES"
    )
      return "Télécharger le contrat non signé";
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

  const isBetaTester = auth.beta && auth.beta !== "non";

  return (
    <>
      {dossier.etat === "BROUILLON" && (
        <Flex width="100%" justify="flex-start" mt={8} mb={10}>
          {activeStep <= steps.length - 1 && dossier.draft && (
            <Button mr={8} size="md" variant="secondary" onClick={onClickPrevStep} isDisabled={activeStep === 0}>
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
                finalizeModalDisclosure.onOpen();
              }}
              variant="primary"
              isDisabled={!dossierComplete || employeurPrivePublic?.contents?.value === "Employeur privé"}
              bg="greenmedium.600"
              _hover={{ bg: "greenmedium.500" }}
            >
              Finaliser et Télécharger le dossier
            </Button>
          )}
        </Flex>
      )}
      {activeStep === steps.length - 1 &&
        !dossier.draft &&
        dossier.etat === "DOSSIER_FINALISE_EN_ATTENTE_ACTION" &&
        !dossier.mode && (
          <Flex width="100%" justify="flex-start" mt={16} flexDirection="column">
            <HStack>
              <Text>Choisissez une méthode de signature:</Text>
            </HStack>
            <HStack spacing={16} justifyContent="center" mt={10}>
              {isBetaTester && hasPageAccessTo(auth, "signature_beta") && (
                <Flex flexDirection="column" borderWidth="1px" borderColor="bluefrance" p={10} w="55%" h="50vh">
                  <Box flexGrow="1">
                    <Flex flexDirection="column" alignItems="flex-start" p={0}>
                      <Heading as="h4" fontSize="1.5rem" mb={4}>
                        Signature en ligne
                      </Heading>
                      <Heading as="h5" fontSize="1rem" mb={4}>
                        Processus automatique sécurisé & gratuit
                      </Heading>
                    </Flex>
                    <OrderedList>
                      <ListItem>Ajoutez les signataires</ListItem>
                      <ListItem>Ils seront invités par courriel à signer via Yousign</ListItem>
                      <ListItem>Suivez l'évolution en temps réel</ListItem>
                      <ListItem>Transmission automatique au service en charge de l'instruction du dossier</ListItem>
                    </OrderedList>
                    <Text color="bluefrance" py={5}>
                      <InfoCircle mt={"-0.2rem"} w="20px" h="20px" /> Vous serez avertis lorsque cette fonctionnalité
                      sera disponible.
                    </Text>
                  </Box>
                  <Center h="25%">
                    {auth && hasPageAccessTo(auth) && (
                      <Button
                        onClick={() => {
                          onMethodSingatureClickd("NOUVEAU_CONTRAT_SIGNATURE_ELECTRONIQUE");
                        }}
                        size={"md"}
                        variant={"primary"}
                      >
                        <BallPenFill w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} mr="0.5rem" />
                        Signatures électroniques
                      </Button>
                    )}
                    {auth && !hasPageAccessTo(auth) && (
                      <Button
                        size={"md"}
                        color="grey.600"
                        variant={"secondary"}
                        borderColor="grey.600"
                        isDisabled={true}
                      >
                        Bientôt disponible !
                      </Button>
                    )}
                  </Center>
                </Flex>
              )}

              <Flex flexDirection="column" bg="galt" p={10} w="45%" h="50vh">
                <Box flexGrow="1">
                  <Flex flexDirection="column" alignItems="flex-start" p={0}>
                    <Heading as="h4" fontSize="1.5rem" mb={4}>
                      Signature papier
                    </Heading>
                    <Heading as="h5" fontSize="1rem" mb={4}>
                      Processus manuel
                    </Heading>
                  </Flex>
                  <OrderedList>
                    <ListItem>Téléchargez le document complété</ListItem>
                    <ListItem>Imprimez le contrat</ListItem>
                    <ListItem>Recueillez les différentes signatures</ListItem>
                    <ListItem>Transmission automatique à votre DEETS</ListItem>
                  </OrderedList>
                </Box>
                <Center h="25%">
                  <Button
                    onClick={() => {
                      onMethodSingatureClickd("NOUVEAU_CONTRAT_SIGNATURE_PAPIER");
                    }}
                    size={"md"}
                    variant={"secondary"}
                    bg="galt"
                  >
                    <BallPenFill w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} mr="0.5rem" />
                    Signatures papier
                  </Button>
                </Center>
              </Flex>
            </HStack>
          </Flex>
        )}
      {activeStep === steps.length - 1 && !dossier.draft && dossier.mode && (
        <Flex width="100%" justify="flex-start" mt={8} mb={10}>
          <Center w="full">
            {(dossier.etat === "DOSSIER_TERMINE_SANS_SIGNATURE" ||
              dossier.etat === "EN_ATTENTE_DECLENCHEMENT_SIGNATURES" ||
              dossier.etat === "EN_ATTENTE_SIGNATURES" ||
              dossier.etat === "SIGNATURES_EN_COURS" ||
              dossier.etat === "TRANSMIS" ||
              dossier.etat === "DOSSIER_TERMINE_AVEC_SIGNATURE") && (
              <Button
                as={Link}
                href={`/api/v1/cerfa/pdf/${dossier.cerfaId}/?dossierId=${dossier._id}`}
                {...buttonDownloadStyleProps}
                bg={"greenmedium.500"}
                _hover={{ bg: "greenmedium.600" }}
                color="white"
                isDisabled={!dossierComplete || employeurPrivePublic?.contents?.value === "Employeur privé"}
              >
                <DownloadLine w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} mr="0.5rem" />
                {buttonTextProp}
              </Button>
            )}
            {isBetaTester &&
              hasPageAccessTo(auth, "signature_beta") &&
              dossier.mode === "NOUVEAU_CONTRAT_SIGNATURE_ELECTRONIQUE" &&
              dossier.etat === "EN_ATTENTE_DECLENCHEMENT_SIGNATURES" && (
                <Button
                  size="md"
                  onClick={() => {
                    eSignatureModalDisclosure.onOpen();
                  }}
                  variant="primary"
                  ml={12}
                  bg="pinksoft.500"
                  _hover={{ bg: "pinksoft.500" }}
                  px={8}
                  mt={16}
                  isDisabled={!dossier.signataires.complete}
                >
                  <BallPenFill boxSize="5" mr={"0.5rem"} />
                  Démarrer la procédure de signature électronique
                </Button>
              )}

            {hasContextAccessTo(dossier, "send_agecap") &&
              (dossier.etat === "DOSSIER_TERMINE_SANS_SIGNATURE" ||
                dossier.etat === "DOSSIER_TERMINE_AVEC_SIGNATURE") && (
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