import React from "react";
import { NavLink } from "react-router-dom";
import { Box, Container, Heading, Link, Text } from "@chakra-ui/react";
import Layout from "./layout/Layout";
import { Breadcrumb } from "../common/components/Breadcrumb";
import { setTitle } from "../common/utils/pageUtils";

export default () => {
  const title = "Partagés avec moi";
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
            {title}
          </Heading>
          <Link
            mt={8}
            as={NavLink}
            to="/partages-avec-moi/espaces/61b335ebcaebd2675cb2b59a/dossiers"
            color="bluefrance"
            _hover={{ textDecoration: "none", color: "grey.800", bg: "grey.200" }}
            borderBottom="1px solid"
            borderColor="bluefrance"
            bg={"transparent"}
          >
            <Text display="block">Esapce 61b335ebcaebd2675cb2b59a</Text>
          </Link>
        </Container>
      </Box>
    </Layout>
  );
};
