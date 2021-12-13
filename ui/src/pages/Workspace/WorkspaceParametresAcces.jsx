import React, { useCallback } from "react";
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
  useDisclosure,
} from "@chakra-ui/react";
import { DateTime } from "luxon";
import { useRecoilValue } from "recoil";
import { hasContextAccessTo } from "../../common/utils/rolesUtils";
import { workspaceAtom } from "../../common/hooks/workspaceAtoms";
import { _get, _post, _put, _delete } from "../../common/httpClient";
import { useQueries, useQueryClient, useMutation } from "react-query";
import { Table } from "../../common/components/Table";
import { InviteModal } from "./components/InviteModal";
import { Parametre } from "../../theme/components/icons";

function useWorkspaceParametresAcces() {
  const workspace = useRecoilValue(workspaceAtom);
  const [
    { data: workspaceContributors, isLoading: isLoadingContributors, isFetching: isFetchingContributors },
    { data: roles, isLoading: isLoadingRoles, isFetching: isFetchingRoles },
  ] = useQueries([
    {
      queryKey: ["wksContributors", 1],
      queryFn: () => _get(`/api/v1/workspace/contributors?workspaceId=${workspace._id}`),
      refetchOnWindowFocus: false,
    },
    {
      queryKey: ["roles", 2],
      queryFn: () => _get(`/api/v1/workspace/roles_list?workspaceId=${workspace._id}`),
      refetchOnWindowFocus: false,
    },
  ]);

  return {
    workspaceContributors,
    roles,
    isLoading: isLoadingContributors || isLoadingRoles || isFetchingRoles || isFetchingContributors,
  };
}

export const Header = () => {
  const queryClient = useQueryClient();
  const inviteModal = useDisclosure();
  const { workspaceContributors, roles, isLoading } = useWorkspaceParametresAcces();
  const workspace = useRecoilValue(workspaceAtom);

  const onAddContributor = useMutation(
    ({ userEmail, roleId, acl = [] }) => {
      return _post(`/api/v1/workspace/contributors`, {
        workspaceId: workspace._id,
        userEmail,
        roleId,
        acl,
      });
    },
    {
      onSuccess: () => queryClient.invalidateQueries("wksContributors"),
    }
  );

  if (isLoading) return null;

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
        onClick={inviteModal.onOpen}
        variant="primary"
      >
        + Ajouter un utilisateur
      </Button>
      <InviteModal
        title="Ajouter un utilisateur"
        size="md"
        roles={roles}
        isOpen={inviteModal.isOpen}
        onClose={inviteModal.onClose}
        onInvite={async ({ userEmail, roleId }) => {
          onAddContributor.mutate({ userEmail, roleId });
        }}
      />
    </Flex>
  );
};

export const Content = () => {
  const queryClient = useQueryClient();
  const { workspaceContributors, roles, isLoading } = useWorkspaceParametresAcces();
  const workspace = useRecoilValue(workspaceAtom);

  const onChangeContributorRole = useMutation(
    ({ userEmail, roleId, acl = [] }) => {
      return _put(`/api/v1/workspace/contributors`, {
        workspaceId: workspace._id,
        userEmail,
        roleId,
        acl,
      });
    },
    {
      onSuccess: () => queryClient.invalidateQueries("wksContributors"),
    }
  );

  const onDeleteClicked = useCallback(
    async (contributor) => {
      // eslint-disable-next-line no-restricted-globals
      const remove = confirm("Voulez-vous vraiment supprimer cet utilisateur ?");
      if (remove) {
        try {
          await _delete(
            `/api/v1/workspace/contributors?workspaceId=${workspace._id}&userEmail=${contributor.user.email.replace(
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
    [workspace._id]
  );

  if (isLoading) return null;

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
            value: "",
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
            const constrib = workspaceContributors[i];
            const hasAccount = constrib.user.prenom && constrib.user.nom;
            const username = hasAccount ? `${constrib.user.prenom} ${constrib.user.nom}` : "Invité non enregistré";
            return (
              <HStack>
                <Avatar size="sm" name={hasAccount ? username : ""} />
                <Text>{username}</Text>
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
                      } else {
                        onChangeContributorRole.mutate({ userEmail: workspaceContributors[i].user.email, roleId });
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
                      {hasContextAccessTo(
                        workspace,
                        "wks/page_espace/page_parametres/gestion_acces/supprimer_contributeur"
                      ) && (
                        <MenuItem
                          color="redmarianne"
                          onClick={async () => {
                            await onDeleteClicked(workspaceContributors[i]);
                          }}
                        >
                          Supprimer
                        </MenuItem>
                      )}
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
