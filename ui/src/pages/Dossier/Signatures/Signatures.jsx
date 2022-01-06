import React, { useEffect, useState } from "react";
import { Box, Heading, Center, Button } from "@chakra-ui/react";

import useAuth from "../../../common/hooks/useAuth";
import { useCerfa } from "../../../common/hooks/useCerfa/useCerfa";
import { _post } from "../../../common/httpClient";

import { PdfViewer } from "../../../common/components/PdfViewer";
import { ExternalLinkLine } from "../../../theme/components/icons";

export default ({ dossierId }) => {
  let [auth] = useAuth();
  const [pdfBase64, setPdfBase64] = useState(null);
  const [pdfIsLoading, setPdfIsLoading] = useState(true);
  const { isLoading, cerfa } = useCerfa();

  useEffect(() => {
    const run = async () => {
      try {
        if (dossierId && cerfa.id) {
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
  }, [auth, cerfa, dossierId]);

  const onSignClicked = async () => {
    const reponse = await _post(`/api/v1/sign_document`, {
      workspaceId: auth.workspaceId,
      dossierId,
      cerfaId: cerfa.id,
    });
    console.log(reponse);
  };

  if (isLoading || !pdfBase64) {
    return null;
  }

  return (
    <Box mt={8}>
      <Heading as="h3" fontSize="1.4rem">
        Votre contrat généré:
      </Heading>
      <Center>
        <PdfViewer
          url={`/api/v1/cerfa/pdf/${cerfa.id}/?workspaceId=${auth.workspaceId}&dossierId=${dossierId}`}
          pdfBase64={pdfBase64}
          documentLoaded={() => {
            setPdfIsLoading(false);
          }}
        />
      </Center>
      {!pdfIsLoading && (
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
