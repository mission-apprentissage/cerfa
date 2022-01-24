import React, { useEffect, useState } from "react";
import { Box, Heading, Center, Button, Spinner, Text, HStack } from "@chakra-ui/react";
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

import { documentsCompletionAtom } from "../../../common/hooks/useDossier/documentsAtoms";

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
    return () => {};
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
    <Box mt={8} minH="30vh">
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
  useCerfa();
  const {
    sca: signaturesCompletion,
    contratLieuSignatureContrat,
    onSubmittedContratLieuSignatureContrat,
  } = useSignatures();

  const documentsCompletion = useRecoilValueLoadable(documentsCompletionAtom);

  const formationCompletion = useRecoilValueLoadable(cerfaPartFormationCompletionAtom);
  const employeurCompletionAtom = useRecoilValueLoadable(cerfaPartEmployeurCompletionAtom);
  const maitresCompletionAtom = useRecoilValueLoadable(cerfaPartMaitresCompletionAtom);
  const apprentiCompletionAtom = useRecoilValueLoadable(cerfaPartApprentiCompletionAtom);
  const contratCompletionAtom = useRecoilValueLoadable(cerfaPartContratCompletionAtom);
  const [value, setValue] = useState(contratLieuSignatureContrat?.value);
  const cerfaComplete =
    employeurCompletionAtom?.contents === 100 &&
    apprentiCompletionAtom?.contents === 100 &&
    maitresCompletionAtom?.contents === 100 &&
    contratCompletionAtom?.contents === 100 &&
    formationCompletion?.contents === 100;
  const documentsComplete = documentsCompletion?.contents === 100;
  const signatureComplete = signaturesCompletion === 100;

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
              Les pièces justificatives doivnt être complétées à 100% avant de commencer la procédure de finalisation du
              dossier.
            </Text>
          </Tooltip>
        </Center>
      </Box>
    );
  }

  if (!signatureComplete) {
    return (
      <Box mt={8} mb={16} minH="25vh">
        <Heading as="h3" fontSize="1.4rem">
          Merci de préciser le lieu de signature du contrat:
        </Heading>
        <HStack spacing={8} alignItems="end">
          <InputCerfa
            path="contrat.lieuSignatureContrat"
            field={contratLieuSignatureContrat}
            type="text"
            mt="2"
            onSubmittedField={(path, data) => setValue(data)}
            w="40%"
          />
          <Button
            size="md"
            onClick={() =>
              value !== "" ? onSubmittedContratLieuSignatureContrat("contrat.lieuSignatureContrat", value) : false
            }
            variant="primary"
          >
            Enregistrer
          </Button>
        </HStack>
      </Box>
    );
  }

  return <ContratPdf dossierId={dossierId} />;
};
