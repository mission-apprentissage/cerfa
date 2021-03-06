import React, { useState } from "react";
import { Box, Flex, Heading, Container, Button, Text, Link, UnorderedList, ListItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { workspacePathsAtom, workspaceAtom } from "../../hooks/workspaceAtoms";
import { hasContextAccessTo } from "../../common/utils/rolesUtils";
import { ExternalLinkLine } from "../../theme/components/icons";
import { useDossier } from "./hooks/useDossier";

const NouveauDossier = () => {
  const { isloaded, createDossier, saveDossier } = useDossier();
  const [isCreating, setIsCreating] = useState(false);
  const paths = useRecoilValue(workspacePathsAtom);
  const workspace = useRecoilValue(workspaceAtom);
  const router = useRouter();

  const onStartClicked = async () => {
    setIsCreating(true);
    const { _id } = await createDossier(workspace._id);
    setIsCreating(false);
    // TODO Temporary saved
    await saveDossier(_id);
    router.push(`${paths.dossiers}/${_id}/cerfa`);
  };

  if (!isloaded) return null;

  return (
    <Box w="100%" px={[1, 1, 12, 24]}>
      <Container maxW="xl">
        <Heading as="h1" flexGrow="1">
          Créer un nouveau dossier
        </Heading>

        <Flex flexDir="column" width="100%" mt={9}>
          <Text>
            Un Dossier est constitué du formulaire de contrat d&apos;apprentissage (ex cerfa) et des pièces jointes
            associées (la convention de formation et la convention d&apos;aménagement de durée, le cas échéant)
            <br />
            <br />
            En cliquant sur <strong>Créer un dossier</strong>, vous accédez au formulaire de saisie du générateur de
            contrat d&apos;apprentissage pour les employeurs publics. Celui-ci reprend les champs présents dans le{" "}
            <Link
              href={"https://www.formulaires.service-public.fr/gf/cerfa_10103.do"}
              textDecoration={"underline"}
              isExternal
            >
              &quot;cerfa papier&quot;
              <ExternalLinkLine w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} ml={"0.125rem"} />
            </Link>
            .
            <br />
            La complétude est facilitée car le service reprend les tables présentes dans{" "}
            <Link
              href={"https://www.formulaires.service-public.fr/gf/getNotice.do?cerfaNotice=51649&cerfaFormulaire=10103"}
              textDecoration={"underline"}
              isExternal
            >
              &quot;la notice du cerfa&quot;
              <ExternalLinkLine w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} ml={"0.125rem"} />
            </Link>{" "}
            pour les proposer dans des menus déroulants.
            <br />
            <br />
            Le formulaire utilise également la base Insee pour effectuer un contrôle réglementaire et s&apos;assurer via
            son Siret que l&apos;établissement est actif au moment de la conclusion du contrat.
            <br />
            D&apos;autres contrôles réglementaires permettent de s&apos;assurer que la formation est éligible à
            l&apos;apprentissage, que l&apos;employeur est public, que l&apos;âge de l&apos;apprenti permet bien de
            réaliser un contrat d&apos;apprentissage, ou encore que la rémunération est conforme aux dispositions
            légales.
            <br />
            De la même manière, le formulaire propose de pré-compléter les données formation, à partir de la saisie de
            la donnée Siret ou UAI du CFA, en exploitant pour cela le catalogue de formation collecté par chacun des
            Carifs, quand la donnée existe.
            <br />
            <br />
            Pour préparer la complétude du dossier, munissez-vous des éléments suivants qui vous seront demandés :
          </Text>
          <UnorderedList ml="40px !important">
            <ListItem fontStyle="italic" my={2}>
              <strong>Pour le volet employeur :</strong> le n° de Siret, le téléphone et l&apos;adresse mail de contact,
            </ListItem>
            <ListItem fontStyle="italic" my={2}>
              <strong>Pour le volet maitre d&apos;apprentissage :</strong> les nom , prénom et date de naissance
            </ListItem>
            <ListItem fontStyle="italic" my={2}>
              <strong>Pour le volet apprenti :</strong> la date de naissance, l&apos;adresse et le parcours scolaire
            </ListItem>
            <ListItem fontStyle="italic" my={2}>
              <strong>Pour le volet formation :</strong> Les n° de Siret/uai du CFA, du code RNCP/diplôme, les dates de
              formation
            </ListItem>
            <ListItem fontStyle="italic" my={2}>
              <strong>Pour le contrat :</strong> les dates de début et de fin, le n° du contrat initial si avenant
            </ListItem>
            <ListItem fontStyle="italic" my={2}>
              <strong>Pour les pièces justificatives :</strong> la convention de formation (seulement si le type de
              contrat - initial ou succession- la rend obligatoire).
            </ListItem>
          </UnorderedList>
          <Flex width="100%" justifyContent="flex-end" mt={9}>
            <Button
              size="lg"
              onClick={onStartClicked}
              variant="primary"
              isLoading={isCreating}
              isDisabled={!hasContextAccessTo(workspace, "wks/page_espace/page_dossiers/ajouter_nouveau_dossier")}
            >
              Commencer la saisie
            </Button>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default NouveauDossier;
