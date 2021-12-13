import React from "react";
import { Route, Redirect } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default ({ component, ...rest }) => {
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
};
