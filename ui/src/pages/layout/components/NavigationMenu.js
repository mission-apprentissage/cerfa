import React, { useState } from "react";
import { NavLink, useLocation, useHistory } from "react-router-dom";
import {
  Box,
  Container,
  Flex,
  Link,
  Text,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Button,
} from "@chakra-ui/react";
import useAuth from "../../../common/hooks/useAuth";
import { isUserAdmin, hasAccessTo } from "../../../common/utils/rolesUtils";
import { MenuFill, Close, AccountFill, DownloadLine, InfoCircle, LockFill } from "../../../theme/components/icons";
import { _get } from "../../../common/httpClient";

const NavigationMenu = ({ isMyWorkspace, isSharedWithMe, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <NavBarContainer {...props}>
      <NavToggle toggle={toggle} isOpen={isOpen} />
      <NavLinks isOpen={isOpen} isMyWorkspace={isMyWorkspace} isSharedWithMe={isSharedWithMe} />
      <UserMenu />
    </NavBarContainer>
  );
};

const UserMenu = () => {
  let [auth, setAuth] = useAuth();
  let history = useHistory();

  let logout = async () => {
    const { loggedOut } = await _get("/api/v1/auth/logout");
    if (loggedOut) {
      setAuth(null);
      history.push("/");
    }
  };

  return (
    <>
      {auth?.sub === "anonymous" && (
        <Box>
          <Link as={NavLink} to="/login" variant="pill">
            <LockFill boxSize={3} mb={1} mr={2} />
            Connexion
          </Link>
        </Box>
      )}
      {auth?.sub !== "anonymous" && (
        <Menu placement="bottom">
          <MenuButton as={Button} variant="pill">
            <Flex>
              <AccountFill color={"bluefrance"} mt="0.3rem" boxSize={4} />
              <Box display={["none", "block"]} ml={2}>
                <Text color="bluefrance" textStyle="sm">
                  {auth.sub}{" "}
                  <Text color="grey.600" as="span">
                    ({isUserAdmin(auth) ? "admin" : "Utilisateur"})
                  </Text>
                </Text>
              </Box>
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuGroup title="Profile">
              {hasAccessTo(auth, "admin/page_gestion_utilisateurs") && (
                <MenuItem as={NavLink} to="/admin/users" icon={<AccountFill boxSize={4} />}>
                  Gestion des utilisateurs
                </MenuItem>
              )}
              {hasAccessTo(auth, "admin/page_gestion_roles") && (
                <MenuItem as={NavLink} to="/admin/roles" icon={<AccountFill boxSize={4} />}>
                  Gestion des rôles
                </MenuItem>
              )}
              {hasAccessTo(auth, "admin/page_upload") && (
                <MenuItem as={NavLink} to="/admin/upload" icon={<DownloadLine boxSize={4} />}>
                  Upload de fichiers
                </MenuItem>
              )}
              {hasAccessTo(auth, "admin/page_message_maintenance") && (
                <MenuItem as={NavLink} to="/admin/maintenance" icon={<InfoCircle boxSize={4} />}>
                  Message de maintenance
                </MenuItem>
              )}
            </MenuGroup>

            <MenuDivider />
            <MenuItem onClick={logout}>Déconnexion</MenuItem>
          </MenuList>
        </Menu>
      )}
    </>
  );
};

const NavToggle = ({ toggle, isOpen }) => {
  return (
    <Box display={{ base: "block", md: "none" }} onClick={toggle} py={4}>
      {isOpen ? <Close boxSize={8} /> : <MenuFill boxSize={8} />}
    </Box>
  );
};

const NavItem = ({ children, to = "/", isMyWorkspace, isSharedWithMe, ...rest }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Link
      p={4}
      as={NavLink}
      to={to}
      color={isActive || isMyWorkspace || isSharedWithMe ? "bluefrance" : "grey.800"}
      _hover={{ textDecoration: "none", color: "grey.800", bg: "grey.200" }}
      borderBottom="3px solid"
      borderColor={isActive || isMyWorkspace || isSharedWithMe ? "bluefrance" : "transparent"}
      bg={"transparent"}
    >
      <Text display="block" {...rest}>
        {children}
      </Text>
    </Link>
  );
};

const NavLinks = ({ isMyWorkspace, isSharedWithMe, isOpen }) => {
  let [auth] = useAuth();
  return (
    <Box display={{ base: isOpen ? "block" : "none", md: "block" }} flexBasis={{ base: "100%", md: "auto" }}>
      <Flex
        align="center"
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "row", "row", "row"]}
        pb={[8, 0]}
        textStyle="sm"
      >
        <NavItem to="/">Accueil</NavItem>
        {hasAccessTo(auth, "wks/page_espace") && (
          <NavItem to="/mon-espace/mes-dossiers" isMyWorkspace={isMyWorkspace}>
            Mon espace
          </NavItem>
        )}
        {hasAccessTo(auth, "wks/page_espace") && (
          <NavItem to="/partages-avec-moi" isSharedWithMe={isSharedWithMe}>
            Partagés avec moi
          </NavItem>
        )}
      </Flex>
    </Box>
  );
};

const NavBarContainer = ({ children, isMyWorkspace, ...props }) => {
  const boxProps = !isMyWorkspace
    ? {
        boxShadow: "md",
      }
    : {
        borderBottom: "1px solid",
        borderColor: "bluefrance",
      };
  return (
    <Box w="full" {...boxProps}>
      <Container maxW="xl">
        <Flex as="nav" align="center" justify="space-between" wrap="wrap" w="100%" {...props}>
          {children}
        </Flex>
      </Container>
    </Box>
  );
};

export default NavigationMenu;
