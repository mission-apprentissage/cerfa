import React, { useState } from "react";
import { Box, Flex, Heading, Container, Button, Text } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { workspacePathsAtom, workspaceAtom } from "../../common/hooks/workspaceAtoms";
import { useDossier } from "../../common/hooks/useDossier/useDossier";
import { hasContextAccessTo } from "../../common/utils/rolesUtils";

export default () => {
  const { isloaded, createDossier, saveDossier } = useDossier();
  const [isCreating, setIsCreating] = useState(false);
  const paths = useRecoilValue(workspacePathsAtom);
  const workspace = useRecoilValue(workspaceAtom);
  const history = useHistory();

  const onStartClicked = async () => {
    setIsCreating(true);
    const { _id } = await createDossier(workspace._id);
    setIsCreating(false);
    // TODO Temporary saved
    await saveDossier(_id);
    history.push(`${paths.dossiers}/${_id}/cerfa`);
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
            Un Dossier est constitué du formulaire de contrat d'apprentissage (ex cerfa) et des pièces jointes associées
            (la convention de formation et la convention d'aménagement de durée, le cas échéant)
            <br />
            <br />
            En cliquant sur "Créer un dossier", vous accédez au formulaire de saisie du générateur de contrat
            d'apprentissage pour les employeurs publics. Celui-ci reprend les champs présents dans le "cerfa papier". La
            complétude est facilitée car le service reprend les tables présentes dans la notice du cerfa pour les
            proposer dans des menus déroulants. Le formulaire utilise également la base Insee pour effectuer un contrôle
            réglementaire et s'assurer via son Siret que l'établissement est actif au moment de la conclusion du
            contrat. D'autres contrôles réglementaires permettent de s'assurer que la formation est éligible à
            l'apprentissage, que l'employeur est public, que l'âge de l'apprenti permet bien de réaliser un contrat
            d'apprentissage, ou encore que la rémunération est conforme aux dispositions légales. De la même manière, le
            formulaire propose de pré-compléter les données formation, à partir de la saisie de la donnée Siret ou UAI
            du CFA, en exploitant pour cela le catalogue de formation collecté par chacun des Carifs, quand la donnée
            existe. Enfin, la saisie du formulaire est simplifiée par des contrôles de cohérence sur les données saisies
            (par exemple, la période de rémunération en fonction de la date de début du contrat et de la date de
            naissance de l'apprenti saisie) et des alertes à la saisie.
            <br />
            <br />
            Pour préparer la complétude du dossier, munissez-vous des éléments suivants qui vous seront demandés Pour le
            volet employeur : le n° de Siret, le téléphone et l'adresse mail de contact,
          </Text>
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
