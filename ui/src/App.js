import React, { useEffect, useState, lazy, Suspense, useRef } from "react";
import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom";
import useAuth from "./common/hooks/useAuth";
import { _post, _get, _put } from "./common/httpClient";
import ScrollToTop from "./common/components/ScrollToTop";
import PrivateRoute from "./common/components/PrivateRoute";
import { QueryClient, QueryClientProvider } from "react-query";
import { Box, Text } from "@chakra-ui/react";
import { hasPageAccessTo } from "./common/utils/rolesUtils";
import { CguPage, Cgu, cguVersion } from "./pages/legal/CGU";
import AcknowledgeModal from "./common/components/Modals/AcknowledgeModal";

const HomePage = lazy(() => import("./pages/HomePage"));

const AuthPage = lazy(() => import("./pages/auth/AuthPage"));
const WaitingConfirmationPage = lazy(() => import("./pages/auth/WaitingConfirmationPage"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));
const ForgottenPasswordPage = lazy(() => import("./pages/auth/ForgottenPasswordPage"));

const ProfilePage = lazy(() => import("./pages/Profile/ProfilePage"));
const WorkspacePage = lazy(() => import("./pages/Workspace/WorkspacePage"));
const StatsPage = lazy(() => import("./pages/StatsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const Users = lazy(() => import("./pages/admin/Users"));
const Roles = lazy(() => import("./pages/admin/Roles"));
const Maintenance = lazy(() => import("./pages/admin/Maintenance"));
const Support = lazy(() => import("./pages/legal/Support"));
const Cookies = lazy(() => import("./pages/legal/Cookies"));
const MentionsLegalesPage = lazy(() => import("./pages/legal/MentionsLegales"));
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
  const cguContainer = useRef(null);

  const onAcceptCguClicked = async () => {
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
          title="Conditions générales d'utilisation"
          acknowledgeText="Accepter"
          isOpen={auth.cgu !== cguVersion()}
          onAcknowledgement={onAcceptCguClicked}
          canBeClosed={false}
          bgOverlay="rgba(0, 0, 0, 0.28)"
        >
          <Box mb={3}>
            {!auth.cgu && (
              <Text fontSize="1.1rem" fontWeight="bold">
                Merci de lire attentivement les conditions générale d'utilisation avant de les accepter.
              </Text>
            )}
            {auth.cgu && (
              <Text fontSize="1.1rem" fontWeight="bold">
                Nos conditions générales d'utilisation ont changé depuis votre dernières visite. ({auth.cgu} ->{" "}
                {cguVersion()}) <br />
                <br />
                Merci de lire attentivement les conditions générales d'utilisation avant de les accepter.
              </Text>
            )}
          </Box>
          <Box borderColor={"dgalt"} borderWidth={1} overflowY="scroll" px={8} py={4} h="30vh" ref={cguContainer}>
            <Cgu
              onLoad={async () => {
                await new Promise((resolve) => setTimeout(resolve, 500));
                cguContainer.current?.scrollTo(0, 0);
              }}
            />
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
                  <Route exact path="/assistance" component={Support} />
                  <Route exact path="/assistance/:id" component={Support} />
                  <Route exact path="/cookies" component={Cookies} />
                  <Route exact path="/donnees-personnelles" component={DonneesPersonnelles} />
                  <Route exact path="/mentions-legales" component={MentionsLegalesPage} />
                  <Route exact path="/cgu" component={CguPage} />
                  <Route exact path="/accessibilite" component={Accessibilite} />

                  {/* PRIVATE PAGES */}
                  <Route path={["/admin", "/mon-compte", "/mes-dossiers"]}>
                    <ForceCompleteProfile>
                      <PrivateRoute path="/mon-compte" component={ProfilePage} />

                      {/* Mon espaces pages */}
                      <PrivateRoute path="/mes-dossiers" component={WorkspacePage} />

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
                  </Route>

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
