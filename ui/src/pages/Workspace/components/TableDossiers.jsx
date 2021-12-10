import React from "react";
import { Box, Text, Badge, Button, HStack, Link } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { prettyPrintDate } from "../../../common/utils/dateUtils";
import { Table } from "../../../common/components/Table";

export default ({ dossiers, onDeleteClicked, baseUrl = "/mon-espace/mes-dossiers" }) => {
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
          value: prettyPrintDate(m.lastModified),
        },
        Etat: {
          Header: "Statut",
          width: 60,
          value: null,
        },
        Supprimer: {
          Header: "",
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
        Supprimer: (value, i) => {
          // TODO has right to delete
          return (
            <Button
              variant="pill"
              color="tomato"
              borderRadius="5px"
              _hover={{ fontWeigth: "bold", bg: "redmarianne", color: "white" }}
              onClick={() => {
                onDeleteClicked(dossiers[i]);
              }}
              cursor="pointer"
              ml="2"
            >
              <Text display="block" px={2}>
                Supprimer
              </Text>
            </Button>
          );
        },
      }}
    />
  );
};
