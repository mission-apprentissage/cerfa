import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Flex, Box, Heading, Button } from "@chakra-ui/react";
import { _get, _delete } from "../../common/httpClient";
import useAuth from "../../common/hooks/useAuth";
import { useRecoilValue } from "recoil";
import { workspacePathsAtom, workspaceTitlesAtom } from "../../common/hooks/workspaceAtoms";
import TableDossiers from "./components/TableDossiers";

function useWorkspaceDossiers() {
  let [auth] = useAuth();
  const [workspaceDossiers, setWorkspaceDossiers] = useState([]);

  useEffect(() => {
    const run = async () => {
      try {
        const ds = await _get(`/api/v1/dossier?workspaceId=${auth.workspaceId}`);
        setWorkspaceDossiers(ds);
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, [auth]);
  return { workspaceDossiers };
}

export const Header = () => {
  const history = useHistory();
  // TODO workspaceId
  const paths = useRecoilValue(workspacePathsAtom);
  const titles = useRecoilValue(workspaceTitlesAtom);
  const { workspaceDossiers } = useWorkspaceDossiers();

  return (
    <Flex as="nav" align="center" justify="space-between" wrap="wrap" w="100%">
      <Box flexBasis={{ base: "auto", md: "auto" }}>
        <Heading as="h1" flexGrow="1" fontSize={{ base: "sm", md: "1.5rem" }}>
          {titles.dossiers} ({workspaceDossiers.length})
        </Heading>
      </Box>
      <Button
        size="md"
        fontSize={{ base: "sm", md: "md" }}
        p={{ base: 2, md: 4 }}
        h={{ base: 8, md: 10 }}
        onClick={() => {
          history.push(paths.nouveauDossier);
        }}
        variant="primary"
      >
        + {titles.nouveauDossier}
      </Button>
    </Flex>
  );
};

export const Content = () => {
  const { workspaceDossiers } = useWorkspaceDossiers();

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

  return (
    <Box mt={8}>
      {workspaceDossiers.length > 0 && <TableDossiers dossiers={workspaceDossiers} onDeleteClicked={onDeleteClicked} />}
    </Box>
  );
};
