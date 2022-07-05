import React from "react";
import jwt from "jsonwebtoken";
import { Heading, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

import Head from "next/head";
import { Page } from "../components/Page/Page";
import { Breadcrumb } from "../components/Breadcrumb/Breadcrumb";
import { getAuthServerSideProps } from "../common/SSR/getAuthServerSideProps";

const METABASE_SITE_URL = `${process.env.NEXT_PUBLIC_METABASE_URL ?? process.env.NEXT_PUBLIC_BASE_URL}/metabase`;
const METABASE_SECRET_KEY = process.env.NEXT_PUBLIC_METABASE_SECRET_KEY;

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

export const getServerSideProps = async (context) => ({ props: { ...(await getAuthServerSideProps(context)) } });

const stats = () => {
  const dashboards = [
    {
      title: "Général",
      iframeURL: getIframeUrl({ id: 1 }),
    },
  ];

  const title = "Statistiques";

  return (
    <Page>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Breadcrumb pages={[{ title: "Accueil", to: "/" }, { title: title }]} />
      <Heading textStyle="h2" color="grey.800" mt={5}>
        {title}
      </Heading>

      <Tabs variant={"search"} mt={5} isLazy>
        <TabList bg="white">
          {dashboards.map((dashboard) => (
            <Tab key={dashboard.title}>{dashboard.title}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {dashboards.map((dashboard) => (
            <TabPanel key={dashboard.title}>
              <iframe
                src={dashboard.iframeURL}
                frameBorder="0"
                style={{ height: "250vh", width: "100%" }}
                title={`Statistiques Metabase - ${dashboard.title}`}
                allowtransparency={"true"}
              />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Page>
  );
};

export default stats;
