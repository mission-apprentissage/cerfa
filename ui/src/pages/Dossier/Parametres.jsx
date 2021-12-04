import React from "react";
import { Box, Container, Heading, Text } from "@chakra-ui/react";
import Layout from "../layout/Layout";
import { Breadcrumb } from "../../common/components/Breadcrumb";
import { setTitle } from "../../common/utils/pageUtils";

export default ({ match }) => {
  const title = "Paramètres";
  setTitle(title);

  return (
    <Layout match={match}>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]} color="grey.800">
        <Container maxW="xl">
          <Breadcrumb
            pages={[
              { title: "Accueil", to: "/" },
              { title: "Mon espace", to: "/mon-espace/mes-dossiers" },
              { title: "Paramètres" },
            ]}
          />
        </Container>
      </Box>
      <Box w="100%" px={[1, 1, 12, 24]} mt={5}>
        <Container maxW="xl">
          <Heading as="h1" flexGrow="1">
            {title}
          </Heading>

          <Box mt={9}>
            <Text>mes paramètres ...</Text>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};
