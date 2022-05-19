import React, { useState } from "react";
import {
  Box,
  Button,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { ArrowRightLine, Close, ExternalLinkLine } from "../../theme/components/icons";

export const HelpBox = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Box
        onClick={() => setModalOpen(true)}
        sx={{
          position: "fixed",
          background: "bluefrance",
          right: "40px",
          bottom: "40px",
          borderRadius: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 70,
          width: 70,
          color: "white",
          cursor: "pointer",
          boxShadow: "0 2px 10px 0 rgba(0, 0, 0, 0.4)",
        }}
      >
        <Box as="span" fontSize={26}>
          ?
        </Box>
      </Box>
      <Modal size="3xl" isOpen={modalOpen} onClose={() => setModalOpen(false)} autoFocus={false}>
        <ModalOverlay />
        <ModalContent bg="white" color="primaryText" borderRadius="none">
          <Button
            onClick={() => setModalOpen(false)}
            display={"flex"}
            alignSelf={"flex-end"}
            color="bluefrance"
            fontSize={"epsilon"}
            variant="unstyled"
            pt={10}
            pb={6}
            pr={10}
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
              Contacter l&apos;assistance
            </Text>
          </ModalHeader>
          <ModalBody pb={6}>
            <Box mb={5}>
              Avant de contacter l&apos;assistance, peut-être trouverez vous votre réponse dans la{" "}
              <Link href={"/assistance/faq"} textDecoration={"underline"} color="bluefrance">
                page FAQ
              </Link>
              .
            </Box>
            <Box mb={6}>
              Pour joindre l&apos;Assistance des applications du Ministère du Travail, de l&apos;Emploi et de
              l&apos;Insertion, vous pouvez renseigner le formulaire de contrat via le{" "}
              <Link
                isExternal
                textDecoration={"underline"}
                color="bluefrance"
                href={
                  "https://assistance.emploi.gouv.fr/jira/servicedesk/customer/portal/17/user/login?destination=portal%2F17"
                }
              >
                portail de l’assistance <ExternalLinkLine w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} ml={"0.125rem"} />
              </Link>{" "}
              ou composer le numéro vert ci-dessous du lundi au vendredi, de 9h à 18h, sans interruption.
            </Box>
            <Image mb={6} width={300} src={"/numero_vert.jpg"} alt="0 805 032 430" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
