import React from "react";
import NavLink from "next/link";
import { Box, Container, Flex, Heading, Link, Tag } from "@chakra-ui/react";

// import { Logo } from "./Logo";
import AlertMessage from "./AlertMessage";

const Header = () => {
  return (
    <>
      <AlertMessage />
      <Container maxW={"full"} borderBottom={"1px solid"} borderColor={"grey.400"} px={[0, 4]}>
        <Container maxW="xl" py={[0, 2]} px={[0, 4]}>
          <Flex alignItems="center" color="grey.800">
            {/* Logo */}
            <Link as={NavLink} href="/" p={[4, 0]}>
              {/* <Logo /> */}
              Logo
            </Link>

            <Box p={[1, 6]} flex="1">
              <Heading as="h6" textStyle="h6" fontSize="xl">
                Contrat d&apos;apprentissage dématérialisé pour les employeurs publics{" "}
                <Tag marginBottom="1w" backgroundColor="bluefrance" color="white">
                  beta
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
