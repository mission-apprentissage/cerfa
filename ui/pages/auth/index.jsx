import React from "react";
import { Box, Flex, Container, Heading, Text, forwardRef, chakra } from "@chakra-ui/react";
import { Page } from "../../components/Page/Page";

import { motion } from "framer-motion";

import Login from "../../components/Auth/connexion";
import { getAuthServerSideProps } from "../../common/SSR/getAuthServerSideProps";

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
      pt={[4, 12]}
      pb={[4, 10]}
      px={[1, 1, 8, 10]}
      {...rest}
    >
      {children}
    </MotionBox>
  );
};

export const getServerSideProps = async (context) => ({ props: { ...(await getAuthServerSideProps(context)) } });

const AuthPage = () => {
  return (
    <Page>
      <Box w="100%" py={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E">
        <Container maxW="xl">
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
              <Text mt={8}></Text>
            </Flex>
            <Box flexGrow={1} flexShrink={1} flexBasis="50%" ml={10}>
              <FormBoxMotion isOpen={true} top="-100%" display={"flex"}>
                <Heading as="h1" fontSize="1.8rem" lineHeight="1.5" mb={4}>
                  Connexion
                </Heading>
                <Box flexGrow={1}>
                  <Login />
                </Box>
              </FormBoxMotion>
            </Box>
          </Flex>
        </Container>
      </Box>
    </Page>
  );
};

export default AuthPage;
