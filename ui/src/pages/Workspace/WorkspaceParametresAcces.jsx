import React, { useState, useEffect, useCallback } from "react";
import {
  Flex,
  Box,
  Heading,
  Button,
  Avatar,
  HStack,
  Text,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { DateTime } from "luxon";
import { _get, _put, _delete } from "../../common/httpClient";
import useAuth from "../../common/hooks/useAuth";
import { Table } from "../../common/components/Table";
import { Parametre } from "../../theme/components/icons";

function useWorkspaceParametresAcces() {
  let [auth] = useAuth();
  const [workspaceContributors, setWorkspaceContributors] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const run = async () => {
      try {
        const wksContributors = await _get(`/api/v1/workspace/contributors?workspaceId=${auth.workspaceId}`);
        setWorkspaceContributors(wksContributors);
        const rolesList = await _get(`/api/v1/workspace/roles_list?workspaceId=${auth.workspaceId}`);
        setRoles(rolesList);
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, [auth]);
  return { workspaceContributors, roles, setWorkspaceContributors };
}

export const Header = () => {
  const { workspaceContributors, roles } = useWorkspaceParametresAcces();

  if (!workspaceContributors.length && !roles.length) return null;

  return (
    <Flex as="nav" align="center" justify="space-between" wrap="wrap" w="100%">
      <Box flexBasis={{ base: "auto", md: "auto" }}>
        <Heading as="h1" flexGrow="1" fontSize={{ base: "sm", md: "1.5rem" }}>
          Utilisateurs ({workspaceContributors.length})
        </Heading>
      </Box>
      <Button
        size="md"
        fontSize={{ base: "sm", md: "md" }}
        p={{ base: 2, md: 4 }}
        h={{ base: 8, md: 10 }}
        onClick={() => {}}
        variant="primary"
      >
        + Ajouter un utilisateur
      </Button>
    </Flex>
  );
};

export const Content = () => {
  let [auth] = useAuth();
  const { workspaceContributors, roles, setWorkspaceContributors } = useWorkspaceParametresAcces();

  let onChangeRole = useCallback(
    async (userEmail, roleId, acl = []) => {
      try {
        let body = {
          workspaceId: auth.workspaceId,
          userEmail,
          roleId,
        };
        if (acl.length) {
          body.acl = acl;
        }
        const newContributors = await _put(`/api/v1/workspace/contributors`, body);
        setWorkspaceContributors(newContributors);
      } catch (e) {
        console.error(e);
      }
    },
    [auth.workspaceId, setWorkspaceContributors]
  );

  const onDeleteClicked = useCallback(
    async (contributor) => {
      // eslint-disable-next-line no-restricted-globals
      const remove = confirm("Voulez-vous vraiment supprimer cet utilisateur ?");
      if (remove) {
        try {
          await _delete(
            `/api/v1/workspace/contributors?workspaceId=${auth.workspaceId}&userEmail=${contributor.user.email.replace(
              "+",
              "%2B"
            )}&permId=${contributor.permission.permId}`
          );
          window.location.reload();
        } catch (e) {
          console.error(e);
        }
      }
    },
    [auth.workspaceId]
  );

  if (!workspaceContributors.length && !roles.length) return null;

  return (
    <Box mt={8}>
      <Table
        data={workspaceContributors.map((d) => ({
          CreatedAt: {
            Header: "Ajouté le",
            width: 50,
            value: d.permission.addedAt,
          },
          Username: {
            Header: "Utilisateur",
            width: 120,
            value: `${d.user.prenom} ${d.user.nom}`,
          },
          Email: {
            Header: "Courriel",
            width: 150,
            value: d.user.email,
          },
          Role: {
            Header: "Rôle pour l'espace",
            width: 80,
            value: d.permission.name,
          },
          Actions: {
            Header: "Actions",
            width: 40,
            value: null,
          },
        }))}
        components={{
          CreatedAt: (value, i) => {
            return <>{DateTime.fromISO(value).setLocale("fr-FR").toLocaleString()}</>;
          },
          Username: (value, i) => {
            return (
              <HStack>
                <Avatar size="sm" name={value} />
                <Text>{value}</Text>
              </HStack>
            );
          },
          Role: (value, i) => {
            return (
              <Box w="full">
                {workspaceContributors[i].owner && <Text as="i">Propriétaire</Text>}
                {!workspaceContributors[i].owner && (
                  <Select
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    onChange={async (e) => {
                      const roleId = e.target.value;
                      if (roleId === "custom") {
                        console.log("TODO");
                        //await onChangeRole(workspaceContributors[i].user.email, roleId);
                      } else {
                        await onChangeRole(workspaceContributors[i].user.email, roleId);
                      }
                    }}
                    iconColor={"gray.800"}
                    data-testid={"actions-select"}
                    value={
                      workspaceContributors[i].permission.name === "wks.custom"
                        ? "custom"
                        : workspaceContributors[i].permission._id
                    }
                  >
                    {roles.map((role, j) => {
                      return (
                        <option key={role._id + j} value={role.name === "wks.custom" ? "custom" : role._id}>
                          {role.title}
                        </option>
                      );
                    })}
                  </Select>
                )}
              </Box>
            );
          },
          Actions: (value, i) => {
            return (
              <>
                {!workspaceContributors[i].owner && (
                  <Menu>
                    <MenuButton as={Button} variant="unstyled" width="full" height="full">
                      <Parametre width={"2rem"} height={"1.2rem"} color="bluefrance" />
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        color="redmarianne"
                        onClick={async () => {
                          await onDeleteClicked(workspaceContributors[i]);
                        }}
                      >
                        Supprimer
                      </MenuItem>
                    </MenuList>
                  </Menu>
                )}
              </>
            );
          },
        }}
      />
    </Box>
  );
};
