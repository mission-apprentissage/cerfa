import { createGlobalState } from "react-hooks-global-state";
import { subscribeToHttpEvent } from "./emitter";

const anonymous = { sub: "anonymous", permissions: {} };

const { useGlobalState, getGlobalState, setGlobalState } = createGlobalState({
  auth: anonymous,
});

subscribeToHttpEvent("http:error", (response) => {
  if (response.status === 401) {
    //Auto logout user when token is invalid
    setGlobalState("auth", anonymous);
  }
});

export const getAuth = () => getGlobalState("auth");
export const useAuthState = () => useGlobalState("auth");
export const setAuthState = (user) => setGlobalState("auth", user);

export { anonymous };
