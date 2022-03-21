import React from "react";
import { Route, Redirect } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// eslint-disable-next-line react/display-name
export default ({ component, ...rest }) => {
  let [auth] = useAuth();

  if (auth.sub !== "anonymous") {
    return <Route {...rest} component={component} />;
  }

  return (
    <Route
      {...rest}
      render={() => {
        return <Redirect to="/auth/connexion" />;
      }}
    />
  );
};
