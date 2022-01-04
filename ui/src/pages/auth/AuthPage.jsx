import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Container,
  HStack,
  Heading,
  Text,
  forwardRef,
  chakra,
  Button,
  // useDisclosure,
  Link,
} from "@chakra-ui/react";
import Layout from "../layout/Layout";
import { Breadcrumb } from "../../common/components/Breadcrumb";
import { setTitle } from "../../common/utils/pageUtils";
import { _get } from "../../common/httpClient";
import { ExternalLinkLine } from "../../theme/components/icons";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import Login from "./components/Login";
import Register from "./components/Register";
import Finalize from "./components/Finalize";
import Confirmed from "./components/Confirmed";
// import { PdsModal } from "./components/PdsModal";

const MotionBox = motion(
  forwardRef((props, ref) => {
    return <chakra.div ref={ref} {...props} />;
  })
);

const FormBoxMotion = ({ children, isOpen, ...rest }) => {
  return (
    <MotionBox
      as="div"
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={{
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: "-120%" },
      }}
      exit="closed"
      transition={{
        duration: 0.7,
        ease: "easeInOut",
      }}
      display="flex"
      bg="galt"
      flexDirection="column"
      w="100%"
      h="100%"
      py={[4, 12]}
      px={[1, 1, 8, 10]}
      {...rest}
    >
      {children}
    </MotionBox>
  );
};

const AuthPage = () => {
  let { slug } = useParams();
  // const pdsModal = useDisclosure();
  const [linkToPds, setLinkToPds] = useState(null);

  useEffect(() => {
    const run = async () => {
      const data = await _get(`/api/v1/pds/getUrl`);
      setLinkToPds(data.authorizationUrl);
    };
    run();
  }, []);

  const title = "Connexion";
  setTitle(title);

  if (slug !== "connexion" && slug !== "inscription" && slug !== "confirmation" && slug !== "finalize") {
    return null; // TODO errorBondary
  }

  return (
    <Layout>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E">
        <Container maxW="xl">
          <Breadcrumb pages={[{ title: "Accueil", to: "/" }, { title: title }]} />
        </Container>
      </Box>
      <Box w="100%" py={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E" minH="55vh">
        <Container maxW="xl">
          {slug === "confirmation" && <Confirmed />}
          {slug === "finalize" && (
            <Box bg="galt" py={[4, 12]} px={[1, 1, 8, 10]}>
              <Finalize />
            </Box>
          )}
          {(slug === "connexion" || slug === "inscription") && (
            <HStack w="full" spacing={10} minH="55vh" maxW="xl" alignItems="baseline">
              <Flex
                flexDirection="column"
                bg="bluefrance"
                color="white"
                w="50%"
                h="55vh"
                py={[4, 12]}
                px={[1, 1, 8, 10]}
                zIndex={1}
              >
                <Heading as="h2" fontSize="1.8rem" lineHeight="1.5">
                  Vous êtes
                  <br />
                  une Entreprise ou un CFA ?
                </Heading>
                <Text mt={8}>
                  {slug === "connexion" ? "Connectez-vous" : "Inscrivez-vous"} pour accéder au service de contrat
                  d'apprentissage dématérialisé.
                </Text>
                <Button variant="secondary" type="submit" mt={12} as={Link} href={linkToPds} isExternal>
                  S'identifier via Portail de service{" "}
                  <ExternalLinkLine w={"0.75rem"} h={"0.75rem"} ml={"0.25rem"} mt={"0.125rem"} />
                </Button>
                {/* <Button variant="secondary" type="submit" mt={12} onClick={pdsModal.onOpen}>
                  S'identifier via Portail de service
                </Button>

                <PdsModal isOpen={pdsModal.isOpen} onClose={pdsModal.onClose} /> */}
              </Flex>

              <Box w="50%" h="55vh">
                <FormBoxMotion isOpen={slug === "inscription"}>
                  <Heading as="h1" fontSize="1.8rem" lineHeight="1.5">
                    Inscription
                  </Heading>
                  <Box flexGrow={1}>
                    <Register />
                  </Box>
                </FormBoxMotion>
                <FormBoxMotion isOpen={slug === "connexion"} top="-100%" position="relative">
                  <Heading as="h1" fontSize="1.8rem" lineHeight="1.5" mb={4}>
                    Connexion
                  </Heading>
                  <Box flexGrow={1}>
                    <Login />
                  </Box>
                </FormBoxMotion>
              </Box>
            </HStack>
          )}
        </Container>
      </Box>
    </Layout>
  );
};

export default AuthPage;
