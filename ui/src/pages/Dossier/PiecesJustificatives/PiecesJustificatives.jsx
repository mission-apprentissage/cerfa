import React, { lazy } from "react";
import { Box, Text, Center } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { useDocuments } from "../../../common/hooks/useDossier/useDocuments";
import InputCerfa from "../Cerfa/components/Input";
import Tooltip from "../../../common/components/Tooltip";
import { useCerfa } from "../../../common/hooks/useCerfa/useCerfa";
import { cerfaContratTypeContratAppAtom } from "../../../common/hooks/useCerfa/parts/useCerfaContratAtoms";

const UploadFiles = lazy(() => import("./components/UploadFiles"));

export default () => {
  const typeContratApp = useRecoilValue(cerfaContratTypeContratAppAtom);
  useCerfa();
  const { isRequired, employeurAttestationPieces, onSubmittedEmployeurAttestationPieces } = useDocuments();

  return (
    <Box mt={12} pt={2} minH="25vh">
      {!typeContratApp?.valueDb && (
        <Center>
          <Tooltip variant="alert">
            <Text>
              Veuillez renseigner <strong>le type de contrat</strong> dans le formulaire afin de déterminer quelle(s)
              pièces justificatives sont nécessaires.
            </Text>
          </Tooltip>
        </Center>
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
          <Text color="grey.500" fontStyle="italic" fontSize="0.81rem">
            Pendant la durée du contrat d’apprentissage, et après son terme, il peut vous être demandé de fournir
            l’original du contrat signé, les pièces permettant d’attester du <br />
            respect des déclarations figurant dans le contrat d’apprentissage ainsi que la convention de formation, et
            le cas échéant la convention tripartite.
            <br /> Il vous appartient donc de conserver l’ensemble de ces documents originaux.
          </Text>
        </>
      )}
    </Box>
  );
};
// <UploadFiles title="Convention d'aménagement de durée" typeDocument="CONVENTION_REDUCTION_DUREE" />
