import React, { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom";
import useAuth from "./common/hooks/useAuth";
import { _post, _get, _put } from "./common/httpClient";
import ScrollToTop from "./common/components/ScrollToTop";
import PrivateRoute from "./common/components/PrivateRoute";
import { QueryClient, QueryClientProvider } from "react-query";
import { Box, Text } from "@chakra-ui/react";
import { hasPageAccessTo } from "./common/utils/rolesUtils";
import { MentionsLegalesPage, MentionsLegales, cguVersion } from "./pages/legal/MentionsLegales";
import AcknowledgeModal from "./common/components/Modals/AcknowledgeModal";

const HomePage = lazy(() => import("./pages/HomePage"));

const AuthPage = lazy(() => import("./pages/auth/AuthPage"));
const WaitingConfirmationPage = lazy(() => import("./pages/auth/WaitingConfirmationPage"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));
const ForgottenPasswordPage = lazy(() => import("./pages/auth/ForgottenPasswordPage"));

const ProfilePage = lazy(() => import("./pages/Profile/ProfilePage"));
const WorkspacePage = lazy(() => import("./pages/Workspace/WorkspacePage"));
const DossierPage = lazy(() => import("./pages/Dossier/DossierPage"));
const SharedPage = lazy(() => import("./pages/SharedPage"));
const StatsPage = lazy(() => import("./pages/StatsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const Users = lazy(() => import("./pages/admin/Users"));
const Roles = lazy(() => import("./pages/admin/Roles"));
const Maintenance = lazy(() => import("./pages/admin/Maintenance"));
const Support = lazy(() => import("./pages/legal/Support"));
const Cookies = lazy(() => import("./pages/legal/Cookies"));
const DonneesPersonnelles = lazy(() => import("./pages/legal/DonneesPersonnelles"));
const Accessibilite = lazy(() => import("./pages/legal/Accessibilite"));

const AccountWrapper = ({ children }) => {
  let [auth] = useAuth();
  let history = useHistory();

  useEffect(() => {
    (async () => {
      if (auth.sub !== "anonymous") {
        if (!auth.confirmed) {
          history.push(`/en-attente-confirmation`);
        } else {
          if (auth.account_status === "FORCE_RESET_PASSWORD") {
            let { token } = await _post("/api/v1/password/forgotten-password?noEmail=true", { username: auth.sub });
            history.push(`/reset-password?passwordToken=${token}`);
          }
        }
      }
    })();
  }, [auth, history]);

  return <>{children}</>;
};

const ForceCompleteProfile = ({ children }) => {
  let [auth] = useAuth();
  let history = useHistory();

  useEffect(() => {
    (async () => {
      if (auth.sub !== "anonymous") {
        if (auth.confirmed) {
          if (auth.account_status === "FORCE_COMPLETE_PROFILE") {
            history.push(`/auth/finalize`);
          }
        }
      }
    })();
  }, [auth, history]);

  return <>{children}</>;
};

const ForceAcceptCGU = ({ children }) => {
  let [auth, setAuth] = useAuth();

  console.log(auth);

  const onAcceptCguClicked = async (dossier) => {
    try {
      let user = await _put(`/api/v1/profile/acceptCgu`, {
        cguVersion: cguVersion(),
      });
      setAuth(user);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {auth.sub !== "anonymous" && auth.confirmed && auth.account_status === "CONFIRMED" && (
        <AcknowledgeModal
          title="Condition générale d'utilisation"
          acknowledgeText="Accepter"
          isOpen={auth.cgu !== cguVersion()}
          onAcknowledgement={onAcceptCguClicked}
          canBeClosed={false}
          bgOverlay="rgba(0, 0, 0, 0.28)"
        >
          <Text fontSize="1.3rem" fontWeight="bold">
            Nouvelle version => {cguVersion()}
          </Text>
          <Box borderColor={"dgalt"} borderWidth={1} overflowY="scroll" px={8} py={4} h="30vh">
            <MentionsLegales />
          </Box>
        </AcknowledgeModal>
      )}
      {children}
    </>
  );
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
            <AccountWrapper>
              <ForceAcceptCGU>
                <ScrollToTop />
                <Switch>
                  {/* PUBLIC PAGES */}
                  <Route exact path="/" component={HomePage} />

                  <Route exact path="/auth/:slug" component={AuthPage} />
                  <Route exact path="/en-attente-confirmation" component={WaitingConfirmationPage} />
                  <Route exact path="/reset-password" component={ResetPasswordPage} />
                  <Route exact path="/forgotten-password" component={ForgottenPasswordPage} />

                  <Route exact path="/stats" component={StatsPage} />
                  <Route exact path="/support" component={Support} />
                  <Route exact path="/support/:id" component={Support} />
                  <Route exact path="/cookies" component={Cookies} />
                  <Route exact path="/donnees-personnelles" component={DonneesPersonnelles} />
                  <Route exact path="/mentions-legales" component={MentionsLegalesPage} />
                  <Route exact path="/accessibilite" component={Accessibilite} />

                  {/* PRIVATE PAGES */}

                  <ForceCompleteProfile>
                    <PrivateRoute path="/mon-compte" component={ProfilePage} />

                    {/* Mon espaces pages */}
                    <PrivateRoute path="/mon-espace" component={WorkspacePage} />
                    {/*  Espace partagé  pages */}
                    <PrivateRoute exact path="/partages-avec-moi" component={SharedPage} />
                    <PrivateRoute exact path="/partages-avec-moi/dossiers/:id/:step" component={DossierPage} />
                    <PrivateRoute path="/partages-avec-moi/espaces/:workspaceId" component={WorkspacePage} />

                    {/* PRIVATE ADMIN PAGES */}
                    {auth && hasPageAccessTo(auth, "admin/page_gestion_utilisateurs") && (
                      <PrivateRoute exact path="/admin/users" component={Users} />
                    )}
                    {auth && hasPageAccessTo(auth, "admin/page_gestion_roles") && (
                      <PrivateRoute exact path="/admin/roles" component={Roles} />
                    )}
                    {auth && hasPageAccessTo(auth, "admin/page_message_maintenance") && (
                      <PrivateRoute exact path="/admin/maintenance" component={Maintenance} />
                    )}
                  </ForceCompleteProfile>

                  {/* Fallback */}
                  <Route component={NotFoundPage} />
                </Switch>
              </ForceAcceptCGU>
            </AccountWrapper>
          </Suspense>
        </Router>
      </div>
    </QueryClientProvider>
  );
};
