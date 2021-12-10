import React from "react";
import { Flex, Box, Heading } from "@chakra-ui/react";

export default () => {
  return () => ({
    Header: (
      <Flex as="nav" align="center" justify="space-between" wrap="wrap" w="100%">
        <Box flexBasis={{ base: "auto", md: "auto" }}>
          <Heading as="h1" flexGrow="1" fontSize={{ base: "sm", md: "1.5rem" }}>
            Notifications
          </Heading>
        </Box>
      </Flex>
    ),
    Content: <Box mt={8}>Détails des notifications...</Box>,
  });
};
