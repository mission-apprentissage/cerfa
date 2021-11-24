import React from "react";
import { Box, Container } from "@chakra-ui/react";
import Layout from "./layout/Layout";
import { Breadcrumb } from "../common/components/Breadcrumb";
import { setTitle } from "../common/utils/pageUtils";

export default () => {
  const title = "Mes dossiers";
  setTitle(title);

  return (
    <Layout>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E">
        <Container maxW="xl">
          <Breadcrumb pages={[{ title: "Accueil", to: "/" }, { title: title }]} />
        </Container>
      </Box>
      <Box w="100%" py={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E">
        <Container maxW="xl">Mes dossiers</Container>
      </Box>
    </Layout>
  );
};
