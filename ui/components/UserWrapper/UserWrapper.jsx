import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Box, Text, Spinner } from "@chakra-ui/react";
import { _get, _post, _put } from "../../common/httpClient";
import useAuth from "../../hooks/useAuth";
import { Cgu, cguVersion } from "../legal/Cgu";
import AcknowledgeModal from "../../components/Modals/AcknowledgeModal";

const AccountWrapper = ({ children }) => {
  let [auth] = useAuth();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (auth.sub !== "anonymous") {
        if (!auth.confirmed) {
          router.push(`/en-attente-confirmation`);
        } else {
          if (auth.account_status === "FORCE_RESET_PASSWORD") {
            let { token } = await _post("/api/v1/password/forgotten-password?noEmail=true", { username: auth.sub });
            router.push(`/auth/reset-password?passwordToken=${token}`);
          } else if (auth.account_status === "FORCE_COMPLETE_PROFILE") {
            router.push(`/auth/finalize`);
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

const UserWrapper = ({ children }) => {
  let [, setAuth] = useAuth();

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
    return <Spinner />;
  }

  return (
    <>
      <AccountWrapper>
        <ForceAcceptCGU>{children}</ForceAcceptCGU>
      </AccountWrapper>
    </>
  );
};

export default UserWrapper;
