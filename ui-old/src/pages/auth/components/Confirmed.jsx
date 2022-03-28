import { Box, Flex, Heading, HStack, Spinner } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import queryString from "query-string";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { _post } from "../../../common/httpClient";
import decodeJWT from "../../../common/utils/decodeJWT";
import { setTitle } from "../../../common/utils/pageUtils";

const Confirmed = () => {
  const location = useLocation();
  const { activationToken } = queryString.parse(location.search);
  const email = decodeJWT(activationToken).sub;
  const [error, setError] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const result = await _post("/api/v1/auth/activation", { activationToken });
        if (result.succeeded) {
          window.location.reload();
        }
      } catch (e) {
        console.error(e);
        setError(true);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const title = `Confirmation du compte pour l'utilisateur ${email}`;
  setTitle(title);

  return (
    <Flex minH="50vh" justifyContent="start" mt="10" flexDirection="column">
      {!error && (
        <HStack>
          <Spinner mr={3} />
          <Heading fontSize="1rem" fontFamily="Marianne" fontWeight="500" marginBottom="2w">
            {title}
          </Heading>
        </HStack>
      )}
      {error && (
        <HStack>
          <CloseIcon color="error" cursor="pointer" />
          <Heading fontSize="1rem" fontFamily="Marianne" fontWeight="500" marginBottom="2w" color="error">
            Le lien est expiré ou invalide, merci de prendre contact avec un administrateur en précisant votre adresse
            mail :
          </Heading>
          <Box>
            <a href="mailto:cerfa@apprentissage.beta.gouv.fr">cerfa@apprentissage.beta.gouv.fr</a>
          </Box>
        </HStack>
      )}
    </Flex>
  );
};

export default Confirmed;
