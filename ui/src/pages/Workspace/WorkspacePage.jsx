import React, { lazy, useState } from "react";
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
  const [breadcrumbDetails, setBreadcrumbDetails] = useState([{ title: "Mon espace" }, { title: "Mes dossiers" }]);
  const [title, setTitle] = useState("Mes dossiers");
  const [onLeave, setOnLeave] = useState();

  // let title = "Mes dossiers";
  // let breadcrumbDetails = [{ title: title }];
  // switch (pathname) {
  //   case `${path}/parametres/utilisateurs`:
  //     title = "Paramètres Utilisateurs";
  //     breadcrumbDetails = [
  //       { title: "Mon espace", to: `${path}/mes-dossiers` },
  //       { title: "Paramètres" },
  //       { title: "Utilisateurs" },
  //     ];
  //     break;
  //   case `${path}/parametres/notifications`:
  //     title = "Paramètres Notifications";
  //     breadcrumbDetails = [
  //       { title: "Mon espace", to: `${path}/mes-dossiers` },
  //       { title: "Paramètres", to: `${path}/parametres/utilisateurs` },
  //       { title: "Notifications" },
  //     ];
  //     break;
  //   case `${path}/mes-dossiers/nouveau-dossier`:
  //     title = "Commencer un nouveau dossier";
  //     breadcrumbDetails = [
  //       { title: "Mon espace", to: `${path}/mes-dossiers` },
  //       { title: "Mes dossiers", to: `${path}/mes-dossiers` },
  //       { title: "Nouveau dossier" },
  //     ];
  //     break;
  //   case `${path}/mes-dossiers`:
  //   default:
  //     title = "Mes dossiers";
  //     breadcrumbDetails = [{ title: "Mon espace" }, { title: title }];
  //     break;
  // }

  const onDossierPageLoaded = (data) => {
    console.log(data);
    setTitlePage(data.title);
    setOnLeave(data.onLeave);
  };

  setTitlePage(title);

  return (
    <Layout onLeave={onLeave}>
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
              component={Dossier}
              onLoaded={onDossierPageLoaded}
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
