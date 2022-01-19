import React, { useEffect, useState } from "react";
import { Box, Heading, Center, Button, Spinner, Text } from "@chakra-ui/react";
import { useRecoilValueLoadable, useSetRecoilState } from "recoil";

import useAuth from "../../../common/hooks/useAuth";
import { useCerfa } from "../../../common/hooks/useCerfa/useCerfa";
import { _post } from "../../../common/httpClient";

import { PdfViewer } from "../../../common/components/PdfViewer";
import Tooltip from "../../../common/components/Tooltip";
import { ExternalLinkLine } from "../../../theme/components/icons";

import { useSignatures } from "../../../common/hooks/useDossier/useSignatures";
import { signaturesPdfLoadedAtom } from "../../../common/hooks/useDossier/signaturesAtoms";
import InputCerfa from "../Cerfa/components/Input";

import { cerfaPartFormationCompletionAtom } from "../../../common/hooks/useCerfa/parts/useCerfaFormationAtoms";
import { cerfaPartEmployeurCompletionAtom } from "../../../common/hooks/useCerfa/parts/useCerfaEmployeurAtoms";
import { cerfaPartMaitresCompletionAtom } from "../../../common/hooks/useCerfa/parts/useCerfaMaitresAtoms";
import { cerfaPartApprentiCompletionAtom } from "../../../common/hooks/useCerfa/parts/useCerfaApprentiAtoms";
import { cerfaPartContratCompletionAtom } from "../../../common/hooks/useCerfa/parts/useCerfaContratAtoms";

const ContratPdf = ({ dossierId }) => {
  let [auth] = useAuth();
  const [pdfBase64, setPdfBase64] = useState(null);
  const [pdfIsLoading, setPdfIsLoading] = useState(true);
  const setPdfLoaded = useSetRecoilState(signaturesPdfLoadedAtom);

  const { isLoading, cerfa } = useCerfa();

  useEffect(() => {
    const run = async () => {
      try {
        if (dossierId && cerfa?.id) {
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
            showDownload={false}
            documentLoaded={() => {
              setPdfIsLoading(false);
              setPdfLoaded(true);
            }}
          />
        )}
      </Center>
      {!pdfIsLoading && auth.beta && auth.beta !== "non" && (
        <Box mt={8} mb={12}>
          <Center>
            <Button
              size="md"
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

export default ({ dossierId }) => {
  const formationCompletion = useRecoilValueLoadable(cerfaPartFormationCompletionAtom);
  const employeurCompletionAtom = useRecoilValueLoadable(cerfaPartEmployeurCompletionAtom);
  const maitresCompletionAtom = useRecoilValueLoadable(cerfaPartMaitresCompletionAtom);
  const apprentiCompletionAtom = useRecoilValueLoadable(cerfaPartApprentiCompletionAtom);
  const contratCompletionAtom = useRecoilValueLoadable(cerfaPartContratCompletionAtom);
  const { signaturesCompletion, lieuSignatureContrat, onSubmittedContratLieuSignatureContrat } = useSignatures();

  const cerfaComplete =
    employeurCompletionAtom?.contents === 100 &&
    apprentiCompletionAtom?.contents === 100 &&
    maitresCompletionAtom?.contents === 100 &&
    contratCompletionAtom?.contents === 100 &&
    formationCompletion?.contents === 100;
  const signatureComplete = signaturesCompletion === 100;

  if (!cerfaComplete) {
    return (
      <Box mt={8}>
        <Heading as="h3" fontSize="1.4rem">
          Votre contrat généré:
        </Heading>
        <Center mt={5}>
          <Tooltip variant="alert">
            <Text>Le Cerfa doit être complété à 100% avant de commencer la procédure de finalisation du dossier.</Text>
          </Tooltip>
        </Center>
      </Box>
    );
  }

  if (!signatureComplete) {
    return (
      <Box mt={8}>
        <Heading as="h3" fontSize="1.4rem">
          Merci de préciser le lieu de signature du contrat:
        </Heading>
        <InputCerfa
          path="contrat.lieuSignatureContrat"
          field={lieuSignatureContrat}
          type="text"
          mt="2"
          onSubmittedField={onSubmittedContratLieuSignatureContrat}
        />
      </Box>
    );
  }

  return <ContratPdf dossierId={dossierId} />;
};
