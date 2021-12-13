import React from "react";
import { Box, Flex, Container, HStack, Heading } from "@chakra-ui/react";
import Layout from "../layout/Layout";
import { Breadcrumb } from "../../common/components/Breadcrumb";
import { setTitle } from "../../common/utils/pageUtils";
import { useParams } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";

const AuthPage = () => {
  let { slug } = useParams();

  const title = "Connexion";
  setTitle(title);

  if (slug !== "connexion" && slug !== "inscription") {
    return null; // TODO errorBondary
  }

  return (
    <Layout>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E">
        <Container maxW="xl">
          <Breadcrumb pages={[{ title: "Accueil", to: "/" }, { title: title }]} />
        </Container>
      </Box>
      <Box w="100%" py={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E" minH="50vh">
        <Container maxW="xl">
          <HStack w="full" spacing={10} minH="40vh" maxW="xl" alignItems="baseline">
            <Flex bg="bluefrance" color="white" w="50%" h="40vh" py={[4, 12]} px={[1, 1, 8, 10]} zIndex={1}>
              <Heading as="h2" fontSize="1.8rem" lineHeight="1.5">
                Vous êtes
                <br />
                une Entreprise ou un CFA ?
              </Heading>
            </Flex>

            <Flex flexDirection="column" bg="galt" w="50%" h="40vh" py={[4, 12]} px={[1, 1, 8, 10]}>
              <Heading as="h1" fontSize="1.8rem" lineHeight="1.5" mb={4}>
                {slug === "connexion" && "Connexion"}
                {slug === "inscription" && "Inscription"}
              </Heading>
              <Box flexGrow={1} border="1px solid">
                {slug === "connexion" && <Login />}
                {slug === "inscription" && <Register />}
              </Box>
            </Flex>
          </HStack>
        </Container>
      </Box>
    </Layout>
  );
};

export default AuthPage;
