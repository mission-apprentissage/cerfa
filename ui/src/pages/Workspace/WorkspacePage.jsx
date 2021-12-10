import React, { lazy, useState, useMemo } from "react";
import { Switch, useRouteMatch, useLocation } from "react-router-dom";
import { Box, Container } from "@chakra-ui/react";
import Layout from "../layout/Layout";
import PrivateRoute from "../../common/components/PrivateRoute";
import useAuth from "../../common/hooks/useAuth";
import { hasAccessTo } from "../../common/utils/rolesUtils";
import { Breadcrumb } from "../../common/components/Breadcrumb";
import { setTitle as setTitlePage } from "../../common/utils/pageUtils";
import WorkspaceLayout from "./components/WorkspaceLayout";
import WorkspaceDossiers from "./WorkspaceDossiers";
import WorkspaceParametresAcces from "./WorkspaceParametresAcces";
import WorkspaceParametresNotifications from "./WorkspaceParametresNotifications";

const NouveauDossier = lazy(() => import("../Dossier/NouveauDossier"));
const Dossier = lazy(() => import("../Dossier/Dossier"));

export default () => {
  let { path } = useRouteMatch();
  const { pathname } = useLocation();
  let [auth] = useAuth();
  const [title, setTitle] = useState();

  const breadcrumbDetails = useMemo(() => {
    let bcDetails = [{ title: "Mes dossiers" }];
    switch (pathname) {
      case `${path}/parametres/utilisateurs`:
        setTitlePage("Paramètres Utilisateurs");
        bcDetails = [
          { title: "Mon espace", to: `${path}/mes-dossiers` },
          { title: "Paramètres" },
          { title: "Utilisateurs" },
        ];
        break;
      case `${path}/parametres/notifications`:
        setTitlePage("Paramètres Notifications");
        bcDetails = [
          { title: "Mon espace", to: `${path}/mes-dossiers` },
          { title: "Paramètres", to: `${path}/parametres/utilisateurs` },
          { title: "Notifications" },
        ];
        break;
      case `${path}/mes-dossiers`:
        setTitlePage("Mes dossiers");
        bcDetails = [{ title: "Mon espace" }, { title: "Mes dossiers" }];
        break;
      case `${path}/mes-dossiers/nouveau-dossier`:
        setTitlePage("Commencer un nouveau dossier");
        bcDetails = [
          { title: "Mon espace", to: `${path}/mes-dossiers` },
          { title: "Mes dossiers", to: `${path}/mes-dossiers` },
          { title: "Nouveau dossier" },
        ];
        break;
      default:
        setTitlePage("Mes dossiers");
        bcDetails = [{ title: "Mon espace" }, { title: "Mes dossiers" }];
        break;
    }

    // case of ${path}/mes-dossiers/:id/:step`
    const contratPath = new RegExp(`^${path}/mes-dossiers/[0-9A-Fa-f]{24}/[a-z]+$`);
    if (contratPath.test(pathname) && title) {
      setTitlePage(title);
      bcDetails = [
        { title: "Mon espace", to: `${path}/mes-dossiers` },
        { title: "Mes dossiers", to: `${path}/mes-dossiers` },
        { title: title },
      ];
    }
    return bcDetails;
  }, [path, pathname, title]);

  return (
    <Layout>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E">
        <Container maxW="xl">
          <Breadcrumb pages={[{ title: "Accueil", to: "/" }, ...breadcrumbDetails]} />
        </Container>
      </Box>
      <Box w="100%" py={[4, 4]} px={[1, 1, 12, 24]} color="#1E1E1E">
        <Switch>
          {auth && hasAccessTo(auth, "wks/page_espace/page_dossiers") && (
            <PrivateRoute
              exact
              path={`${path}/mes-dossiers`}
              component={() => <WorkspaceLayout>{WorkspaceDossiers()}</WorkspaceLayout>}
            />
          )}
          {auth && hasAccessTo(auth, "wks/page_espace/page_parametres") && (
            <PrivateRoute
              exact
              path={`${path}/parametres/utilisateurs`}
              component={() => <WorkspaceLayout>{WorkspaceParametresAcces()}</WorkspaceLayout>}
            />
          )}
          {auth && hasAccessTo(auth, "wks/page_espace/page_parametres") && (
            <PrivateRoute
              exact
              path={`${path}/parametres/notifications`}
              component={() => <WorkspaceLayout>{WorkspaceParametresNotifications()}</WorkspaceLayout>}
            />
          )}

          {auth && hasAccessTo(auth, "wks/page_espace/page_dossiers") && (
            <PrivateRoute
              exact
              path={`${path}/mes-dossiers/:id/:step`}
              component={() => (
                <Dossier
                  onLoaded={(data) => {
                    setTitle(data.title);
                  }}
                />
              )}
            />
          )}
          {auth && hasAccessTo(auth, "wks/page_espace/page_dossiers/ajouter_nouveau_dossier") && (
            <PrivateRoute exact path={`${path}/mes-dossiers/nouveau-dossier`} component={NouveauDossier} />
          )}
        </Switch>
      </Box>
    </Layout>
  );
};
