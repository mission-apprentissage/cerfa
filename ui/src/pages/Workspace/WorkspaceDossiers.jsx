import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Flex, Box, Heading, Button } from "@chakra-ui/react";
import { _get, _delete } from "../../common/httpClient";
import useAuth from "../../common/hooks/useAuth";
import TableDossiers from "./components/TableDossiers";

export default () => {
  let [auth] = useAuth();
  const history = useHistory();
  const [dossiers, setDossiers] = useState([]);

  useEffect(() => {
    const run = async () => {
      try {
        const ds = await _get(`/api/v1/dossier?workspaceId=${auth.workspaceId}`);
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

  return () => ({
    Header: (
      <Flex as="nav" align="center" justify="space-between" wrap="wrap" w="100%">
        <Box flexBasis={{ base: "auto", md: "auto" }}>
          <Heading as="h1" flexGrow="1" fontSize={{ base: "sm", md: "1.5rem" }}>
            Mes dossiers ({dossiers.length})
          </Heading>
        </Box>
        <Button
          size="md"
          fontSize={{ base: "sm", md: "md" }}
          p={{ base: 2, md: 4 }}
          h={{ base: 8, md: 10 }}
          onClick={() => {
            history.push(`/mon-espace/mes-dossiers/nouveau-dossier`);
          }}
          variant="primary"
        >
          Créer un nouveau dossier
        </Button>
      </Flex>
    ),
    Content: (
      <Box mt={8}>{dossiers.length > 0 && <TableDossiers dossiers={dossiers} onDeleteClicked={onDeleteClicked} />}</Box>
    ),
  });
};
