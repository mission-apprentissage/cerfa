import React from "react";
import { Box, Container, Heading } from "@chakra-ui/react";
import Layout from "./layout/Layout";
import { Breadcrumb } from "../common/components/Breadcrumb";
import { setTitle } from "../common/utils/pageUtils";

export default ({ match }) => {
  const title = "Accueil";
  setTitle(title);

  return (
    <Layout match={match}>
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
        </Container>
      </Box>
    </Layout>
  );
};
