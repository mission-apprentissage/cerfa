import { createGlobalState } from "react-hooks-global-state";
import { subscribeToHttpEvent } from "./emitter";

const anonymous = {
  sub: "anonymous",
  acl: [],
  permissions: {},
  roles: ["public"],
};

const { useGlobalState, getGlobalState, setGlobalState } = createGlobalState({
  auth: anonymous,
  token: null,
});

subscribeToHttpEvent("http:error", (response) => {
  if (response.status === 401) {
    //Auto logout user when token is invalid
    setGlobalState("auth", anonymous);
    setGlobalState("token", null);
  }
});

export const getAuth = () => getGlobalState("auth");
export const useAuthState = () => useGlobalState("auth");
export const setAuthState = (user) => setGlobalState("auth", user);

export const getToken = () => getGlobalState("token");
export const useTokenState = () => useGlobalState("token");
export const setTokenState = (token) => setGlobalState("token", token);

export { anonymous };
