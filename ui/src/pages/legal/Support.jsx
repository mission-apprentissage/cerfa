import React, { useEffect, useState } from "react";
import { Box, Container, Stack, Skeleton } from "@chakra-ui/react";
import { NotionRenderer } from "react-notion-x";
import { useRouteMatch } from "react-router-dom";
import { Breadcrumb } from "../../common/components/Breadcrumb";

import Layout from "../layout/Layout";
import { setTitle } from "../../common/utils/pageUtils";
import { _get } from "../../common/httpClient";

import "react-notion-x/src/styles.css";

const mapId = {
  "8b83c43d387f4fc7b7872957807b8c66": "8b83c43d387f4fc7b7872957807b8c66",
  faq: "8b83c43d387f4fc7b7872957807b8c66",
};

const mapBc = {
  "8b83c43d387f4fc7b7872957807b8c66": [{ title: "Support", to: "/support" }, { title: "FAQ" }],
  faq: [{ title: "Support", to: "/support" }, { title: "FAQ" }],
};

export default () => {
  let { params } = useRouteMatch();
  const pageId = mapId[params.id] || "6e373f15a9b94a87a5cabde3fa2af0bc";

  const [isLoading, setIsLoading] = useState(true);
  const [recordMapNotion, setRecordMapNotion] = useState(null);

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      const tmp = await _get(`/api/v1/support/content/${pageId}`);
      setRecordMapNotion(tmp);
      setIsLoading(false);
    };
    run();
  }, [pageId]);

  setTitle(recordMapNotion?.pageTitle || "Support");

  return (
    <Layout>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]}>
        <Container maxW="xl">
          <Breadcrumb pages={[{ title: "Accueil", to: "/" }, ...(mapBc[params.id] || [{ title: "Support" }])]} />
          <Box mt={4}>
            {isLoading && (
              <Stack>
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
              </Stack>
            )}
            {!isLoading && (
              <NotionRenderer
                recordMap={recordMapNotion}
                fullPage={true}
                darkMode={false}
                disableHeader={true}
                rootDomain={process.env.REACT_APP_BASE_URL}
              />
            )}
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};
