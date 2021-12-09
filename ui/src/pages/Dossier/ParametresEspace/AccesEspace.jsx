import React, { useEffect, useState, useCallback } from "react";
import { Flex, Box, Heading, Divider, Container, Button, Avatar, HStack, Text, Select } from "@chakra-ui/react";
import { _get, _put } from "../../../common/httpClient";
import useAuth from "../../../common/hooks/useAuth";
import { Table } from "../../../common/components/Table";
import { Parametre } from "../../../theme/components/icons";
import { DateTime } from "luxon";

export default () => {
  let [auth] = useAuth();
  const [workspaceContributors, setWorkspaceContributors] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const run = async () => {
      try {
        const wksContributors = await _get(`/api/v1/workspace/contributors?workspaceId=${auth.workspaceId}`);
        // console.log(wksContributors);
        setWorkspaceContributors(wksContributors);
        const rolesList = await _get(`/api/v1/workspace/roles_list?workspaceId=${auth.workspaceId}`);
        // console.log(rolesList);
        setRoles(rolesList);
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, [auth]);

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
        // console.log(newContributors);
        setWorkspaceContributors(newContributors);
      } catch (e) {
        console.error(e);
      }
    },
    [auth.workspaceId]
  );

  // const onDeleteClicked = async () => {
  //   // eslint-disable-next-line no-restricted-globals
  //   const remove = confirm("Voulez-vous vraiment supprimer cet utilisateur ?");
  //   if (remove) {
  //     try {
  //       // await _delete(`/api/v1/dossier/${dossier._id}`);
  //       window.location.reload();
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   }
  // };

  if (!workspaceContributors.length && !roles.length) return null;

  return (
    <Container maxW="xl">
      <Flex as="nav" align="center" justify="space-between" wrap="wrap" w="100%">
        <Box flexBasis={{ base: "100%", md: "auto" }}>
          <Heading fontWeight="700" p={2} as="h1" fontSize="1.4rem" flexGrow="1">
            Utilisateur(s) ({workspaceContributors.length})
          </Heading>
        </Box>
        <Button size="md" onClick={() => {}} variant="primary">
          + Ajouter un utilisateur
        </Button>
      </Flex>

      <Divider borderWidth={1} mt={2} mb={4} />
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
                    <Button
                      onClick={() => {
                        console.log("actions clicked");
                      }}
                      variant="unstyled"
                      width="full"
                      height="full"
                    >
                      <Parametre width={"2rem"} height={"1.2rem"} color="bluefrance" />
                    </Button>
                  )}
                </>
              );
            },
          }}
        />
      </Box>
    </Container>
  );
};
