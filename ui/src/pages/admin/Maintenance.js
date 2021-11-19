import React, { useState, useEffect } from "react";
import {
  Box,
  Center,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Textarea,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { _post, _get, _put } from "../../common/httpClient";
import Layout from "../layout/Layout";
import { NavLink } from "react-router-dom";
import { ArrowDropRightLine } from "../../theme/components/icons";
import useAuth from "../../common/hooks/useAuth";

const Message = () => {
  const [messageAutomatique, setMessageAutomatique] = useState([]);

  const [user] = useAuth();

  const { values: valuesM, handleSubmit: handleSubmitM, handleChange: handleChangeM } = useFormik({
    initialValues: {
      msg: "",
    },
    onSubmit: ({ msg }, { setSubmitting }) => {
      return new Promise(async (resolve, reject) => {
        try {
          const newMessageScript = {
            type: "manuel",
            msg,
            name: user.email,
            enabled: true,
          };
          const messagePosted = await _post("/api/v1/entity/messageScript", newMessageScript);
          if (messagePosted) {
            alert("Le message a bien été envoyé.");
          }
          window.location.reload();
        } catch (e) {
          console.log(e);
        }

        setSubmitting(false);
        resolve("onSubmitHandler complete");
      });
    },
  });

  const { values: valuesA, handleSubmit: handleSubmitA, handleChange: handleChangeA, setFieldValue } = useFormik({
    initialValues: {
      msg: "",
    },
    onSubmit: ({ msg }, { setSubmitting }) => {
      return new Promise(async (resolve, reject) => {
        try {
          const newMessageScript = {
            type: "automatique",
            msg,
            name: "auto",
            enabled: false,
          };
          const messagePosted = await _put(`/api/v1/entity/messageScript/${messageAutomatique._id}`, newMessageScript);
          if (messagePosted) {
            alert("Le message a bien été mise à jour.");
          }
          window.location.reload();
        } catch (e) {
          console.log(e);
        }

        setSubmitting(false);
        resolve("onSubmitHandler complete");
      });
    },
  });

  useEffect(() => {
    const run = async () => {
      try {
        const data = await _get("/api/v1/entity/messageScript");
        if (data.length === 0) {
          const newMessageScript = {
            type: "automatique",
            msg:
              "Une mise à jour des données du catalogue est en cours, le service sera à nouveau opérationnel d'ici le XX/XX/21 à XXh.",
            name: "auto",
            enabled: false,
          };
          await _post("/api/v1/entity/messageScript", newMessageScript);
          window.location.reload();
        } else {
          const [a] = data.filter((d) => d.type === "automatique");
          setMessageAutomatique(a);
          setFieldValue(
            "msg",
            a.msg ||
              "Une mise à jour des données du catalogue est en cours, le service sera à nouveau opérationnel d'ici le XX/XX/21 à XXh."
          );
        }
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, [setFieldValue]);

  return (
    <Layout>
      <Box w="100%" pt={[4, 8]} px={[1, 24]} color="grey.800">
        <Container maxW="xl">
          <Breadcrumb separator={<ArrowDropRightLine color="grey.600" />} textStyle="xs">
            <BreadcrumbItem>
              <BreadcrumbLink as={NavLink} to="/" color="grey.600" textDecoration="underline">
                Accueil
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>Message de maintenance</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Container>
      </Box>
      <Center mt={5} verticalAlign="center">
        <Box width={["auto", "28rem"]}>
          <Heading textStyle="h2" marginBottom="2w">
            Message de maintenance
          </Heading>
          <Box>
            <FormControl as="fieldset">
              <FormLabel as="legend">Message manuel: </FormLabel>
              <Textarea
                name="msg"
                value={valuesM.msg}
                onChange={handleChangeM}
                placeholder="Message Manuel"
                rows={3}
                required
              />
              <Box mt="2rem">
                <Button textStyle="sm" variant="primary" onClick={handleSubmitM}>
                  Enregistrer et activé
                </Button>
              </Box>
            </FormControl>
          </Box>
          <Box>
            <FormControl as="fieldset" mt={5}>
              <FormLabel as="legend">Message Automatique : </FormLabel>
              <Textarea
                name="msg"
                value={valuesA.msg}
                onChange={handleChangeA}
                placeholder="Message Automatique"
                rows={3}
                required
              />
              <Box mt="2rem">
                <Button textStyle="sm" variant="primary" onClick={handleSubmitA} mb={8}>
                  Mettre à jour le message automatique
                </Button>
              </Box>
            </FormControl>
          </Box>
        </Box>
      </Center>
    </Layout>
  );
};

export default Message;
