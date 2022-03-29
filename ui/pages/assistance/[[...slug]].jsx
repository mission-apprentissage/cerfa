import React, { useEffect, useState } from "react";
import { Box, Stack, SkeletonText, Flex, Center, Icon } from "@chakra-ui/react";
import { NotionRenderer } from "react-notion-x";
import Head from "next/head";
import { Breadcrumb } from "../../components/Breadcrumb/Breadcrumb";
import { Page } from "../../components/Page/Page";
import { useRouter } from "next/router";
import Link from "../../components/Link";

import { _get } from "../../common/httpClient";

import "react-notion-x/src/styles.css";
import styles from "../../styles/notion.module.css";

const mapId = {
  faq: "8b83c43d387f4fc7b7872957807b8c66",
  documents_utiles: "b1216d0f333e430aa588d0017c948713",
};

const mapBc = {
  faq: [{ title: "Assistance", to: "/assistance" }, { title: "FAQ" }],
  documents_utiles: [{ title: "Assistance", to: "/assistance" }, { title: "Documents utiles" }],
};

const AsLink = ({ children, ...rest }) => (
  <Link display="inline-block" {...rest}>
    {children}
  </Link>
);

const NavItem = ({ icon, children, to, shoudBeActive, isSubItem, ...rest }) => {
  const router = useRouter();
  const isActive = router.asPath === to;

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
      <Component px="4" pl="4" py="3" w="full" color={isActive || shoudBeActive ? "bluefrance" : "grey.800"} href={to}>
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

// TODO SSR
const Assistance = () => {
  const router = useRouter();
  const { slug } = router.query;
  const id = slug?.[0] || null;
  const pageId = mapId[id] || "6e373f15a9b94a87a5cabde3fa2af0bc";

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

  return (
    <Page>
      <Head>
        <title>{recordMapNotion?.pageTitle || "Assistance"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Breadcrumb pages={[{ title: "Accueil", to: "/" }, ...(mapBc[id] || [{ title: "Assistance" }])]} />

      <Flex mt={8}>
        <Box w="30%" color="#1E1E1E" pt={[2, 4]}>
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
              bodyClassName={styles.notionBody}
            />
          )}
        </Box>
      </Flex>
    </Page>
  );
};

export default Assistance;
