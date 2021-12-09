import React from "react";
import { Box, Container, Heading, Flex, List, ListItem, Link, Divider } from "@chakra-ui/react";
import { NavLink, useLocation } from "react-router-dom";
import Layout from "../../layout/Layout";
import { Breadcrumb } from "../../../common/components/Breadcrumb";
import { setTitle } from "../../../common/utils/pageUtils";

import AccesEspace from "./AccesEspace";

const NavItem = ({ children, to = "/", sub, ...rest }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Link
      as={NavLink}
      to={to}
      variant="summary"
      w="full"
      display="inline-block"
      fontWeight={isActive ? "bold" : "nornal"}
      bg={isActive ? "grey.100" : "transparent"}
      borderBottom="1px solid"
      _hover={{ textDecoration: "none", color: "grey.800", bg: "grey.400" }}
      borderColor={isActive ? "bluefrance" : "transparent"}
      py={4}
    >
      {children}
    </Link>
  );
};

export default ({ match }) => {
  const title = "Paramètres";
  setTitle(title);

  return (
    <Layout match={match}>
      <Flex flexDirection="column" minH="60vh">
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
        <Box w="100%" px={[1, 1, 12, 24]} mt={5} flexGrow="1">
          <Container maxW="xl" minH="55vh">
            <Flex flexDirection={["column", "column", "column", "row", "row"]} minH="55vh">
              <Box minW="250px" bg="grey.200">
                <List w="full" px={0}>
                  <ListItem w="full" px={0}>
                    <NavItem to={"/mon-espace/parametres/gestion-acces"}>Gérer les accès</NavItem>
                  </ListItem>
                  <ListItem w="full">
                    <NavItem to={"/mon-espace/parametres/notifications"}> Notifications</NavItem>
                  </ListItem>
                </List>
              </Box>
              <Box px={[1, 5]} mt={[4, 4, 4, 0]} flexGrow="1">
                {match.params.sub === "gestion-acces" && <AccesEspace />}
                {match.params.sub === "notifications" && (
                  <>
                    <Heading textStyle="rf-text" fontWeight="700" p={2} as="h1" fontSize="1.4rem">
                      Notifications
                    </Heading>
                    <Divider borderWidth={1} mt={2} mb={4} />
                    <Box>En construction...</Box>
                  </>
                )}
              </Box>
            </Flex>
          </Container>
        </Box>
      </Flex>
    </Layout>
  );
};
