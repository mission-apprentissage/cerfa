import React from "react";
import {
  Box,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { _post } from "../../common/httpClient";
import { ArrowDropRightLine } from "../../theme/components/icons";
import { Page } from "../../components/Page/Page";
import Head from "next/head";
import NavLink from "next/link";

import withAuth from "../../components/withAuth";
import { getAuthServerSideProps } from "../../common/SSR/getAuthServerSideProps";

export const getServerSideProps = async (context) => ({ props: { ...(await getAuthServerSideProps(context)) } });

const AssistanceDossier = () => {
  const toast = useToast();
  const { values, handleSubmit, handleChange } = useFormik({
    initialValues: {
      dossierId: "",
    },
    onSubmit: ({ dossierId }, { setSubmitting }) => {
      // eslint-disable-next-line no-undef
      return new Promise(async (resolve) => {
        try {
          await _post("/api/v1/admin/assistanceDossier", {
            dossierId,
          });
          toast({
            title: "Succes",
            description: `Vous avez désormais accès au dossier ${dossierId}. /mes-dossiers/dossiers-partages/${dossierId}/cerfa`,
            status: "success",
            duration: 10000,
          });
        } catch (e) {
          console.log({ e });
          if (e.json?.data?.message === "Doesn't exist") {
            toast({
              title: "Error",
              description: `Le dossier ${dossierId} n'existe pas`,
              status: "error",
              duration: 10000,
            });
          } else if (e.json?.data?.message === "Already shared") {
            toast({
              title: "Error",
              description: `Vous avez déjà accès au dossier ${dossierId} `,
              status: "error",
              duration: 10000,
            });
          }
        }

        setSubmitting(false);
        resolve("onSubmitHandler complete");
      });
    },
  });

  return (
    <Page>
      <Head>
        <title>Assistance Dossier</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box w="100%" pt={[4, 8]} px={[1, 24]} color="grey.800">
        <Container maxW="xl">
          <Breadcrumb separator={<ArrowDropRightLine color="grey.600" />} textStyle="xs">
            <BreadcrumbItem>
              <BreadcrumbLink as={NavLink} href="/" color="grey.600" textDecoration="underline">
                Accueil
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>Assistance dossier</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Container>
      </Box>
      <Box w="100%" px={[1, 1, 12, 24]}>
        <Container maxW="xl">
          <Heading textStyle="h2" marginBottom="2w" mt={6}>
            M&lsquo;ajouter sur un dossier pour assistance
          </Heading>
          <Divider my={10} border="2px solid" />
          <Box>
            <FormControl as="fieldset" mt={5}>
              <FormLabel as="legend">Numéro de dossier: </FormLabel>
              <Input
                name="dossierId"
                value={values.dossierId}
                onChange={handleChange}
                placeholder="exemple: 620b5faa156557002c1620aa"
                rows={3}
                required
              />
              <Box mt="2rem">
                <Button textStyle="sm" variant="primary" onClick={handleSubmit} mb={8}>
                  Accéder au dossier
                </Button>
              </Box>
            </FormControl>
          </Box>
        </Container>
      </Box>
    </Page>
  );
};

export default withAuth(AssistanceDossier, "admin/page_assistance_dossier");
