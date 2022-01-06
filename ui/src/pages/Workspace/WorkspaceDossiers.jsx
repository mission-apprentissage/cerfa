import React from "react";
import { useHistory } from "react-router-dom";
import { Flex, Box, Heading, Button, useDisclosure } from "@chakra-ui/react";
import { _get, _delete } from "../../common/httpClient";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { hasContextAccessTo } from "../../common/utils/rolesUtils";
import { workspacePathsAtom, workspaceTitlesAtom, workspaceAtom } from "../../common/hooks/workspaceAtoms";
import TableDossiers from "./components/TableDossiers";
import { Settings4Fill } from "../../theme/components/icons";
import WorkspaceParameterModal from "./WorkspaceModal";

function useWorkspaceDossiers() {
  const workspace = useRecoilValue(workspaceAtom);

  const {
    data: workspaceDossiers,
    isLoading,
    isFetching,
  } = useQuery("workspaceDossiers", () => _get(`/api/v1/workspace/dossiers?workspaceId=${workspace._id}`), {
    refetchOnWindowFocus: false,
  });

  return { isLoading: isFetching || isLoading, workspaceDossiers };
}

export const Header = () => {
  const workspaceParameterModal = useDisclosure();

  const history = useHistory();
  const paths = useRecoilValue(workspacePathsAtom);
  const titles = useRecoilValue(workspaceTitlesAtom);
  const workspace = useRecoilValue(workspaceAtom);
  const { isLoading, workspaceDossiers } = useWorkspaceDossiers();

  if (isLoading) return null;

  return (
    <Flex as="nav" align="center" justify="space-between" wrap="wrap" w="100%">
      <Box flexBasis={{ base: "auto", md: "auto" }}>
        <Flex>
          <Heading as="h1" flexGrow="1" fontSize={{ base: "sm", md: "1.5rem" }}>
            {titles.dossiers} ({workspaceDossiers.length}){" "}
          </Heading>
          <Box
            _hover={{ cursor: "pointer" }}
            w="20px"
            h="20px"
            color="bluefrance"
            onClick={workspaceParameterModal.onOpen}
            border="1px solid"
            borderColor={"bluefrance"}
            ml={3}
            p={3}
          >
            <Settings4Fill mt="-1.8rem" ml="-0.5rem" />
          </Box>
        </Flex>

        <WorkspaceParameterModal isOpen={workspaceParameterModal.isOpen} onClose={workspaceParameterModal.onClose} />
      </Box>
      {hasContextAccessTo(workspace, "wks/page_espace/page_dossiers/ajouter_nouveau_dossier") && (
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
      )}
    </Flex>
  );
};

export const Content = () => {
  const { isLoading, workspaceDossiers } = useWorkspaceDossiers();
  const paths = useRecoilValue(workspacePathsAtom);
  const workspace = useRecoilValue(workspaceAtom);

  const onDeleteClicked = async (dossier) => {
    if (hasContextAccessTo(workspace, "wks/page_espace/page_dossiers/supprimer_dossier")) {
      // eslint-disable-next-line no-restricted-globals
      const remove = confirm("Voulez-vous vraiment supprimer ce dossier ?");
      if (remove) {
        try {
          await _delete(`/api/v1/dossier/entity/${dossier._id}?dossierId=${dossier._id}`);
          window.location.reload();
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  if (isLoading) return null;

  return (
    <Box mt={8}>
      {workspaceDossiers.length > 0 && (
        <TableDossiers dossiers={workspaceDossiers} onDeleteClicked={onDeleteClicked} baseUrl={paths.dossiers} />
      )}
    </Box>
  );
};
