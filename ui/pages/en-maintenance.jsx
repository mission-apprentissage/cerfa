import { Heading, HStack, Link, Text } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { _get } from "../common/httpClient";
import { getAuthServerSideProps } from "../common/SSR/getAuthServerSideProps";
import { replaceLinks } from "../common/utils/markdownUtils";
import { Page } from "../components/Page/Page";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { ExternalLinkLine } from "../theme/components/icons";
import useAuth from "../hooks/useAuth";
import { isUserAdmin } from "../common/utils/rolesUtils";

export const getServerSideProps = async (context) => ({ props: { ...(await getAuthServerSideProps(context)) } });

const Messages = ({ message }) =>
  replaceLinks(message).map((part, i) => {
    return typeof part === "string" ? (
      <Text as="span" key={i}>
        <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
          {part}
        </ReactMarkdown>
      </Text>
    ) : (
      <Link href={part?.href} fontSize="md" key={i} textDecoration={"underline"} isExternal>
        {part?.linkText} <ExternalLinkLine w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} ml={"0.125rem"} />
      </Link>
    );
  });

const MaintenancePage = () => {
  const [message, setMessage] = useState(null);
  const router = useRouter();
  let [auth] = useAuth();

  useEffect(() => {
    true;
    const run = async () => {
      try {
        const data = await _get("/api/v1/maintenanceMessage");
        const [maintenance] = data.filter((d) => d.context === "maintenance" && d.enabled);
        if (maintenance) {
          setMessage(maintenance.msg);
        } else {
          router.push(`/`);
        }
      } catch (e) {
        console.error(e);
      }
    };
    run();

    return () => {
      // cleanup hook
    };
  }, [router]);

  const title = "Maintenance en cours";
  return (
    <Page withoutDisplayNavigationBar={!isUserAdmin(auth)}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HStack>
        <Heading textStyle="h2" marginBottom="2w" mt={6}>
          Maintenance
        </Heading>
      </HStack>
      <Heading fontSize="1.3rem" fontFamily="Marianne" fontWeight="500" marginBottom="2w" mt="8">
        <Messages message={message} />
      </Heading>
    </Page>
  );
};

export default MaintenancePage;
