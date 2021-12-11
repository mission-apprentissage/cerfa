import React, { lazy } from "react";
import { Switch, useRouteMatch } from "react-router-dom";
import { Box, Center, Container, Spinner } from "@chakra-ui/react";
import Layout from "../layout/Layout";
import PrivateRoute from "../../common/components/PrivateRoute";
import useAuth from "../../common/hooks/useAuth";
import { useWorkspace } from "../../common/hooks/useWorkspace";
import { hasAccessTo } from "../../common/utils/rolesUtils";
import { Breadcrumb } from "../../common/components/Breadcrumb";
import WorkspaceLayout from "./components/WorkspaceLayout";
import * as WorkspaceDossiers from "./WorkspaceDossiers";
import * as WorkspaceParametresAcces from "./WorkspaceParametresAcces";
import * as WorkspaceParametresNotifications from "./WorkspaceParametresNotifications";

const NouveauDossier = lazy(() => import("../Dossier/NouveauDossier"));
const Dossier = lazy(() => import("../Dossier/Dossier"));

export default () => {
  let [auth] = useAuth();
  let { path } = useRouteMatch();
  let { isloaded, isReloaded, breadcrumbDetails, paths } = useWorkspace(path);

  if (!isloaded) return null;

  return (
    <Layout>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E">
        <Container maxW="xl">
          <Breadcrumb pages={[{ title: "Accueil", to: "/" }, ...breadcrumbDetails]} loading={!isReloaded} />
        </Container>
      </Box>
      <Box w="100%" py={[4, 4]} px={[1, 1, 12, 24]} color="#1E1E1E">
        <Switch>
          {auth && hasAccessTo(auth, "wks/page_espace/page_dossiers") && (
            <PrivateRoute
              exact
              path={paths.dossiers}
              component={() => (
                <WorkspaceLayout
                  header={isReloaded && <WorkspaceDossiers.Header />}
                  content={
                    !isReloaded ? (
                      <Center>
                        <Spinner />
                      </Center>
                    ) : (
                      <WorkspaceDossiers.Content />
                    )
                  }
                />
              )}
            />
          )}
          {auth && hasAccessTo(auth, "wks/page_espace/page_parametres/gestion_acces") && (
            <PrivateRoute
              exact
              path={paths.parametresUtilisateurs}
              component={() => (
                <WorkspaceLayout
                  header={isReloaded && <WorkspaceParametresAcces.Header />}
                  content={
                    !isReloaded ? (
                      <Center>
                        <Spinner />
                      </Center>
                    ) : (
                      <WorkspaceParametresAcces.Content />
                    )
                  }
                />
              )}
            />
          )}
          {auth && hasAccessTo(auth, "wks/page_espace/page_parametres/gestion_notifications") && (
            <PrivateRoute
              exact
              path={paths.parametresNotifications}
              component={() => (
                <WorkspaceLayout
                  header={isReloaded && <WorkspaceParametresNotifications.Header />}
                  content={
                    !isReloaded ? (
                      <Center>
                        <Spinner />
                      </Center>
                    ) : (
                      <WorkspaceParametresNotifications.Content />
                    )
                  }
                />
              )}
            />
          )}

          {auth && hasAccessTo(auth, "wks/page_espace/page_dossiers") && (
            <PrivateRoute exact path={paths.dossier} component={() => <Dossier />} />
          )}
          {auth && hasAccessTo(auth, "wks/page_espace/page_dossiers/ajouter_nouveau_dossier") && (
            <PrivateRoute exact path={paths.nouveauDossier} component={NouveauDossier} />
          )}
        </Switch>
      </Box>
    </Layout>
  );
};
