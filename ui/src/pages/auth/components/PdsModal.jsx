import React, { useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { ArrowRightLine, Close } from "../../../theme/components/icons";
import { _get } from "../../../common/httpClient";

const PdsModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    const run = async () => {
      const data = await _get(`/api/v1/pds/discover`);
      console.log(data);
    };
    run();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      size="4xl"
    >
      <ModalOverlay />
      <ModalContent bg="white" color="primaryText" borderRadius="none">
        <Button
          display={"flex"}
          alignSelf={"flex-end"}
          color="bluefrance"
          fontSize={"epsilon"}
          onClick={() => {
            onClose();
          }}
          variant="unstyled"
          p={8}
          fontWeight={400}
        >
          Fermer{" "}
          <Text as={"span"} ml={2}>
            <Close boxSize={4} />
          </Text>
        </Button>
        <ModalHeader px={[4, 8]} pt={1} pb={[3, 6]}>
          <Heading as="h2" fontSize="1.7rem">
            <Flex>
              <Text as={"span"}>
                <ArrowRightLine boxSize={26} />
              </Text>
              <Text as={"span"} ml={4}>
                Connexion via le Portail de service
              </Text>
            </Flex>
          </Heading>
        </ModalHeader>
        <ModalBody p={0}>
          <Box px={[4, 8]} mb={5}>
            {/* <iframe
              src="/api/v1/pds/discover"
              frameBorder="0"
              style={{ height: "50vh", width: "100%" }}
              title={`Mire de connexion`}
              allowtransparency={"true"}
            /> */}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export { PdsModal };
