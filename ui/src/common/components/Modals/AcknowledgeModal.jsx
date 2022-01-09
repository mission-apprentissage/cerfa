import React from "react";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Text } from "@chakra-ui/react";
import { ArrowRightLine, Close } from "../../../theme/components/icons";

export default ({
  isOpen,
  onClose,
  title,
  children,
  size = "4xl",
  acknowledgeText = "J'ai compris",
  onAcknowledgement = () => {},
}) => {
  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size={size}>
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
          p={10}
          fontWeight={400}
        >
          Fermer{" "}
          <Text as={"span"} ml={2}>
            <Close boxSize={4} />
          </Text>
        </Button>
        <ModalHeader>
          <ArrowRightLine mt="-0.5rem" />
          <Text as="span" ml="1rem" textStyle={"h4"}>
            {title}
          </Text>
        </ModalHeader>
        <ModalBody pb={6}>{children}</ModalBody>
        <ModalFooter>
          <Button
            variant="primary"
            onClick={() => {
              onAcknowledgement();
              onClose();
            }}
            type="submit"
          >
            {acknowledgeText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};