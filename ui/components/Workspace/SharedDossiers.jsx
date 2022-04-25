import React from "react";
import { Flex, Box, Heading } from "@chakra-ui/react";
import { _get } from "../../common/httpClient";
import { useQuery } from "react-query";
import TableDossiers from "./TableDossiers";

function useSharedWithMe() {
  const {
    data: sharedWithMeDossiers,
    isLoading: isLoadingSharedDossiers,
    isFetching: isFetchingSharedDossiers,
  } = useQuery("sharedDossiers", () => _get(`/api/v1/dossier/sharedwithme`), {
    refetchOnWindowFocus: false,
  });

  return {
    sharedWithMeDossiers,
    isLoading: isLoadingSharedDossiers,
    isFetching: isFetchingSharedDossiers,
  };
}

export const Header = () => {
  const { isLoading, sharedWithMeDossiers } = useSharedWithMe();

  if (isLoading) return null;

  return (
    <Flex as="nav" align="center" justify="space-between" wrap="wrap" w="100%">
      <Box flexBasis={{ base: "auto", md: "auto" }}>
        <Flex>
          <Heading as="h1" flexGrow="1" fontSize={{ base: "sm", md: "1.5rem" }}>
            Dossiers partagés avec moi ({sharedWithMeDossiers.length}){" "}
          </Heading>
        </Flex>
      </Box>
    </Flex>
  );
};

export const Content = () => {
  const { isLoading, sharedWithMeDossiers } = useSharedWithMe();

  if (isLoading) return null;

  return (
    <Box mt={8}>
      {sharedWithMeDossiers.length > 0 && (
        <TableDossiers
          dossiers={sharedWithMeDossiers}
          withDeleteAction={false}
          baseUrl="/mes-dossiers/dossiers-partages"
        />
      )}
    </Box>
  );
};
