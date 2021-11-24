import React from "react";
import jwt from "jsonwebtoken";
import { Box, Container, Heading, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

import Layout from "./layout/Layout";
import { setTitle } from "../common/utils/pageUtils";
import { Breadcrumb } from "../common/components/Breadcrumb";

const METABASE_SITE_URL = `${process.env.REACT_APP_METABASE_URL ?? process.env.REACT_APP_BASE_URL}/metabase`;
const METABASE_SECRET_KEY = process.env.REACT_APP_METABASE_SECRET_KEY;

// eslint-disable-next-line no-unused-vars
const getIframeUrl = ({ id }) => {
  const payload = {
    resource: { dashboard: id },
    params: {},
    exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minutes
  };

  const token = jwt.sign(payload, METABASE_SECRET_KEY);
  return METABASE_SITE_URL + "/embed/dashboard/" + token + "#bordered=false&titled=false";
};

export default ({ match }) => {
  const dashboards = [
    {
      title: "Général",
      iframeURL: null, //getIframeUrl({ id: 2 }),
    },
  ];

  const title = "Statistiques Cerfa";
  setTitle(title);

  return (
    <Layout match={match}>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]}>
        <Container maxW="xl">
          <Breadcrumb pages={[{ title: "Accueil", to: "/" }, { title: title }]} />
          <Heading textStyle="h2" color="grey.800" mt={5}>
            {title}
          </Heading>

          <Tabs variant={"search"} mt={5} isLazy>
            <TabList bg="white">
              {dashboards.map(({ title }) => {
                return <Tab key={title}>{title}</Tab>;
              })}
            </TabList>
            <TabPanels>
              {dashboards.map(({ iframeURL, title }) => {
                return (
                  <TabPanel key={title}>
                    <iframe
                      src={iframeURL}
                      frameBorder="0"
                      style={{ height: "250vh", width: "100%" }}
                      title={`Statistiques Metabase - ${title}`}
                      allowtransparency={"true"}
                    />
                  </TabPanel>
                );
              })}
            </TabPanels>
          </Tabs>
        </Container>
      </Box>
    </Layout>
  );
};
