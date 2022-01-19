import React, { lazy } from "react";
import { Box, Text } from "@chakra-ui/react";
import { useDocuments } from "../../../common/hooks/useDossier/useDocuments";
import InputCerfa from "../Cerfa/components/Input";
import Tooltip from "../../../common/components/Tooltip";

const UploadFiles = lazy(() => import("./components/UploadFiles"));

export default () => {
  const { isRequired, employeurAttestationPieces, onSubmittedEmployeurAttestationPieces, typeContratApp } =
    useDocuments("CONVENTION_FORMATION");
  return (
    <Box mt={8} pt={2}>
      {!typeContratApp.valueDb && (
        <Tooltip variant="alert">
          <Text>
            Veuillez renseigner <strong>le type de contrat</strong> dans le formulaire afin de déterminer quelle(s)
            pièces justificatives sont nécessaires.
          </Text>
        </Tooltip>
      )}
      {typeContratApp?.valueDb && typeContratApp?.valueDb !== "" && (
        <>
          <UploadFiles
            title={`Convention de formation${!isRequired ? " (Optionnel)" : " (Obligatoire)"}`}
            typeDocument="CONVENTION_FORMATION"
          />
          <InputCerfa
            path="employeur.attestationPieces"
            field={employeurAttestationPieces}
            type="consent"
            mt="2"
            onSubmittedField={onSubmittedEmployeurAttestationPieces}
          />
        </>
      )}
    </Box>
  );
};
// <UploadFiles title="Convention d'aménagement de durée" typeDocument="CONVENTION_REDUCTION_DUREE" />
