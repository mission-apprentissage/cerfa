import { useTokenState } from "../globalStates";

export default function useToken() {
  let [token, setToken] = useTokenState();

  let setFromToken = (token) => {
    if (!token) {
      setToken(null);
    } else {
      setToken(token);
    }
  };

  return [token, setFromToken];
}
