import React, { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory } from "react-router-dom";
import useAuth from "./common/hooks/useAuth";
import { _post, _get } from "./common/httpClient";
import ScrollToTop from "./common/components/ScrollToTop";
import { QueryClient, QueryClientProvider } from "react-query";
import { hasAccessTo } from "./common/utils/rolesUtils";

const HomePage = lazy(() => import("./pages/HomePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ResetPasswordPage = lazy(() => import("./pages/password/ResetPasswordPage"));
const ForgottenPasswordPage = lazy(() => import("./pages/password/ForgottenPasswordPage"));
const Users = lazy(() => import("./pages/admin/Users"));
const Roles = lazy(() => import("./pages/admin/Roles"));
const UploadFiles = lazy(() => import("./pages/admin/UploadFiles"));
const Maintenance = lazy(() => import("./pages/admin/Maintenance"));

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
    async function run() {
      if (auth.sub !== "anonymous") {
        if (auth.account_status === "FORCE_RESET_PASSWORD") {
          let { token } = await _post("/api/v1/password/forgotten-password?noEmail=true", { username: auth.sub });
          history.push(`/reset-password?passwordToken=${token}`);
        }
      }
    }
    run();
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
                <PrivateRoute exact path="/" component={HomePage} />
                <Route exact path="/login" component={LoginPage} />
                <Route exact path="/reset-password" component={ResetPasswordPage} />
                <Route exact path="/forgotten-password" component={ForgottenPasswordPage} />

                {auth && hasAccessTo(auth, "page_gestion_utilisateurs") && (
                  <PrivateRoute exact path="/admin/users" component={Users} />
                )}
                {auth && hasAccessTo(auth, "page_gestion_roles") && (
                  <PrivateRoute exact path="/admin/roles" component={Roles} />
                )}
                {auth && hasAccessTo(auth, "page_message_maintenance") && (
                  <PrivateRoute exact path="/admin/maintenance" component={Maintenance} />
                )}
                {auth && hasAccessTo(auth, "page_upload") && (
                  <PrivateRoute exact path="/admin/upload" component={UploadFiles} />
                )}

                <Route component={NotFoundPage} />
              </Switch>
            </ResetPasswordWrapper>
          </Suspense>
        </Router>
      </div>
    </QueryClientProvider>
  );
};