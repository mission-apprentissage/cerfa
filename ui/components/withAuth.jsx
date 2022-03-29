import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";
import { hasPageAccessTo } from "../common/utils/rolesUtils";

const withAuth = (Component, aclRef = null) => {
  const Auth = (props) => {
    const router = useRouter();
    let [auth] = useAuth();

    if (auth.sub === "anonymous") {
      router.push("/auth/connexion");
      return <></>;
    }

    if (!hasPageAccessTo(auth, aclRef)) {
      router.push("/auth/connexion");
      return <></>;
    }

    return <Component {...props} />;
  };

  return Auth;
};

export default withAuth;
