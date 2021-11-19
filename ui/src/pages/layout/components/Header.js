import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import useAuth from "../../../common/hooks/useAuth";
import { isUserAdmin, hasAccessTo } from "../../../common/utils/rolesUtils";
import { _get } from "../../../common/httpClient";
import { LockFill } from "../../../theme/components/icons/LockFill";
import { Logo } from "./Logo";
import AlertMessage from "./AlertMessage";
import { AccountFill, DownloadLine, InfoCircle } from "../../../theme/components/icons";

const Header = () => {
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
      <AlertMessage />
      <Container maxW={"full"} borderBottom={"1px solid"} borderColor={"grey.400"} px={[0, 4]}>
        <Container maxW="xl" py={[0, 2]} px={[0, 4]}>
          <Flex alignItems="center" color="grey.800">
            {/* Logo */}
            <Link as={NavLink} to="/" p={[4, 0]}>
              <Logo />
            </Link>

            <Box p={[1, 6]} flex="1">
              <Heading as="h6" textStyle="h6">
                Générateur de contrat publique d'apprentissage
              </Heading>
            </Box>
            {/* User Menu */}
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
                  <MenuGroup title="Administration">
                    {hasAccessTo(auth, "page_gestion_utilisateurs") && (
                      <MenuItem as={NavLink} to="/admin/users" icon={<AccountFill boxSize={4} />}>
                        Gestion des utilisateurs
                      </MenuItem>
                    )}
                    {hasAccessTo(auth, "page_gestion_roles") && (
                      <MenuItem as={NavLink} to="/admin/roles" icon={<AccountFill boxSize={4} />}>
                        Gestion des rôles
                      </MenuItem>
                    )}
                    {hasAccessTo(auth, "page_upload") && (
                      <MenuItem as={NavLink} to="/admin/upload" icon={<DownloadLine boxSize={4} />}>
                        Upload de fichiers
                      </MenuItem>
                    )}
                    {hasAccessTo(auth, "page_message_maintenance") && (
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
          </Flex>
        </Container>
      </Container>
    </>
  );
};

export default Header;
