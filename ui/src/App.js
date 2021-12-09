import React, { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory } from "react-router-dom";
import useAuth from "./common/hooks/useAuth";
import { _post, _get } from "./common/httpClient";
import ScrollToTop from "./common/components/ScrollToTop";
import { QueryClient, QueryClientProvider } from "react-query";
import { hasAccessTo } from "./common/utils/rolesUtils";

const HomePage = lazy(() => import("./pages/HomePage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const StatsPage = lazy(() => import("./pages/StatsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));
const ForgottenPasswordPage = lazy(() => import("./pages/auth/ForgottenPasswordPage"));
const Users = lazy(() => import("./pages/admin/Users"));
const Roles = lazy(() => import("./pages/admin/Roles"));
const UploadFiles = lazy(() => import("./pages/admin/UploadFiles"));
const Maintenance = lazy(() => import("./pages/admin/Maintenance"));
const Contact = lazy(() => import("./pages/legal/Contact"));
const Cookies = lazy(() => import("./pages/legal/Cookies"));
const DonneesPersonnelles = lazy(() => import("./pages/legal/DonneesPersonnelles"));
const MentionsLegales = lazy(() => import("./pages/legal/MentionsLegales"));
const Accessibilite = lazy(() => import("./pages/legal/Accessibilite"));
const NouveauDossier = lazy(() => import("./pages/Dossier/NouveauDossier"));
const Parametres = lazy(() => import("./pages/Dossier/ParametresEspace/Parametres"));
const Dossier = lazy(() => import("./pages/Dossier/Dossier"));

function PrivateRoute({ component, ...rest }) {
  let [auth] = useAuth();

  if (auth.sub !== "anonymous") {
    return <Route {...rest} component={component} />;
  }

  return (
    <Route
      {...rest}
      render={() => {
        return <Redirect to="/login" />;
      }}
    />
  );
}

const ResetPasswordWrapper = ({ children }) => {
  let [auth] = useAuth();
  let history = useHistory();

  useEffect(() => {
    (async () => {
      if (auth.sub !== "anonymous") {
        if (auth.account_status === "FORCE_RESET_PASSWORD") {
          let { token } = await _post("/api/v1/password/forgotten-password?noEmail=true", { username: auth.sub });
          history.push(`/reset-password?passwordToken=${token}`);
        }
      }
    })();
  }, [auth, history]);

  return <>{children}</>;
};

const queryClient = new QueryClient();

export default () => {
  let [auth, setAuth] = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      try {
        let user = await _get("/api/v1/authentified/current");
        if (user && user.loggedIn) {
          setAuth(user);
        }
      } catch (error) {
        setAuth(null);
      }
      setIsLoading(false);
    }
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return <div />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Router>
          <Suspense fallback={<div></div>}>
            <ResetPasswordWrapper>
              <ScrollToTop />
              <Switch>
                <Route exact path="/stats" component={StatsPage} />

                <Route exact path="/login" component={LoginPage} />
                <Route exact path="/reset-password" component={ResetPasswordPage} />
                <Route exact path="/forgotten-password" component={ForgottenPasswordPage} />

                <PrivateRoute exact path="/" component={HomePage} />

                {auth && hasAccessTo(auth, "wks/page_espace") && (
                  <PrivateRoute exact path="/mon-espace/mes-dossiers" component={DashboardPage} />
                )}
                <PrivateRoute exact path="/mon-espace/mes-dossiers/nouveau-dossier" component={NouveauDossier} />
                <PrivateRoute exact path="/mon-espace/mes-dossiers/:id/:step" component={Dossier} />
                <PrivateRoute exact path="/mon-espace/parametres/:sub" component={Parametres} />

                {auth && hasAccessTo(auth, "admin/page_gestion_utilisateurs") && (
                  <PrivateRoute exact path="/admin/users" component={Users} />
                )}
                {auth && hasAccessTo(auth, "admin/page_gestion_roles") && (
                  <PrivateRoute exact path="/admin/roles" component={Roles} />
                )}
                {auth && hasAccessTo(auth, "admin/page_message_maintenance") && (
                  <PrivateRoute exact path="/admin/maintenance" component={Maintenance} />
                )}
                {auth && hasAccessTo(auth, "page_upload") && (
                  <PrivateRoute exact path="/admin/upload" component={UploadFiles} />
                )}

                <Route exact path="/contact" component={Contact} />
                <Route exact path="/cookies" component={Cookies} />
                <Route exact path="/donnees-personnelles" component={DonneesPersonnelles} />
                <Route exact path="/mentions-legales" component={MentionsLegales} />
                <Route exact path="/accessibilite" component={Accessibilite} />

                <Route component={NotFoundPage} />
              </Switch>
            </ResetPasswordWrapper>
          </Suspense>
        </Router>
      </div>
    </QueryClientProvider>
  );
};
