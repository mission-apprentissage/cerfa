import React, { useCallback, useMemo } from "react";
import { Flex, Center, Button, Link, Text, HStack } from "@chakra-ui/react";

import { _post, _put } from "../../../common/httpClient";
import useAuth from "../../../common/hooks/useAuth";

import { DownloadLine, SentPaperPlane, BallPenFill } from "../../../theme/components/icons";

import { hasPageAccessTo } from "../../../common/utils/rolesUtils";

import InfoTooltip from "../../../common/components/InfoTooltip";

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
  const setDossier = useSetRecoilState(dossierAtom);
  const dossier = useRecoilValue(dossierAtom);

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
      dossier.etat === "DOSSIER_TERMINE_SANS_SIGNATURE" ||
      dossier.etat === "EN_ATTENTE_SIGNATURES" ||
      dossier.etat === "DOSSIER_TERMINE" // TODO MIGRATION SCRIPT
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
                finalizeModalDisclosure.onOpen();
              }}
              variant="primary"
              isDisabled={
                !dossierComplete ||
                employeurPrivePublic?.contents?.value === "Employeur privé" ||
                !signaturesPdfLoaded?.contents
              }
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
                <HStack>
                  <Button
                    onClick={() => {
                      onMethodSingatureClickd("NOUVEAU_CONTRAT_SIGNATURE_ELECTRONIQUE");
                    }}
                    size={"md"}
                    variant={"primary"}
                  >
                    <BallPenFill w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} mr="0.5rem" />
                    Signatures électronique
                  </Button>
                  <InfoTooltip
                    w="400px"
                    description={`<strong>Prise en charge rapide et simplifiée</strong>
                <ul style="margin-top: 0.5rem;">
          <li style="margin-bottom: 0.5rem;">- Ajoutez les signataires <br></li>
          <li style="margin-bottom: 0.5rem;">- Dès que tous les signataires auront signés,<br> le dossier sera envoyé automatiquement<br></li>
          </ul>
          <strong><i>La signature électronique est gratuite.</i></strong>
          `}
                  />
                </HStack>
              )}
              <HStack>
                <Button
                  onClick={() => {
                    onMethodSingatureClickd("NOUVEAU_CONTRAT_SIGNATURE_PAPIER");
                  }}
                  size={"md"}
                  variant={"primary"}
                >
                  <BallPenFill w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} mr="0.5rem" />
                  Signatures papier
                </Button>
                <InfoTooltip
                  w="400px"
                  description={`<strong>Prise en charge au fil de l'eau, les délais de traitement peuvent être long.</strong>
                <ul style="margin-top: 0.5rem;">
          <li style="margin-bottom: 0.5rem;">- Téléchargez et imprimez le contrat généré vide<br></li>
          <li style="margin-bottom: 0.5rem;">- Faites le signer par chacun des signataires<br></li>
          <li style="margin-bottom: 0.5rem;">- Envoyez le à la ddets en charge de votre dossier<br></li>
          </ul>
          <strong><i>Cette méthode vous fera partiellement sortir de la plateforme</i></strong>
          `}
                />
              </HStack>
            </HStack>
          </Flex>
        )}
      {activeStep === steps.length - 1 && !dossier.draft && dossier.mode && (
        <Flex width="100%" justify="flex-start" mt={8} mb={10}>
          <Center w="full">
            {(dossier.etat === "DOSSIER_TERMINE_SANS_SIGNATURE" ||
              dossier.etat === "DOSSIER_TERMINE" ||
              dossier.etat === "EN_ATTENTE_SIGNATURES" ||
              dossier.etat === "SIGNATURES_EN_COURS" ||
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
                >
                  <BallPenFill boxSize="5" mr={"0.5rem"} />
                  Démarrer la procédure de signature électronique
                </Button>
              )}
            {hasPageAccessTo(auth, "send_agecap") &&
              (dossier.etat === "DOSSIER_TERMINE_SANS_SIGNATURE" ||
                dossier.etat === "DOSSIER_TERMINE_AVEC_SIGNATURE" ||
                dossier.etat === "DOSSIER_TERMINE") && ( // TODO MIGRATION SCRIPT
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
                  Télétransmettre vers Agecap
                </Button>
              )}
          </Center>
        </Flex>
      )}
    </>
  );
};
