import React, { useState, useEffect } from "react";
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
  Textarea,
  Divider,
  Text,
  Switch,
  RadioGroup,
  Radio,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { _post, _get, _put, _delete } from "../../common/httpClient";
import { ArrowDropRightLine } from "../../theme/components/icons";
import useAuth from "../../hooks/useAuth";
import { Table } from "../../components/Table/Table";
import { Page } from "../../components/Page/Page";
import Head from "next/head";
import NavLink from "next/link";

import withAuth from "../../components/withAuth";
import { getAuthServerSideProps } from "../../common/SSR/getAuthServerSideProps";

export const getServerSideProps = async (context) => ({ props: { ...(await getAuthServerSideProps(context)) } });

const Message = () => {
  const [messageAutomatique, setMessageAutomatique] = useState([]);
  const [messageMaintenance, setMessageMaintenance] = useState([]);
  const [messages, setMessages] = useState([]);

  const [user] = useAuth();

  const onSubmitMessage = ({ msg, type, context }) => {
    // eslint-disable-next-line no-undef
    return new Promise(async (resolve) => {
      console.log(msg, type, context);
      try {
        let messagePosted =
          context === "manuel"
            ? await _post("/api/v1/maintenanceMessage", {
                type,
                context,
                msg,
                name: user.email,
                enabled: true,
              })
            : await _put(
                `/api/v1/maintenanceMessage/${
                  context !== "maintenance" ? messageAutomatique._id : messageMaintenance._id
                }`,
                {
                  type,
                  context,
                  msg,
                  name: user.email,
                  enabled: false,
                }
              );

        if (messagePosted) {
          alert("Le message a bien été envoyé/mise à jour.");
        }
        window.location.reload();
      } catch (e) {
        console.log(e);
      }

      resolve("onSubmitHandler complete");
    });
  };

  const {
    values: valuesM,
    handleSubmit: handleSubmitM,
    handleChange: handleChangeM,
  } = useFormik({
    initialValues: { msg: "", type: "", context: "manuel" },
    onSubmit: ({ msg, type, context }) =>
      onSubmitMessage({ msg, type: context !== "manuel" ? "alert" : type, context }),
  });

  useEffect(() => {
    const run = async () => {
      try {
        const data = await _get("/api/v1/maintenanceMessage");
        setMessages(data.filter((d) => d.msg));

        const [auto] = data.filter((d) => d.context === "automatique" && d.msg);
        setMessageAutomatique(auto);

        const [maintenance] = data.filter((d) => d.context === "maintenance");
        setMessageMaintenance(maintenance);
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, []);

  const onEnabledClicked = async (item, payload) => {
    try {
      const messagePosted = await _put(`/api/v1/maintenanceMessage/${item._id}`, {
        ...item,
        ...payload,
      });
      if (messagePosted) {
        alert("Le message a bien été mise à jour.");
      }
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  const onDeleteClicked = async (item) => {
    try {
      const messageDeleted = await _delete(`/api/v1/maintenanceMessage/${item._id}`);
      if (messageDeleted) {
        alert("Le message a bien été supprimé.");
      }
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Page>
      <Head>
        <title>Messages de maintenance</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box w="100%" pt={[4, 8]} color="grey.800">
        <Container maxW="xl">
          <Breadcrumb separator={<ArrowDropRightLine color="grey.600" />} textStyle="xs">
            <BreadcrumbItem>
              <BreadcrumbLink as={NavLink} href="/" color="grey.600" textDecoration="underline">
                Accueil
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>Messages de maintenance</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Container>
      </Box>
      <Box w="100%">
        <Container maxW="xl">
          <Heading textStyle="h2" marginBottom="2w" mt={6}>
            Messages de maintenance
          </Heading>
          <Box>
            <Box>
              {messages.length > 0 && (
                <Table
                  data={messages.map((m) => ({
                    Message: {
                      Header: "Messages précédents",
                      value: m.msg,
                      width: 300,
                    },
                    Context: {
                      Header: "Context",
                      value: m.context,
                      width: 90,
                    },
                    Type: {
                      Header: "Type",
                      value: m.type,
                      width: 40,
                    },
                    Actif: {
                      Header: "Actif",
                      value: m.enabled,
                      width: 50,
                    },
                    Supprimer: {
                      Header: "Supprimer",
                      value: null,
                      width: 40,
                    },
                  }))}
                  components={{
                    Message: (value) => {
                      return <Box px={3}>{value}</Box>;
                    },
                    Actif: (value, i) => {
                      if (messages[i].context === "automatique") return null;
                      return (
                        <Box>
                          <Switch
                            onChange={() => {
                              onEnabledClicked(messages[i], { enabled: !value });
                            }}
                            defaultIsChecked={value}
                          />
                        </Box>
                      );
                    },
                    Supprimer: (value, i) => {
                      if (messages[i].context === "automatique") return null;
                      return (
                        <Box
                          onClick={() => {
                            onDeleteClicked(messages[i]);
                          }}
                        >
                          <Text color="tomato" fontWeight="bold">
                            X
                          </Text>
                        </Box>
                      );
                    },
                  }}
                />
              )}
            </Box>
            <Divider my={10} border="2px solid" />
            <Heading textStyle="h4" fontSize="1.3rem" mt={10}>
              Ajouter/Mettre à jour un message:{" "}
            </Heading>
            <FormControl as="fieldset" mt={8}>
              <VStack alignItems="flex-start" mb={5}>
                <FormLabel textDecoration="underline">Context du message: </FormLabel>
                <RadioGroup value={valuesM.context}>
                  <VStack alignItems="flex-start">
                    <Radio
                      type="radio"
                      name="context"
                      value="manuel"
                      checked={valuesM.context === "manuel"}
                      onChange={handleChangeM}
                    >
                      Manuel (Message informatif permanent si activé)
                    </Radio>
                    <Radio
                      type="radio"
                      name="context"
                      value="automatique"
                      checked={valuesM.context === "automatique"}
                      onChange={handleChangeM}
                    >
                      Automatique (Message d&apos;alert automatique déclenché lors d&apos;un traitement coté serveur)
                    </Radio>
                    <Radio
                      type="radio"
                      name="context"
                      value="maintenance"
                      checked={valuesM.context === "maintenance"}
                      onChange={handleChangeM}
                    >
                      Maintenance (Message global de maintenance; si activé le site ne sera pas accesible pour les
                      utilisarteurs non adminstrateur)
                    </Radio>
                  </VStack>
                </RadioGroup>
              </VStack>
              <FormLabel textDecoration="underline">Message: </FormLabel>
              <Textarea
                name="msg"
                value={valuesM.msg}
                onChange={handleChangeM}
                placeholder="exemple: Une mise à jour des données est en cours, le service sera à nouveau opérationnel d'ici le XX/XX/2022 à XXh."
                rows={3}
                required
              />
              <Text fontSize="0.8rem" mb={5}>
                Aide! Pour afficher un lien hypertexte dans les messages, veuillez suivre la synthaxe suivante [Mon
                Lien](<strong>##</strong>https://MON_URL)
              </Text>
              <HStack alignItems="flex-start" mb={5}>
                <FormLabel textDecoration="underline">Type de message: </FormLabel>
                <RadioGroup
                  value={valuesM.context !== "manuel" ? "alert" : valuesM.type}
                  isDisabled={valuesM.context !== "manuel"}
                >
                  <HStack alignItems="flex-start">
                    <Radio
                      type="radio"
                      name="type"
                      value="alert"
                      checked={valuesM.type !== "info"}
                      onChange={handleChangeM}
                    >
                      Alert (Bandeau rouge)
                    </Radio>
                    <Radio
                      type="radio"
                      name="type"
                      value="info"
                      checked={valuesM.type === "info"}
                      onChange={handleChangeM}
                    >
                      Info (Bandeau bleu)
                    </Radio>
                  </HStack>
                </RadioGroup>
              </HStack>
              <Box my="8">
                <Button textStyle="sm" variant="primary" onClick={handleSubmitM}>
                  Enregistrer
                </Button>
              </Box>
            </FormControl>
          </Box>
        </Container>
      </Box>
    </Page>
  );
};

export default withAuth(Message, "admin/page_message_maintenance");
