import React, { useCallback } from "react";
import { Flex, Center, Button, Link } from "@chakra-ui/react";

import { _post } from "../../../common/httpClient";
import useAuth from "../../../common/hooks/useAuth";

import { DownloadLine, SentPaperPlane, BallPenFill } from "../../../theme/components/icons";

import { hasPageAccessTo } from "../../../common/utils/rolesUtils";

export default ({
  activeStep,
  steps,
  dossier,
  onClickPrevStep,
  onClickNextStep,
  finalizeModalDisclosure,
  eSignatureModalDisclosure,
  dossierComplete,
  employeurPrivePublic,
  signaturesPdfLoaded,
}) => {
  let [auth] = useAuth();

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

  return (
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
      {activeStep === steps.length - 1 && !dossier.draft && (
        <Center w="full">
          {(dossier.etat === "DOSSIER_FINALISE" ||
            dossier.etat === "DOSSIER_TERMINE_SANS_SIGNATURE" ||
            dossier.etat === "EN_ATTENTE_SIGNATURES" ||
            dossier.etat === "DOSSIER_TERMINE") && ( // TODO MIGRATION SCRIPT
            <Button
              as={Link}
              href={`/api/v1/cerfa/pdf/${dossier.cerfaId}/?dossierId=${dossier._id}`}
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
              px={8}
            >
              <DownloadLine w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} mr="0.5rem" />
              Télécharger le contrat non signé
            </Button>
          )}
          {dossier.etat === "SIGNATURES_EN_COURS" && (
            <Button
              as={Link}
              href={`/api/v1/cerfa/pdf/${dossier.cerfaId}/?dossierId=${dossier._id}`}
              isExternal
              size="md"
              variant="primary"
              bg="greenmedium.500"
              _hover={{ bg: "greenmedium.600" }}
              color="white"
              isDisabled={!dossierComplete || employeurPrivePublic?.contents?.value === "Employeur privé"}
              borderRadius={0}
              px={8}
              mt={16}
            >
              <DownloadLine w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} mr="0.5rem" />
              Télécharger le contrat en cours de signature
            </Button>
          )}
          {(dossier.etat === "DOSSIER_TERMINE_AVEC_SIGNATURE" ||
            dossier.etat === "TRANSMIS" ||
            dossier.etat === "EN_COURS_INSTRUCTION" ||
            dossier.etat === "INCOMPLET" ||
            dossier.etat === "DEPOSE" ||
            dossier.etat === "REFUSE" ||
            dossier.etat === "ENGAGE" ||
            dossier.etat === "ANNULE" ||
            dossier.etat === "RUTPURE" ||
            dossier.etat === "SOLDE") && (
            <Button
              as={Link}
              href={`/api/v1/cerfa/pdf/${dossier.cerfaId}/?dossierId=${dossier._id}`}
              isExternal
              size="md"
              variant="primary"
              bg="greenmedium.500"
              _hover={{ bg: "greenmedium.600" }}
              color="white"
              isDisabled={!dossierComplete || employeurPrivePublic?.contents?.value === "Employeur privé"}
              borderRadius={0}
              px={8}
              mt={16}
            >
              <DownloadLine w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} mr="0.5rem" />
              Télécharger le contrat signé
            </Button>
          )}
          {signaturesPdfLoaded?.contents &&
            auth.beta &&
            auth.beta !== "non" &&
            hasPageAccessTo(auth, "signature_beta") &&
            dossier.etat === "DOSSIER_FINALISE" && (
              <Button
                size="md"
                onClick={() => {
                  eSignatureModalDisclosure.onOpen();
                }}
                variant="primary"
                ml={12}
                bg="pinksoft.500"
                _hover={{ bg: "pinksoft.500" }}
              >
                <BallPenFill boxSize="5" mr={"0.5rem"} />
                Démarrer la procédure de signature électronique
              </Button>
            )}
          {hasPageAccessTo(auth, "send_agecap") &&
            (dossier.etat === "DOSSIER_TERMINE_SANS_SIGNATURE" ||
              dossier.etat === "DOSSIER_TERMINE_AVEC_SIGNATURE" ||
              dossier.etat === "DOSSIER_FINALISE" ||
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
              >
                <SentPaperPlane boxSize="4" mr="0.5rem" />
                Télétransmettre vers Agecap
              </Button>
            )}
        </Center>
      )}
    </Flex>
  );
};
