import React from "react";
import { Box, Container, Heading, UnorderedList, ListItem } from "@chakra-ui/react";
import Layout from "./layout/Layout";
import { Breadcrumb } from "../common/components/Breadcrumb";
import { setTitle } from "../common/utils/pageUtils";
import useAuth from "../common/hooks/useAuth";

export default () => {
  let [auth] = useAuth();

  const title = "Mes informations";
  setTitle(title);

  return (
    <Layout>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E">
        <Container maxW="xl">
          <Breadcrumb pages={[{ title: "Accueil", to: "/" }, { title: title }]} />
        </Container>
      </Box>
      <Box w="100%" py={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E">
        <Container maxW="xl">
          <Heading as="h1" fontSize="lg">
            Mes informations
          </Heading>
          <Box pt={4} pb={16}>
            <UnorderedList>
              <ListItem>Prénom: {auth.prenom}</ListItem>
              <ListItem>Nom: {auth.nom}</ListItem>
              <ListItem>Nom d'Utilisateur: {auth.username}</ListItem>
              <ListItem>Téléphone: {auth.telephone}</ListItem>
              <ListItem>E-mail: {auth.email}</ListItem>
            </UnorderedList>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};
