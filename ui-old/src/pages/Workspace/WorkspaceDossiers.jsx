import React, { useEffect, useRef } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Flex, Box, Heading, Button, useDisclosure, Text } from "@chakra-ui/react";
import { _get, _delete } from "../../common/httpClient";
import { useQuery, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import { hasContextAccessTo } from "../../common/utils/rolesUtils";
import { workspacePathsAtom, workspaceTitlesAtom, workspaceAtom } from "../../common/hooks/workspaceAtoms";
import TableDossiers from "./components/TableDossiers";
import { Settings4Fill, AvatarPlus } from "../../theme/components/icons";
import ParameterModal from "./components/ParameterModal";
import { InviteModal } from "./components/InviteModal";

function useWorkspaceDossiers() {
  const workspace = useRecoilValue(workspaceAtom);
  const queryClient = useQueryClient();
  const prevWorkspaceId = useRef(null);

  useEffect(() => {
    if (prevWorkspaceId.current !== workspace._id) {
      prevWorkspaceId.current = workspace._id;
      queryClient.resetQueries("workspaceDossiers", { exact: true });
    }
  }, [queryClient, workspace._id]);

  const {
    data: workspaceDossiers,
    isLoading,
    isFetching,
  } = useQuery("workspaceDossiers", () => _get(`/api/v1/workspace/dossiers?workspaceId=${workspace._id}`), {
    refetchOnWindowFocus: false,
  });

  return { isLoading: isFetching || isLoading, workspaceDossiers };
}

export const Header = ({ isSharedWorkspace }) => {
  const history = useHistory();
  let { path } = useRouteMatch();
  const paths = useRecoilValue(workspacePathsAtom);
  const titles = useRecoilValue(workspaceTitlesAtom);
  const workspace = useRecoilValue(workspaceAtom);
  const { isLoading, workspaceDossiers } = useWorkspaceDossiers();
  const parameterModal = useDisclosure();

  const isParametresUtilisateursPages = path.includes(`${paths.base}/parametres/utilisateurs`);
  const parametresUtilisateurs = useDisclosure({ defaultIsOpen: isParametresUtilisateursPages });

  if (isLoading) return null;

  return (
    <Flex as="nav" align="center" justify="space-between" wrap="wrap" w="100%">
      <Box flexBasis={{ base: "auto", md: "auto" }} flexGrow="1">
        <Flex>
          <Heading as="h1" fontSize={{ base: "sm", md: "1.5rem" }}>
            {isSharedWorkspace ? workspace?.nom : "Mon espace"} ({workspaceDossiers.length}){" "}
          </Heading>
        </Flex>
      </Box>
      {hasContextAccessTo(workspace, "wks/page_espace/page_parametres") && (
        <>
          <Button size="md" onClick={parameterModal.onOpen} variant="secondary" mr={8}>
            <Settings4Fill />
            <Text as="span" ml={2}>
              Paramètres
            </Text>
          </Button>
          {/* {hasContextAccessTo(workspace, "wks/page_espace/page_parametres/gestion_notifications") */}
          <ParameterModal
            isOpen={parameterModal.isOpen}
            onClose={parameterModal.onClose}
            title={isSharedWorkspace ? `Paramètres de ${workspace?.nom}` : "Paramètres de votre espace"}
          />
        </>
      )}
      {hasContextAccessTo(workspace, "wks/page_espace/page_parametres/gestion_acces") && (
        <>
          <Button size="md" onClick={parametresUtilisateurs.onOpen} variant="secondary" mr={8}>
            <AvatarPlus />
            <Text as="span" ml={2}>
              Partager
            </Text>
          </Button>
          <InviteModal
            title={isSharedWorkspace ? `Partager l'accès à ${workspace?.nom}` : "Partager l'accès à votre espace"}
            size="md"
            isOpen={parametresUtilisateurs.isOpen}
            onClose={parametresUtilisateurs.onClose}
          />
        </>
      )}
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
