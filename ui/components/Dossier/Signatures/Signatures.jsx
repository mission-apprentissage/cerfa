import React, { useState } from "react";
import { Box, Heading, Center, Button, Text, HStack, VStack } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import Tooltip from "../../Tooltip/Tooltip";
import { dossierAtom } from "../atoms";

import { dossierCompletionStatus } from "../atoms";
import { fieldSelector } from "../formEngine/atoms";
import { useSignatures } from "./hooks/useSignatures";
import { SignatairesForm } from "./components/SignatairesForm";
import { ContratPdf } from "./components/ContratPdf";
import { Signataires } from "./components/Signataires";
import { Input } from "../formEngine/components/Input/Input";
import { useCerfaController } from "../formEngine/CerfaControllerContext";

const Signatures = () => {
  const dossier = useRecoilValue(dossierAtom);
  const { onSubmitted } = useSignatures();

  const dateConclusionField = useRecoilValue(fieldSelector("contrat.dateConclusion"));
  const lieuSignatureField = useRecoilValue(fieldSelector("contrat.lieuSignatureContrat"));

  const [_lieuSignature, setLieuSignature] = useState(lieuSignatureField?.value);
  const [_dateConclusion, setDateConclusion] = useState(dateConclusionField?.value);

  const dossierStatus = useRecoilValue(dossierCompletionStatus);
  const cerfaComplete = dossierStatus?.cerfa?.complete;
  const documentsComplete = dossierStatus?.documents?.complete;
  const signatureComplete = dossierStatus?.signature?.complete;
  const cerfaController = useCerfaController();

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
            <Input {...lieuSignatureField} value={_lieuSignature} onChange={setLieuSignature} />
            <Text textStyle="sm">&nbsp;</Text>
          </VStack>
          <VStack>
            <Input {...dateConclusionField} value={_dateConclusion} onChange={setDateConclusion} />
            <Text textStyle="sm">&nbsp;</Text>
          </VStack>
        </HStack>
        <HStack w="full" alignItems="end" justifyContent="end" mt={8}>
          <Button
            size="md"
            onClick={async () => {
              if (_lieuSignature && _dateConclusion) {
                await onSubmitted(_lieuSignature, _dateConclusion);
                cerfaController.setField("contrat.lieuSignatureContrat", _lieuSignature, { triggerSave: false });
                cerfaController.setField("contrat.dateConclusion", _dateConclusion, { triggerSave: false });
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
