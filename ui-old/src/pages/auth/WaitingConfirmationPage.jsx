import { Spinner, HStack, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { setTitle } from "../../common/utils/pageUtils";

const WaitingConfirmationPage = () => {
  const title = `En attente de confirmation votre compte utilisateur`;
  setTitle(title);

  return (
    <Flex minH="50vh" justifyContent="start" mt="10" flexDirection="column">
      <HStack>
        <Spinner mr={3} />
        <Heading fontSize="1rem" fontFamily="Marianne" fontWeight="500" marginBottom="2w">
          En attente de confirmation votre compte utilisateur. Merci de vérifier vos emails.
        </Heading>
      </HStack>
    </Flex>
  );
};

export default WaitingConfirmationPage;
