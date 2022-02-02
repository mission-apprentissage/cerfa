import React from "react";
import { Box, Flex, Container, Heading, Text, forwardRef, chakra } from "@chakra-ui/react";
import Layout from "../layout/Layout";
import { Breadcrumb } from "../../common/components/Breadcrumb";
import { setTitle } from "../../common/utils/pageUtils";

import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import Login from "./components/Login";
import Register from "./components/Register";
import Finalize from "./components/Finalize";
import Confirmed from "./components/Confirmed";

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
      <Box
        w="100%"
        py={[4, 8]}
        px={[1, 1, 12, 24]}
        color="#1E1E1E"
        // minH="55vh"
      >
        <Container maxW="xl">
          {slug === "confirmation" && <Confirmed />}
          {slug === "finalize" && (
            <Box bg="galt" py={[4, 12]} px={[1, 1, 8, 10]}>
              <Finalize />
            </Box>
          )}
          {(slug === "connexion" || slug === "inscription") && (
            <Flex w="full" minH="67vh" maxW="xl">
              <Flex
                flexDirection="column"
                bg="bluefrance"
                color="white"
                flexGrow={1}
                flexShrink={1}
                flexBasis="50%"
                py={[4, 12]}
                px={[1, 1, 8, 10]}
                zIndex={1}
              >
                <Heading as="h2" fontSize="1.8rem" lineHeight="1.5">
                  Vous êtes
                  <br />
                  un Employeur ou un CFA ?
                </Heading>
                <Text mt={8}>
                  {slug === "connexion" ? "Connectez-vous" : "Inscrivez-vous"} pour accéder au service de contrat
                  d'apprentissage dématérialisé.
                </Text>
              </Flex>
              <Box flexGrow={1} flexShrink={1} flexBasis="50%" ml={10}>
                <FormBoxMotion isOpen={slug === "inscription"} display={slug === "connexion" ? "none" : "flex"}>
                  <Heading as="h1" fontSize="1.8rem" lineHeight="1.5">
                    Inscription
                  </Heading>
                  <Box flexGrow={1}>
                    <Register />
                  </Box>
                </FormBoxMotion>
                <FormBoxMotion
                  isOpen={slug === "connexion"}
                  top="-100%"
                  display={slug === "inscription" ? "none" : "flex"}
                >
                  <Heading as="h1" fontSize="1.8rem" lineHeight="1.5" mb={4}>
                    Connexion
                  </Heading>
                  <Box flexGrow={1}>
                    <Login />
                  </Box>
                </FormBoxMotion>
              </Box>
            </Flex>
          )}
        </Container>
      </Box>
    </Layout>
  );
};

export default AuthPage;
