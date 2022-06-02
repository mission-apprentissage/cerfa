import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";
import { hasPageAccessTo } from "../common/utils/rolesUtils";
import { useLinkToPds } from "../hooks/useLinkToPds";

const withAuth = (Component, aclRef = null) => {
  const Auth = (props) => {
    const router = useRouter();
    let [auth] = useAuth();
    const linkToPds = useLinkToPds();

    if (auth.sub === "anonymous") {
      if (typeof window !== "undefined" && linkToPds) {
        router.push(linkToPds);
      }
      return <></>;
    }

    if (aclRef && !hasPageAccessTo(auth, aclRef)) {
      if (typeof window !== "undefined" && linkToPds) {
        router.push(linkToPds);
      }
      return <></>;
    }

    return <Component {...props} />;
  };

  return Auth;
};

export default withAuth;
