import { Flex, Box, Button, FormLabel, Link, Text, Heading } from "@chakra-ui/react";
import React from "react";
import NavLink from "next/link";
import Head from "next/head";
import { Page } from "../../components/Page/Page";

import { _get } from "../../common/httpClient";
import { getAuthServerSideProps } from "../../common/SSR/getAuthServerSideProps";
import { useLinkToPds } from "../../hooks/useLinkToPds";

export const getServerSideProps = async (context) => ({ props: { ...(await getAuthServerSideProps(context)) } });

const RegisterPage = () => {
  const linkToPds = useLinkToPds();

  return (
    <Page>
      <Head>
        <title>Inscription</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex maxW="4xl" margin="auto" flexDirection="column">
        <Heading as="h2" fontSize="2xl" mb={[3, 6]}>
          Je n&apos;ai pas encore de compte
        </Heading>
        <Flex
          minH="50"
          borderWidth="2px"
          borderStyle="dashed"
          borderColor={"grey.400"}
          rounded="md"
          w="full"
          maxW="xl"
          mt={4}
        >
          <Flex flex={1} p={12} justifyContent="center">
            <Flex flexDirection="column" justifyContent="center" ml={12}>
              <FormLabel mb={[3, 6]}>Mes Démarches Emploi et Formation</FormLabel>
              <Button variant="secondary" type="submit" as={Link} href={linkToPds} isExternal>
                S&apos;inscrire avec le Portail de Services
                {/* <ExternalLinkLine w={"0.75rem"} h={"0.75rem"} ml={"0.25rem"} mt={"0.125rem"} /> */}
              </Button>
              <Box mt={6}>
                <Text fontSize="1rem" color="mgalt" fontStyle="italic">
                  Vous allez être redirigé vers le Portail de Services.
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Flex>
        <Flex flexGrow={1}>
          <Text mt={8} fontSize="1rem">
            <Link href="/auth/connexion" as={NavLink} color="bluefrance" ml={3}>
              &gt; J&apos;ai déjà un compte
            </Link>
          </Text>
        </Flex>
      </Flex>
    </Page>
  );
};

export default RegisterPage;
