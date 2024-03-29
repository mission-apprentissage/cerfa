import React, { useState, useEffect, useRef, createContext } from "react";
import { useRouter } from "next/router";
import { Box, Text, Spinner } from "@chakra-ui/react";
import { _get, _post, _put } from "../../common/httpClient";
import useAuth from "../../hooks/useAuth";
import { Cgu, cguVersion } from "../legal/Cgu";
import AcknowledgeModal from "../../components/Modals/AcknowledgeModal";
import { anonymous } from "../../common/anonymous";
import { emitter } from "../../common/emitter";
import { isUserAdmin } from "../../common/utils/rolesUtils";

const AccountWrapper = ({ children }) => {
  let [auth] = useAuth();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (auth.sub !== "anonymous") {
        if (!auth.confirmed) {
          if (router.pathname !== "/auth/en-attente-confirmation") {
            router.push(`/auth/en-attente-confirmation`);
          }
        } else {
          if (auth.account_status === "FORCE_RESET_PASSWORD" && router.pathname !== "/auth/reset-password") {
            let { token } = await _post("/api/v1/password/forgotten-password", { username: auth.sub, noEmail: true });
            router.push(`/auth/reset-password?passwordToken=${token}`);
          } else if (auth.account_status === "FORCE_COMPLETE_PROFILE" && router.asPath !== "/auth/finalize") {
            router.push(`/auth/finalize`);
          } else {
            const data = await _get("/api/v1/maintenanceMessage");
            const [maintenance] = data.filter((d) => d.context === "maintenance" && d.enabled);
            if (maintenance && router.asPath !== "/en-maintenance" && !isUserAdmin(auth)) {
              router.push(`/en-maintenance`);
            }
          }
        }
      }
    })();
  }, [auth, router]);

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
                Merci de lire attentivement les conditions générales d&apos;utilisation avant de les accepter.
              </Text>
            )}
            {auth.cgu && (
              <Text fontSize="1.1rem" fontWeight="bold">
                Nos conditions générales d&apos;utilisation ont changé depuis votre dernières visite. ({auth.cgu} -&gt;{" "}
                {cguVersion()}) <br />
                <br />
                Merci de lire attentivement les conditions générales d&apos;utilisation avant de les accepter.
              </Text>
            )}
          </Box>
          <Box borderColor={"dgalt"} borderWidth={1} overflowY="scroll" px={8} py={4} h="30vh" ref={cguContainer}>
            <Cgu
              onLoad={async () => {
                // eslint-disable-next-line no-undef
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

export const AuthenticationContext = createContext({});

const UserWrapper = ({ children, ssrAuth }) => {
  const [token, setToken] = useState();
  const [auth, setAuth] = useState(ssrAuth ?? anonymous);
  const [isLoading, setIsLoading] = useState(!ssrAuth);

  useEffect(() => {
    async function getUser() {
      try {
        let user = ssrAuth ?? (await _get("/api/v1/authentified/current"));
        if (user && user.loggedIn) {
          setAuth(user);
        }
      } catch (error) {
        setAuth(anonymous);
      }
      setIsLoading(false);
    }
    if (!ssrAuth) {
      getUser();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = (response) => {
      if (response.status === 401) {
        //Auto logout user when token is invalid
        setAuth(anonymous);
      }
    };
    emitter.on("http:error", handler);
    return () => emitter.off("http:error", handler);
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <AuthenticationContext.Provider value={{ auth, token, setAuth, setToken }}>
      <AccountWrapper>
        <ForceAcceptCGU>{children}</ForceAcceptCGU>
      </AccountWrapper>
    </AuthenticationContext.Provider>
  );
};

export default UserWrapper;
