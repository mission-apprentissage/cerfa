import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Center,
  Button,
  Spinner,
  Text,
  HStack,
  VStack,
  OrderedList,
  ListItem,
  SkeletonText,
  Link,
  Stack,
  Skeleton,
} from "@chakra-ui/react";
import { useRecoilValueLoadable, useRecoilValue, useSetRecoilState } from "recoil";
import { NavLink } from "react-router-dom";

import useAuth from "../../../common/hooks/useAuth";
import { useCerfa } from "../../../common/hooks/useCerfa/useCerfa";
import { _post } from "../../../common/httpClient";

import { PdfViewer } from "../../../common/components/PdfViewer";
import Tooltip from "../../../common/components/Tooltip";

import { useSignatures } from "../../../common/hooks/useDossier/useSignatures";
import { signaturesPdfLoadedAtom } from "../../../common/hooks/useDossier/signaturesAtoms";
import InputCerfa from "../Cerfa/components/Input";

import { dossierAtom } from "../../../common/hooks/useDossier/dossierAtom";

import { documentsCompletionAtom } from "../../../common/hooks/useDossier/documentsAtoms";

import { cerfaPartFormationCompletionAtom } from "../../../common/hooks/useCerfa/parts/useCerfaFormationAtoms";
import { cerfaPartEmployeurCompletionAtom } from "../../../common/hooks/useCerfa/parts/useCerfaEmployeurAtoms";
import { cerfaPartMaitresCompletionAtom } from "../../../common/hooks/useCerfa/parts/useCerfaMaitresAtoms";
import { cerfaPartApprentiCompletionAtom } from "../../../common/hooks/useCerfa/parts/useCerfaApprentiAtoms";
import {
  cerfaPartContratCompletionAtom,
  cerfaContratDateDebutContratAtom,
} from "../../../common/hooks/useCerfa/parts/useCerfaContratAtoms";

const DdetsContainer = () => {
  const { cerfa } = useCerfa();
  const dossier = useRecoilValue(dossierAtom);

  const [ddets, setDdets] = useState(null);

  useEffect(() => {
    const run = async () => {
      if (cerfa && !ddets) {
        const code_region = cerfa.employeur.adresse.region.value;
        const code_dpt = cerfa.employeur.adresse.departement.value;
        if (code_region && code_dpt) {
          const response = await _post(`/api/v1/dreetsddets/`, {
            code_region,
            code_dpt,
            dossierId: dossier._id,
          });
          setDdets(response.ddets);
        }
      }
    };
    run();
  }, [cerfa, ddets, dossier?._id]);

  return (
    <Box mt={8} mb={8}>
      {!ddets && <SkeletonText mt="4" noOfLines={4} spacing="4" />}
      {ddets && (
        <>
          <Box>
            <Text fontWeight="bold" mb={5}>
              Ce dossier est finalisé, toute modification devra faire l'objet d'un avenant.
              <br />
            </Text>
            <Text>Vos prochaines étapes :</Text>
            <OrderedList ml="30px !important" my={2}>
              <ListItem>Imprimez le document pour signatures</ListItem>
              <ListItem>
                Envoyez le document signé à l'adresse suivante {ddets.DDETS} <strong>{ddets["Mail_depot"]}</strong>
              </ListItem>

              <ListItem>Suivez l'avancement de votre dossier depuis votre espace</ListItem>
            </OrderedList>

            <Text>
              Pour toute question, vous pouvez contacter votre DEETS au {ddets["Telephone"]} ou{" "}
              <Link as={NavLink} to={"/support"}>
                l'assistance
              </Link>
            </Text>
            {ddets["Informations_complementaires"] && (
              <Text>
                Informations complémentaires:
                <br /> {ddets["Informations_complementaires"]}
              </Text>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

const ContratPdf = () => {
  let [auth] = useAuth();
  const [pdfBase64, setPdfBase64] = useState(null);
  const setPdfLoaded = useSetRecoilState(signaturesPdfLoadedAtom);
  const { isLoading, cerfa } = useCerfa();
  const dossier = useRecoilValue(dossierAtom);

  const showDdets =
    dossier.etat === "DOSSIER_TERMINE" ||
    dossier.etat === "DOSSIER_TERMINE_SANS_SIGNATURE" ||
    dossier.etat === "DOSSIER_TERMINE_AVEC_SIGNATURE";

  useEffect(() => {
    const run = async () => {
      try {
        if (dossier._id && cerfa?.id) {
          const { pdfBase64 } = await _post(`/api/v1/cerfa/pdf/${cerfa.id}`, {
            dossierId: dossier._id,
          });
          setPdfBase64(pdfBase64);
        }
      } catch (e) {
        console.error(e);
      }
    };
    run();
    return () => {};
  }, [auth, cerfa, dossier?._id]);

  return (
    <Box mt={8} minH="30vh">
      {showDdets && <DdetsContainer />}
      <Heading as="h3" fontSize="1.4rem">
        Votre contrat généré (non signé):
      </Heading>
      <Center mt={5}>
        {(isLoading || !pdfBase64) && <Spinner />}
        {!isLoading && pdfBase64 && (
          <PdfViewer
            url={`/api/v1/cerfa/pdf/${cerfa.id}/?dossierId=${dossier._id}`}
            pdfBase64={pdfBase64}
            showDownload={false}
            documentLoaded={() => {
              setPdfLoaded(true);
            }}
          />
        )}
      </Center>
    </Box>
  );
};

export default () => {
  const dossier = useRecoilValue(dossierAtom);
  useCerfa();
  const {
    sca: signaturesCompletion,
    contratLieuSignatureContrat,
    // onSubmittedContratLieuSignatureContrat,
    contratDateConclusion,
    // onSubmittedContratDateConclusion,
    isLoaded,
    onSubmitted,
  } = useSignatures();

  const documentsCompletion = useRecoilValueLoadable(documentsCompletionAtom);

  const formationCompletion = useRecoilValueLoadable(cerfaPartFormationCompletionAtom);
  const employeurCompletionAtom = useRecoilValueLoadable(cerfaPartEmployeurCompletionAtom);
  const maitresCompletionAtom = useRecoilValueLoadable(cerfaPartMaitresCompletionAtom);
  const apprentiCompletionAtom = useRecoilValueLoadable(cerfaPartApprentiCompletionAtom);
  const contratCompletionAtom = useRecoilValueLoadable(cerfaPartContratCompletionAtom);

  const dateDebutContrat = useRecoilValue(cerfaContratDateDebutContratAtom);

  const [valueLieu, setValueLieu] = useState(contratLieuSignatureContrat?.value);
  const [valueDate, setValueDate] = useState(contratDateConclusion?.value);
  const cerfaComplete =
    employeurCompletionAtom?.contents === 100 &&
    apprentiCompletionAtom?.contents === 100 &&
    maitresCompletionAtom?.contents === 100 &&
    contratCompletionAtom?.contents === 100 &&
    formationCompletion?.contents === 100;
  const documentsComplete = documentsCompletion?.contents === 100;
  const signatureComplete = signaturesCompletion === 100;

  useEffect(() => {
    if (isLoaded) {
      setValueLieu(contratLieuSignatureContrat?.value);
      setValueDate(contratDateConclusion?.value);
    }
  }, [contratDateConclusion, contratLieuSignatureContrat, isLoaded]);

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

  if ((valueLieu === undefined && valueDate === undefined) || !isLoaded) {
    return (
      <Center>
        <Spinner />
      </Center>
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
            <InputCerfa
              path="contrat.lieuSignatureContrat"
              field={contratLieuSignatureContrat}
              type="text"
              mt="2"
              onSubmittedField={(path, data) => setValueLieu(data)}
              label="Fait à :"
            />
            <Text textStyle="sm">&nbsp;</Text>
          </VStack>

          <VStack>
            <InputCerfa
              path="contrat.dateConclusion"
              field={contratDateConclusion}
              type="date"
              mt="2"
              label="le :"
              onSubmittedField={(path, data) => setValueDate(data)}
              onAsyncData={{
                dateDebutContrat: dateDebutContrat?.value,
              }}
            />
            <Text textStyle="sm">&nbsp;</Text>
          </VStack>
        </HStack>
        <HStack w="full" alignItems="end" justifyContent="end" mt={8}>
          <Button
            size="md"
            onClick={async () => {
              if (valueLieu !== "" && valueDate !== "") {
                return onSubmitted(valueLieu, valueDate);
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
    // dossier.etat === "BROUILLON" ||
    // dossier.etat === "DOSSIER_FINALISE_EN_ATTENTE_ACTION" ||
    (dossier.etat === "DOSSIER_TERMINE" || // TODO MIGRATION
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

  return (
    <Box mt="5rem">
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    </Box>
  );
};
