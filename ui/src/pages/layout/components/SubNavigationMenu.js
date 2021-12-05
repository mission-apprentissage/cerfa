import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Box, Container, Flex, Link, Text } from "@chakra-ui/react";
import useAuth from "../../../common/hooks/useAuth";
import { hasAccessTo } from "../../../common/utils/rolesUtils";
import { MenuFill, Close, Parametre, Folder } from "../../../theme/components/icons";

const SubNavigationMenu = ({ isMesDossiers, match, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <NavBarContainer {...props}>
      <NavToggle toggle={toggle} isOpen={isOpen} />
      <NavLinks isOpen={isOpen} match={match} />
    </NavBarContainer>
  );
};

const NavToggle = ({ toggle, isOpen }) => {
  return (
    <Box display={{ base: "block", md: "none" }} onClick={toggle} py={4}>
      {isOpen ? <Close boxSize={8} /> : <MenuFill boxSize={8} />}
    </Box>
  );
};

const NavItem = ({ children, to = "/", shoudBeActive, ...rest }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Link
      p={4}
      as={NavLink}
      to={to}
      color={isActive || shoudBeActive ? "bluefrance" : "grey.800"}
      _hover={{ textDecoration: "none", color: "grey.800", bg: "grey.200" }}
      borderBottom="3px solid"
      borderColor={isActive || shoudBeActive ? "bluefrance" : "transparent"}
    >
      <Text display="block" {...rest}>
        {children}
      </Text>
    </Link>
  );
};

const NavLinks = ({ isOpen, match }) => {
  let [auth] = useAuth();
  const isMesDossiers = match.path.includes("/mon-espace/mes-dossiers");
  const isParametres = match.path.includes("/mon-espace/parametres");

  return (
    <Box display={{ base: isOpen ? "block" : "none", md: "block" }} flexBasis={{ base: "100%", md: "auto" }}>
      <Flex
        align="center"
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "row", "row", "row"]}
        pb={[3, 0]}
        textStyle="sm"
      >
        {hasAccessTo(auth, "wks/page_espace") && (
          <NavItem to="/mon-espace/mes-dossiers" shoudBeActive={isMesDossiers}>
            <Folder w={"1rem"} h={"1rem"} mb={"0.125rem"} mr={2} />
            Mes Dossiers
          </NavItem>
        )}
        <NavItem to="/mon-espace/parametres/gestion-acces" shoudBeActive={isParametres}>
          <Parametre w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} mr={2} />
          Paramètres
        </NavItem>
        {/* <Link href="https://github.com/mission-apprentissage/cerfa/releases" mr={4} isExternal>
          Journal des modifications
        </Link> */}
      </Flex>
    </Box>
  );
};

const NavBarContainer = ({ children, ...props }) => {
  return (
    <Box w="full" boxShadow="md">
      <Container maxW="xl">
        <Flex as="nav" align="center" justify="space-between" wrap="wrap" w="100%" {...props}>
          {children}
        </Flex>
      </Container>
    </Box>
  );
};

export default SubNavigationMenu;
