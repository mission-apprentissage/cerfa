import { useAuthState, anonymous } from "../globalStates";

export default function useAuth() {
  let [auth, setAuth] = useAuthState();

  let setAuthFromToken = (user) => {
    if (!user) {
      setAuth(anonymous);
    } else {
      setAuth(user);
    }
  };

  return [auth, setAuthFromToken];
}
