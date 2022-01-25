import React from "react";
import { Box, Container, Heading, Text, UnorderedList, ListItem, Button, Flex } from "@chakra-ui/react";
import Layout from "./layout/Layout";
import { Breadcrumb } from "../common/components/Breadcrumb";
import { setTitle } from "../common/utils/pageUtils";
import { NavLink } from "react-router-dom";

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
            Plateforme de saisie en ligne des contrats d'apprentissage pour les employeurs publics.
          </Heading>
          <Box pt={4} pb={16} mt={8}>
            <Text>
              Vous pouvez générer le cerfa du contrat d'apprentissage lorsque vous êtes :
              <br />
              <br />
            </Text>
            <UnorderedList ml="30px !important">
              <ListItem>
                un employeur public, relevant de la fonction publique d'Etat, de la fonction publique territoriale ou de
                la fonction publique hospitalière ;
              </ListItem>
              <ListItem>un organisme de formation formant un apprenti en contrat chez un employeur public.</ListItem>
            </UnorderedList>
            <Text mt={8}>
              Cette plateforme propose :<br />
              <br />
            </Text>
            <UnorderedList ml="30px !important">
              <ListItem>Le pré-remplissage d'un maximum des éléments attendus ;</ListItem>
              <ListItem>Un contrôle de cohérence et de réglementation de la donnée saisie ;</ListItem>
              <ListItem>
                La collaboration entre contributeurs (employeurs ou Centre de Formation des Apprentis) pour compléter le
                document.
              </ListItem>
            </UnorderedList>
          </Box>
          <Flex justifyContent="end" w="full">
            <Button
              as={NavLink}
              to={"/mon-espace/mes-dossiers"}
              fontSize={{ base: "md", md: "lg" }}
              p={{ base: 4, md: 6 }}
              h={{ base: 8, md: 10 }}
              variant="primary"
            >
              Accéder maintenant
            </Button>
          </Flex>
        </Container>
      </Box>
    </Layout>
  );
};
