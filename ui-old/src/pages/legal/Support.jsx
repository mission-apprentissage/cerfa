import React, { useEffect, useState } from "react";
import { Box, Container, Stack, SkeletonText, Flex, Link, Center, Icon } from "@chakra-ui/react";
import { NavLink, useLocation, useRouteMatch } from "react-router-dom";
import { NotionRenderer } from "react-notion-x";
import { Breadcrumb } from "../../common/components/Breadcrumb";

import Layout from "../layout/Layout";
import { setTitle } from "../../common/utils/pageUtils";
import { _get } from "../../common/httpClient";

import "react-notion-x/src/styles.css";
import "./notion.css";

const mapId = {
  // "8b83c43d387f4fc7b7872957807b8c66": "8b83c43d387f4fc7b7872957807b8c66",
  faq: "8b83c43d387f4fc7b7872957807b8c66",
  documents_utiles: "b1216d0f333e430aa588d0017c948713",
};

const mapBc = {
  // "8b83c43d387f4fc7b7872957807b8c66": [{ title: "Assistance", to: "/assistance" }, { title: "FAQ" }],
  faq: [{ title: "Assistance", to: "/assistance" }, { title: "FAQ" }],
  documents_utiles: [{ title: "Assistance", to: "/assistance" }, { title: "Documents utiles" }],
};

const AsLink = ({ children, ...rest }) => (
  <Link as={NavLink} display="inline-block" {...rest}>
    {children}
  </Link>
);

const NavItem = ({ icon, children, to, shoudBeActive, isSubItem, ...rest }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  const Component = to ? AsLink : Center;
  return (
    <Flex
      align="center"
      cursor="pointer"
      color="inherit"
      _hover={{
        bg: "gray.100",
        color: "gray.900",
        borderLeft: "2px solid",
        borderColor: isSubItem ? "transparent" : "bluefrance",
      }}
      role="group"
      fontWeight="semibold"
      transition=".15s ease"
      borderLeft={"2px solid"}
      borderColor={(isActive || shoudBeActive) && !isSubItem ? "bluefrance" : "transparent"}
      {...rest}
    >
      <Component px="4" pl="4" py="3" w="full" color={isActive || shoudBeActive ? "bluefrance" : "grey.800"} to={to}>
        {icon && (
          <Icon
            mx="2"
            boxSize="4"
            _groupHover={{
              color: "gray.600",
            }}
            as={icon}
          />
        )}
        {children}
      </Component>
    </Flex>
  );
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

  setTitle(recordMapNotion?.pageTitle || "Assistance");

  return (
    <Layout>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]}>
        <Container maxW="xl">
          <Breadcrumb pages={[{ title: "Accueil", to: "/" }, ...(mapBc[params.id] || [{ title: "Assistance" }])]} />

          <Flex mt={8}>
            <Box w="22%" color="#1E1E1E" pt={[2, 4]}>
              <NavItem to={"/assistance"}>Assistance</NavItem>
              <NavItem to={"/assistance/faq"}>FAQ</NavItem>
              <NavItem to={"/assistance/documents_utiles"}>Documents utiles</NavItem>
            </Box>
            <Box pt={[2, 4]} flexGrow={1} pl={16}>
              {isLoading && (
                <Stack mt={20}>
                  <SkeletonText mt="4" noOfLines={10} spacing="4" />
                </Stack>
              )}
              {!isLoading && (
                <NotionRenderer
                  recordMap={recordMapNotion}
                  fullPage={true}
                  darkMode={false}
                  disableHeader={true}
                  rootDomain={process.env.REACT_APP_BASE_URL}
                  bodyClassName="notion-body"
                />
              )}
            </Box>
          </Flex>
        </Container>
      </Box>
    </Layout>
  );
};
