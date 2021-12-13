import React from "react";
import { Box, Text, Badge, Button, HStack, Link, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { DateTime } from "luxon";
import { Parametre } from "../../../theme/components/icons";
import { Table } from "../../../common/components/Table";
import { useRecoilValue } from "recoil";
import { hasContextAccessTo } from "../../../common/utils/rolesUtils";
import { workspaceAtom } from "../../../common/hooks/workspaceAtoms";

export default ({ dossiers, onDeleteClicked, baseUrl = "/mon-espace/mes-dossiers" }) => {
  const workspace = useRecoilValue(workspaceAtom);
  return (
    <Table
      data={dossiers.map((m) => ({
        Nom: {
          Header: "Nom",
          width: 150,
          value: m.nom,
        },
        Contenu: {
          Header: "",
          width: 150,
          value: null,
        },
        Last: {
          Header: "Modifié le",
          width: 90,
          value: DateTime.fromISO(m.lastModified).setLocale("fr-FR").toLocaleString(),
        },
        Etat: {
          Header: "Statut",
          width: 60,
          value: null,
        },
        Actions: {
          Header: "Actions",
          width: 50,
          value: null,
        },
      }))}
      components={{
        Nom: (value, i) => {
          return (
            <Link
              as={NavLink}
              to={`${baseUrl}/${dossiers[i]._id}/cerfa`}
              _hover={{ textDecoration: "none", color: "grey.800", bg: "grey.300" }}
              w="full"
              h="full"
              textDecoration="none"
            >
              <Text display="block">{value}</Text>
            </Link>
          );
        },
        Contenu: (value, i) => {
          return (
            <HStack>
              <NavLink to={`${baseUrl}/${dossiers[i]._id}/cerfa`}>
                <Badge variant="solid" textStyle="xs">
                  Cerfa
                </Badge>
              </NavLink>
              <NavLink to={`${baseUrl}/${dossiers[i]._id}/documents`}>
                <Badge variant="solid" textStyle="xs">
                  Justificatives
                </Badge>
              </NavLink>
              <NavLink to={`${baseUrl}/${dossiers[i]._id}/signatures`}>
                <Badge variant="solid" textStyle="xs">
                  Signatures
                </Badge>
              </NavLink>
              <NavLink to={`${baseUrl}/${dossiers[i]._id}/etat`}>
                <Badge variant="solid" textStyle="xs">
                  Etat
                </Badge>
              </NavLink>
            </HStack>
          );
        },
        Etat: (value, i) => {
          return (
            <Box>
              {dossiers[i].draft && (
                <Badge
                  variant="solid"
                  bg="orangedark.300"
                  borderRadius="16px"
                  color="grey.800"
                  textStyle="sm"
                  px="15px"
                >
                  Brouillon
                </Badge>
              )}
            </Box>
          );
        },
        Actions: (value, i) => {
          return (
            <Menu>
              <MenuButton as={Button} variant="unstyled" width="auto" height="full">
                <Parametre width={"2rem"} height={"1.2rem"} color="bluefrance" />
              </MenuButton>
              <MenuList>
                {hasContextAccessTo(workspace, "wks/page_espace/page_dossiers/supprimer_dossier") && (
                  <MenuItem
                    color="redmarianne"
                    onClick={async () => {
                      await onDeleteClicked(dossiers[i]);
                    }}
                  >
                    Supprimer
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          );
        },
      }}
    />
  );
};