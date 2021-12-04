import React, { useState, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Flex, Box, Container, Text, Badge, Heading, Button, HStack, Link } from "@chakra-ui/react";
import Layout from "./layout/Layout";
import { _get, _delete } from "../common/httpClient";
import useAuth from "../common/hooks/useAuth";
import { Breadcrumb } from "../common/components/Breadcrumb";
import { setTitle } from "../common/utils/pageUtils";
import { prettyPrintDate } from "../common/utils/dateUtils";
import { Table } from "../common/components/Table";

export default ({ match }) => {
  let [auth] = useAuth();
  const history = useHistory();
  const [dossiers, setDossiers] = useState([]);

  useEffect(() => {
    const run = async () => {
      try {
        const ds = await _get(`/api/v1/dossier?workspaceId=${auth.workspaceId}`);
        // console.log(ds);
        setDossiers(ds);
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, [auth]);

  const onDeleteClicked = async (dossier) => {
    // eslint-disable-next-line no-restricted-globals
    const remove = confirm("Voulez-vous vraiment supprimer ce dossier ?");
    if (remove) {
      try {
        await _delete(`/api/v1/dossier/${dossier._id}`);
        window.location.reload();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const title = "Mes dossiers";
  setTitle(title);

  return (
    <Layout match={match}>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E">
        <Container maxW="xl">
          <Breadcrumb
            pages={[
              { title: "Accueil", to: "/" },
              // { title: "Mon espace", to: "/mon-espace/mes-dossiers" },
              { title: title },
            ]}
          />
        </Container>
      </Box>
      <Box w="100%" py={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E">
        <Container maxW="xl">
          <Flex as="nav" align="center" justify="space-between" wrap="wrap" w="100%">
            <Box flexBasis={{ base: "100%", md: "auto" }}>
              <Heading as="h1" flexGrow="1">
                Mes dossiers
              </Heading>
            </Box>
            <Button
              size="md"
              onClick={() => {
                history.push(`/mon-espace/mes-dossiers/nouveau-dossier`);
              }}
              variant="primary"
            >
              Créer un nouveau dossier
            </Button>
          </Flex>

          <Box mt={8}>
            {dossiers.length > 0 && (
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
                        to={`/mon-espace/mes-dossiers/${dossiers[i]._id}/cerfa`}
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
                        <NavLink to={`/mon-espace/mes-dossiers/${dossiers[i]._id}/cerfa`}>
                          <Badge variant="solid" textStyle="xs">
                            Cerfa
                          </Badge>
                        </NavLink>
                        <NavLink to={`/mon-espace/mes-dossiers/${dossiers[i]._id}/documents`}>
                          <Badge variant="solid" textStyle="xs">
                            Justificatives
                          </Badge>
                        </NavLink>
                        <NavLink to={`/mon-espace/mes-dossiers/${dossiers[i]._id}/signatures`}>
                          <Badge variant="solid" textStyle="xs">
                            Signatures
                          </Badge>
                        </NavLink>
                        <NavLink to={`/mon-espace/mes-dossiers/${dossiers[i]._id}/etat`}>
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
            )}
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};
