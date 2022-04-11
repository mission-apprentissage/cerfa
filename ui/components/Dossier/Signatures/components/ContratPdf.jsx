import useAuth from "../../../../hooks/useAuth";
import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { signaturesPdfLoadedAtom } from "../../../../hooks/useDossier/signaturesAtoms";
import { useCerfa } from "../../../../hooks/useCerfa/useCerfa";
import { dossierAtom } from "../../../../hooks/useDossier/dossierAtom";
import { _post } from "../../../../common/httpClient";
import { Box, Center, Heading, Link, ListItem, OrderedList, SkeletonText, Spinner, Text } from "@chakra-ui/react";
import PdfViewer from "../../../PdfViewer/PdfViewer";
import NavLink from "next/link";

export const ContratPdf = () => {
  let [auth] = useAuth();
  const [pdfBase64, setPdfBase64] = useState(null);
  const setPdfLoaded = useSetRecoilState(signaturesPdfLoadedAtom);
  const { isLoading, cerfa } = useCerfa();
  const dossier = useRecoilValue(dossierAtom);

  const showDdets =
    dossier.etat === "DOSSIER_TERMINE_SANS_SIGNATURE" || dossier.etat === "DOSSIER_TERMINE_AVEC_SIGNATURE";

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
              Ce dossier est finalisé, toute modification devra faire l&apos;objet d&apos;un avenant.
              <br />
            </Text>
            <Text>Vos prochaines étapes :</Text>
            <OrderedList ml="30px !important" my={2}>
              <ListItem>Imprimez le document pour signatures</ListItem>
              <ListItem>
                Cliquez sur Télétransmettre ; le contrat et ses éventuelles pièces jointes seront transmis à{" "}
                {ddets.DDETS}
              </ListItem>

              <ListItem>Suivez l&apos;avancement de votre dossier depuis votre espace</ListItem>
            </OrderedList>

            <Text>
              Pour toute question, consultez{" "}
              <Link as={NavLink} href={"/assistance"} color="bluefrance">
                la page &quot;Assistance&quot;
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
