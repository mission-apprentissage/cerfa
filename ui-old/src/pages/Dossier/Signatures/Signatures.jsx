import React from "react";
import { Box, Heading, Center, Button, Text, HStack, VStack } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import Tooltip from "../../../common/components/Tooltip";
import { dossierAtom } from "../../../common/hooks/useDossier/dossierAtom";

import { dossierCompletionStatus } from "../dossierCompletionAtoms";
import { valueSelector } from "../formEngine/atoms";
import { InputController } from "../formEngine/components/Input/InputController";
import { useSignatures } from "./hooks/useSignatures";
import { SignatairesForm } from "./components/SignatairesForm";
import { ContratPdf } from "./components/ContratPdf";
import { Signataires } from "./components/Signataires";

export default () => {
  const dossier = useRecoilValue(dossierAtom);
  const { onSubmitted } = useSignatures();

  const dateConclusion = useRecoilValue(valueSelector("contrat.dateConclusion"));
  const lieuSignatureContrat = useRecoilValue(valueSelector("contrat.lieuSignatureContrat"));

  const dossierStatus = useRecoilValue(dossierCompletionStatus);
  const cerfaComplete = dossierStatus?.cerfa?.complete;
  const documentsComplete = dossierStatus?.documents?.complete;
  const signatureComplete = 10 === 100;

  if (!cerfaComplete) {
    return (
      <Box mt={12} pt={2} minH="25vh">
        <Center>
          <Tooltip variant="alert">
            <Text>Le Cerfa doit être complété à 100% avant de commencer la procédure de finalisation du dossier.</Text>
          </Tooltip>
        </Center>
      </Box>
    );
  }

  if (!documentsComplete) {
    return (
      <Box mt={12} pt={2} minH="25vh">
        <Center>
          <Tooltip variant="alert">
            <Text>
              Les pièces justificatives doivent être complétées à 100% avant de commencer la procédure de finalisation
              du dossier.
            </Text>
          </Tooltip>
        </Center>
      </Box>
    );
  }

  if (!signatureComplete) {
    return (
      <Box mt={16} mb={16} minH="25vh">
        <Heading as="h3" fontSize="1.4rem">
          Merci de préciser le lieu et la date de signature du contrat:
        </Heading>
        <HStack spacing={8} mt={8} alignItems="baseline" h="150px">
          <VStack w="45%">
            <InputController name="contrat.lieuSignatureContrat" />
            <Text textStyle="sm">&nbsp;</Text>
          </VStack>
          <VStack>
            <InputController name="contrat.dateConclusion" />
            <Text textStyle="sm">&nbsp;</Text>
          </VStack>
        </HStack>
        <HStack w="full" alignItems="end" justifyContent="end" mt={8}>
          <Button
            size="md"
            onClick={async () => {
              if (dateConclusion !== "" && lieuSignatureContrat !== "") {
                return onSubmitted(lieuSignatureContrat, dateConclusion);
              }
              return false;
            }}
            variant="primary"
          >
            Enregistrer
          </Button>
        </HStack>
      </Box>
    );
  }

  if (
    !dossier.signatures &&
    (dossier.etat === "BROUILLON" ||
      // dossier.etat === "DOSSIER_FINALISE_EN_ATTENTE_ACTION" ||
      dossier.etat === "DOSSIER_TERMINE_SANS_SIGNATURE" ||
      dossier.etat === "TRANSMIS" ||
      dossier.etat === "EN_COURS_INSTRUCTION" ||
      dossier.etat === "INCOMPLET" ||
      dossier.etat === "DEPOSE" ||
      dossier.etat === "REFUSE" ||
      dossier.etat === "ENGAGE" ||
      dossier.etat === "ANNULE" ||
      dossier.etat === "RUTPURE" ||
      dossier.etat === "SOLDE")
  ) {
    return <ContratPdf />;
  }

  if (dossier.etat === "DOSSIER_FINALISE_EN_ATTENTE_ACTION") return <></>;

  if (dossier.etat === "EN_ATTENTE_DECLENCHEMENT_SIGNATURES")
    return (
      <Box mt="5rem">
        <SignatairesForm />
      </Box>
    );

  return (
    <Box mt="5rem">
      <Signataires />
    </Box>
  );
};
