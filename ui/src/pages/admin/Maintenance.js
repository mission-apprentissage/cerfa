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
  Input,
  Textarea,
  Divider,
  Text,
  Switch,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { _post, _get, _put, _delete } from "../../common/httpClient";
import Layout from "../layout/Layout";
import { NavLink } from "react-router-dom";
import { ArrowDropRightLine } from "../../theme/components/icons";
import useAuth from "../../common/hooks/useAuth";
import { Table } from "../../common/components/Table";

const Message = () => {
  const [messageAutomatique, setMessageAutomatique] = useState([]);
  const [messagesManuel, setMessagesManuel] = useState([]);

  const [user] = useAuth();

  const { values: valuesM, handleSubmit: handleSubmitM, handleChange: handleChangeM } = useFormik({
    initialValues: {
      msg: "",
      type: "",
    },
    onSubmit: ({ msg, type }, { setSubmitting }) => {
      return new Promise(async (resolve, reject) => {
        try {
          const newMaintenanceMessage = {
            type,
            context: "manuel",
            msg,
            name: user.email,
            enabled: true,
          };
          const messagePosted = await _post("/api/v1/maintenanceMessage", newMaintenanceMessage);
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

  const {
    values: valuesA,
    handleSubmit: handleSubmitA,
    handleChange: handleChangeA,
    setFieldValue: setFieldValueA,
  } = useFormik({
    initialValues: {
      msg: "",
    },
    onSubmit: ({ msg }, { setSubmitting }) => {
      return new Promise(async (resolve, reject) => {
        try {
          const newMaintenanceMessage = {
            type: "alert",
            context: "automatique",
            msg,
            name: "auto",
            enabled: false,
          };
          const messagePosted = await _put(
            `/api/v1/maintenanceMessage/${messageAutomatique._id}`,
            newMaintenanceMessage
          );
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
        const data = await _get("/api/v1/maintenanceMessage");
        if (data.length === 0) {
          const newMaintenanceMessage = {
            type: "alert",
            context: "automatique",
            msg:
              "Une mise à jour des données est en cours, le service sera à nouveau opérationnel d'ici le XX/XX/21 à XXh.",
            name: "auto",
            enabled: false,
          };
          await _post("/api/v1/maintenanceMessage", newMaintenanceMessage);
          window.location.reload();
        } else {
          const [a] = data.filter((d) => d.context === "automatique");
          setMessageAutomatique(a);
          setFieldValueA(
            "msg",
            a.msg ||
              "Une mise à jour des données est en cours, le service sera à nouveau opérationnel d'ici le XX/XX/21 à XXh."
          );

          const m = data.filter((d) => d.context === "manuel");
          setMessagesManuel(m);
        }
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, [setFieldValueA]);

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
        alert("Le message MANUEL seulement a bien été supprimé.");
      }
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

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
      <Box w="100%" minH="100vh" px={[1, 1, 12, 24]}>
        <Container maxW="xl">
          <Heading textStyle="h2" marginBottom="2w" mt={6}>
            Message de maintenance
          </Heading>
          <Box>
            <Box>
              {messagesManuel.length > 0 && (
                <Table
                  data={messagesManuel.map((m) => ({
                    Message: {
                      Header: "Message",
                      value: m.msg,
                    },
                    Type: {
                      Header: "Type",
                      value: m.type,
                    },
                    Actif: {
                      Header: "Actif",
                      value: m.enabled,
                    },
                    Supprimer: {
                      Header: "Supprimer",
                      value: null,
                    },
                  }))}
                  components={{
                    Actif: (value, i) => {
                      return (
                        <Box>
                          <Switch
                            onChange={() => {
                              onEnabledClicked(messagesManuel[i], { enabled: !value });
                            }}
                            defaultIsChecked={value}
                          />
                        </Box>
                      );
                    },
                    Supprimer: (value, i) => {
                      return (
                        <Box
                          onClick={() => {
                            onDeleteClicked(messagesManuel[i]);
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
            <FormControl as="fieldset" mt={8}>
              <FormLabel as="legend">Ajouter un message manuel: </FormLabel>
              <Textarea
                name="msg"
                value={valuesM.msg}
                onChange={handleChangeM}
                placeholder="Message Manuel"
                rows={3}
                required
              />
              <Input
                mt={3}
                name="type"
                value={valuesM.type}
                onChange={handleChangeM}
                placeholder="alert ou info"
                required
              />
              <Box mt="3">
                <Button textStyle="sm" variant="primary" onClick={handleSubmitM}>
                  Enregistrer et activé
                </Button>
              </Box>
            </FormControl>
          </Box>
          <Divider my={10} border="2px solid" />
          <Box>
            <FormControl as="fieldset" mt={5}>
              <FormLabel as="legend">Message d'alert automatique lors d'un traitement coté serveur: </FormLabel>
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
        </Container>
      </Box>
    </Layout>
  );
};

export default Message;
