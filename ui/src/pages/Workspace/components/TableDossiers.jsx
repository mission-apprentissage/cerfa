import React from "react";
import { Text, Button, HStack, Link, Menu, MenuButton, MenuList, MenuItem, Avatar, Center } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { DateTime } from "luxon";
import { Parametre } from "../../../theme/components/icons";
import { Table } from "../../../common/components/Table";
import { StatusBadge } from "../../../common/components/StatusBadge";
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
          width: 120,
          value: m.nom,
        },
        Contributors: {
          Header: "Contributeurs",
          width: 150,
          value: null,
        },
        Etat: {
          Header: "Statut",
          width: 90,
          value: null,
        },
        Last: {
          Header: "Modifié le",
          width: 50,
          value: DateTime.fromISO(m.lastModified).setLocale("fr-FR").toLocaleString(),
        },
        Actions: {
          Header: "Actions",
          width: 40,
          value: null,
        },
      }))}
      components={{
        Nom: (value, i) => {
          return (
            <Center>
              <Link
                as={NavLink}
                to={`${baseUrl}/${dossiers[i]._id}/cerfa`}
                _hover={{ textDecoration: "none", color: "grey.800", bg: "grey.300" }}
                w="full"
                h="full"
                textDecoration="none"
                display="flex"
                alignItems="center"
              >
                {value}
              </Link>
            </Center>
          );
        },
        Contributors: (value, i) => {
          return (
            <HStack flexDirection={{ md: "column", lg: "row" }}>
              {dossiers[i].contributeurs.map((constrib, j) => {
                const hasAccount = constrib.user.prenom && constrib.user.nom;
                const username = hasAccount ? `${constrib.user.prenom} ${constrib.user.nom}` : `Invité non vérifié`;
                return (
                  <HStack key={j}>
                    <Avatar size="sm" name={hasAccount ? username : ""} />
                    <Text>{username}</Text>
                  </HStack>
                );
              })}
            </HStack>
          );
        },
        Etat: (value, i) => {
          return (
            <Center>
              <StatusBadge status={dossiers[i].etat} />
            </Center>
          );
        },
        Last: (value, i) => {
          return <Center>{value}</Center>;
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
