import React from "react";
import { Box, Checkbox, Container, Heading, Text } from "@chakra-ui/react";
import Layout from "./layout/Layout";
import { Breadcrumb } from "../common/components/Breadcrumb";
import { setTitle } from "../common/utils/pageUtils";
import { Check } from "../theme/components/icons";

export default () => {
  const title = "Accueil";
  setTitle(title);

  return (
    <Layout>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E">
        <Container maxW="xl">
          <Breadcrumb pages={[{ title: title }]} />
        </Container>
        <Checkbox icon={<Check />} />
      </Box>
      <Box w="100%" py={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E">
        <Container maxW="xl">
          <Heading as="h1" fontSize="lg">
            Cette plateforme permet la saisie en ligne des contrats d'apprentissage pour les employeurs publics.
          </Heading>
          <Box pt={4} pb={16}>
            <Text>
              En tant qu'employeur public, relevant donc de la fonction publique d'Etat, de la fonction publique
              territoriale ou de la fonction publique hospitalière, vous pouvez générer le cerfa du contrat
              d'apprentissage. L'outil propose pour cela le pré-remplissage d'un maximum des éléments attendus et
              contrôle de cohérence et réglementaire de la donnée saisie.
              <br />
              <br />
            </Text>
            <Text>
              Depuis cette plateforme, vous pourrez inviter des contributeurs (employeurs ou Centre de Formations des
              Apprentis ) à collaborer à la complétude du document.
            </Text>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};
