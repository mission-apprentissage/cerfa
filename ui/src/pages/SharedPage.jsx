import React from "react";
import { NavLink } from "react-router-dom";
import { Box, Container, Heading, Link, Center, Spinner, Flex } from "@chakra-ui/react";
import { _get } from "../common/httpClient";
import { useQuery } from "react-query";
import Layout from "./layout/Layout";
import { Breadcrumb } from "../common/components/Breadcrumb";
import { setTitle } from "../common/utils/pageUtils";

export default () => {
  const title = "Partagés avec moi";
  setTitle(title);

  const {
    data: sharedWithMeWorkspaces,
    isLoading,
    isFetching,
  } = useQuery("workspaceDossiers", () => _get(`/api/v1/workspace/sharedwithme`), {
    refetchOnWindowFocus: false,
  });

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
          {(isLoading || isFetching) && (
            <Center>
              <Spinner />
            </Center>
          )}
          {!isLoading && !isFetching && (
            <Flex flexDirection="column">
              {!sharedWithMeWorkspaces.length && "Vous n'avez aucun partage pour le moment."}
              {sharedWithMeWorkspaces.map((sharedWithMeWorkspace) => {
                return (
                  <Link
                    mt={8}
                    as={NavLink}
                    to={`/partages-avec-moi/espaces/${sharedWithMeWorkspace._id}/dossiers`}
                    color="bluefrance"
                    _hover={{ textDecoration: "none", color: "grey.800", bg: "grey.200" }}
                    borderBottom="1px solid"
                    borderColor="bluefrance"
                    bg={"transparent"}
                    key={sharedWithMeWorkspace._id}
                  >
                    > {sharedWithMeWorkspace.nom}
                  </Link>
                );
              })}
            </Flex>
          )}
        </Container>
      </Box>
    </Layout>
  );
};
