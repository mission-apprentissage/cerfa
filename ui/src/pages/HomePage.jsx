import React from "react";
import { Box, Container, Heading, Text } from "@chakra-ui/react";
import Layout from "./layout/Layout";
import { Breadcrumb } from "../common/components/Breadcrumb";
import { setTitle } from "../common/utils/pageUtils";

export default () => {
  const title = "Accueil";
  setTitle(title);

  return (
    <Layout>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E">
        <Container maxW="xl">
          <Breadcrumb pages={[{ title: title }]} />
        </Container>
      </Box>
      <Box w="100%" py={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E">
        <Container maxW="xl">
          <Heading as="h1" fontSize="lg">
            Plateforme de gestion des Contrats en apprentissage du secteur publique.
          </Heading>
          <Box pt={4} pb={16}>
            <Text>
              Cette plateforme permet est une aide à la complétion de contrats en Apprentissage pour la fonction
              publique.
              <br />
              <br />
            </Text>
            <Text>
              Vous y trouverez un générateur de contrat d'apprentissage permettant le pré-remplissage et contrôle de la
              donnée saisie.
              <br />
              <br />
              Ce générateur donne un accès collaboratif à chacun des acteurs (Organisme de formation, Employeur et
              Apprenti(e)). Il permet de notifier les acteurs lors d'un changement d'état (Cycle de vie de complétion du
              CERFA).
            </Text>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};
