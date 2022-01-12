import React, { useEffect, useState } from "react";
import { Box, Heading, Center, Button, Spinner, Text } from "@chakra-ui/react";
import { useRecoilValueLoadable } from "recoil";

import useAuth from "../../../common/hooks/useAuth";
import { useCerfa } from "../../../common/hooks/useCerfa/useCerfa";
import { _post } from "../../../common/httpClient";

import { PdfViewer } from "../../../common/components/PdfViewer";
import Tooltip from "../../../common/components/Tooltip";
import { ExternalLinkLine } from "../../../theme/components/icons";

import { cerfaPartFormationCompletionAtom } from "../../../common/hooks/useCerfa/parts/useCerfaFormationAtoms";
import { cerfaPartEmployeurCompletionAtom } from "../../../common/hooks/useCerfa/parts/useCerfaEmployeurAtoms";
import { cerfaPartMaitresCompletionAtom } from "../../../common/hooks/useCerfa/parts/useCerfaMaitresAtoms";
import { cerfaPartApprentiCompletionAtom } from "../../../common/hooks/useCerfa/parts/useCerfaApprentiAtoms";
import { cerfaPartContratCompletionAtom } from "../../../common/hooks/useCerfa/parts/useCerfaContratAtoms";

export default ({ dossierId }) => {
  let [auth] = useAuth();
  const [pdfBase64, setPdfBase64] = useState(null);
  const [pdfIsLoading, setPdfIsLoading] = useState(true);
  const { isLoading, cerfa } = useCerfa();
  const formationCompletion = useRecoilValueLoadable(cerfaPartFormationCompletionAtom);
  const employeurCompletionAtom = useRecoilValueLoadable(cerfaPartEmployeurCompletionAtom);
  const maitresCompletionAtom = useRecoilValueLoadable(cerfaPartMaitresCompletionAtom);
  const apprentiCompletionAtom = useRecoilValueLoadable(cerfaPartApprentiCompletionAtom);
  const contratCompletionAtom = useRecoilValueLoadable(cerfaPartContratCompletionAtom);

  const cerfaComplete =
    employeurCompletionAtom?.contents === 100 &&
    apprentiCompletionAtom?.contents === 100 &&
    maitresCompletionAtom?.contents === 100 &&
    contratCompletionAtom?.contents === 100 &&
    formationCompletion?.contents === 100;

  useEffect(() => {
    const run = async () => {
      try {
        if (dossierId && cerfa?.id && cerfaComplete) {
          const { pdfBase64 } = await _post(`/api/v1/cerfa/pdf/${cerfa.id}`, {
            workspaceId: auth.workspaceId,
            dossierId,
          });
          setPdfBase64(pdfBase64);
        }
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, [auth, cerfa, cerfaComplete, dossierId]);

  const onSignClicked = async () => {
    const reponse = await _post(`/api/v1/sign_document`, {
      workspaceId: auth.workspaceId,
      dossierId,
      cerfaId: cerfa.id,
    });
    console.log(reponse);
  };

  if (!cerfaComplete) {
    return (
      <Box mt={8}>
        <Heading as="h3" fontSize="1.4rem">
          Votre contrat généré:
        </Heading>
        <Center mt={5}>
          <Tooltip variant="alert">
            <Text>
              Le Cerfa doit être complété à 100% avant de commencer la procédure de télécharger le dossier finalisé.
            </Text>
          </Tooltip>
        </Center>
      </Box>
    );
  }

  return (
    <Box mt={8}>
      <Heading as="h3" fontSize="1.4rem">
        Votre contrat généré:
      </Heading>
      <Center mt={5}>
        {(isLoading || !pdfBase64) && <Spinner />}
        {!isLoading && pdfBase64 && (
          <PdfViewer
            url={`/api/v1/cerfa/pdf/${cerfa.id}/?workspaceId=${auth.workspaceId}&dossierId=${dossierId}`}
            pdfBase64={pdfBase64}
            documentLoaded={() => {
              setPdfIsLoading(false);
            }}
          />
        )}
      </Center>
      {!pdfIsLoading && auth.beta && auth.beta !== "non" && (
        <Box mt={8} mb={12}>
          <Center>
            <Button
              size="lg"
              variant="primary"
              bg="greenmedium.500"
              onClick={onSignClicked}
              height={16}
              minWidth={16}
              fontSize={"1.6rem"}
              _hover={{ bg: "greenmedium.600" }}
            >
              Déclencher la procédure de signature du contrat
              <ExternalLinkLine w={"1.2rem"} h={"1.2rem"} ml={"0.5rem"} mt={"0.25rem"} />
            </Button>
          </Center>
        </Box>
      )}
    </Box>
  );
};
