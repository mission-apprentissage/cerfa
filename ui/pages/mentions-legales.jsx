import React from "react";
import Head from "next/head";
import { Box, Container, Heading } from "@chakra-ui/react";
import { Page } from "../components/Page/Page";
import { Breadcrumb } from "../components/Breadcrumb/Breadcrumb";
import MentionsLegales from "../components/legal/MentionsLegales";
import { getAuthServerSideProps } from "../common/SSR/getAuthServerSideProps";

export const getServerSideProps = async (context) => ({ props: { ...(await getAuthServerSideProps(context)) } });

const MentionsLegalesPage = () => {
  const title = "Mentions Légales";
  return (
    <Page>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]}>
        <Container maxW="xl">
          <Breadcrumb pages={[{ title: "Accueil", to: "/" }, { title: title }]} />
          <Heading textStyle="h2" color="grey.800" mt={5}>
            {title}
          </Heading>
          <MentionsLegales />
        </Container>
      </Box>
    </Page>
  );
};

export default MentionsLegalesPage;
