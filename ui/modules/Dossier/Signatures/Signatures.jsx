import React, { useState } from "react";
import { Box, Heading, Center, Button, Text, HStack, VStack } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import Tooltip from "../../../components/Tooltip/Tooltip";
import { dossierAtom } from "../atoms";

import { dossierCompletionStatus } from "../atoms";
import { fieldSelector, valuesSelector } from "../formEngine/atoms";
import { useSignatures } from "./hooks/useSignatures";
import { SignatairesForm } from "./components/SignatairesForm";
import { ContratPdf } from "./components/ContratPdf";
import { Signataires } from "./components/Signataires";
import { Input } from "../formEngine/components/Input/Input";
import { useCerfaController } from "../formEngine/CerfaControllerContext";

const validateDateConclusion = (value, cerfaValues) => {
  const typeContratApp = cerfaValues.contrat.typeContratApp;
  const dateDebutContrat = cerfaValues.contrat.dateDebutContrat;
  const dateEffetAvenant = cerfaValues.contrat.dateEffetAvenant;

  if (typeContratApp >= 30) {
    if (value > dateEffetAvenant) {
      return {
        error: "La date de signature du contrat ne peut pas être après la date d'effet de l'avenant",
      };
    }
  } else {
    if (value > dateDebutContrat) {
      return {
        error: "La date de signature du contrat ne peut pas être après la date de début de contrat",
      };
    }
  }
};

const Signatures = () => {
  const dossier = useRecoilValue(dossierAtom);
  const { onSubmitted } = useSignatures();
  const dateConclusionField = useRecoilValue(fieldSelector("contrat.dateConclusion"));
  const lieuSignatureField = useRecoilValue(fieldSelector("contrat.lieuSignatureContrat"));
  const cerfaValues = useRecoilValue(valuesSelector);

  const dossierStatus = useRecoilValue(dossierCompletionStatus);
  const cerfaComplete = dossierStatus?.cerfa?.complete;
  const documentsComplete = dossierStatus?.documents?.complete;
  const signatureComplete = dossierStatus?.signature?.complete;
  const cerfaController = useCerfaController();
  const [submitted, setSubmitted] = useState(dateConclusionField.value && lieuSignatureField.value);

  const [lieuSignature, setLieuSignature] = useState({ value: lieuSignatureField.value, hasError: false });
  const [dateConclusion, setDateConclusion] = useState({ value: dateConclusionField.value, hasError: false });

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

  if (!signatureComplete || !submitted) {
    return (
      <Box mt={16} mb={16} minH="25vh">
        <Heading as="h3" fontSize="1.4rem">
          Merci de préciser le lieu et la date de signature du contrat:
        </Heading>
        <HStack spacing={8} mt={8} alignItems="baseline" h="150px">
          <VStack w="45%">
            <Input
              {...lieuSignatureField}
              value={lieuSignature.value}
              onSubmit={(value) => setLieuSignature({ value, hasError: false })}
              onError={(value) => setLieuSignature({ value, hasError: true })}
            />
          </VStack>
          <VStack w="55%">
            <Input
              {...dateConclusionField}
              value={dateConclusion.value}
              onSubmit={(value) => setDateConclusion({ value, hasError: false })}
              onError={(value) => setDateConclusion({ value, hasError: true })}
              validate={({ value }) => validateDateConclusion(value, cerfaValues)}
            />
          </VStack>
        </HStack>
        <HStack w="full" alignItems="end" justifyContent="end" mt={8}>
          <Button
            disabled={
              lieuSignature.hasError || dateConclusion.hasError || !lieuSignature.value || !dateConclusion.value
            }
            size="md"
            onClick={async () => {
              if (!lieuSignature.hasError && !dateConclusion.hasError) {
                await onSubmitted(lieuSignature.value, dateConclusion.value);
                cerfaController.setField("contrat.lieuSignatureContrat", lieuSignature.value, { triggerSave: false });
                cerfaController.setField("contrat.dateConclusion", dateConclusion.value, { triggerSave: false });
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

  if (dossier.etat === "EN_ATTENTE_DECLENCHEMENT_SIGNATURES") {
    return (
      <Box mt="5rem">
        <SignatairesForm />
      </Box>
    );
  }

  return (
    <Box mt="5rem">
      <Signataires />
    </Box>
  );
};
export default Signatures;
