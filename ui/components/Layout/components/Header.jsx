import React from "react";
import { Box, Container, Flex, Heading, Tag } from "@chakra-ui/react";

import { Logo } from "./Logo";
import AlertMessage from "./AlertMessage";
import Link from "../../../components/Link";

const Header = () => {
  return (
    <>
      <AlertMessage />
      <Container
        as="header"
        role="banner"
        maxW={"full"}
        borderBottom={"1px solid"}
        borderColor={"grey.400"}
        px={[0, 4]}
      >
        <Container maxW="xl" py={[0, 2]} px={[0, 4]}>
          <Flex flexDirection={"row"} alignItems="center" color="grey.800">
            <Link href="/" p={[4, 0]}>
              <Logo alt={"Page d'accueil"} />
            </Link>

            <Box p={[1, 6]} flex="1">
              <Heading as="h6" textStyle="h6" fontSize="xl">
                Contrat d&apos;apprentissage dématérialisé{" "}
                <Tag marginBottom="1w" backgroundColor="bluefrance" color="white">
                  Alpha
                </Tag>
              </Heading>
            </Box>
          </Flex>
        </Container>
      </Container>
    </>
  );
};

export default Header;
