import React, { useEffect, useState } from "react";
import { _delete, _get, _post, _put } from "../../common/httpClient";
import { useFormik } from "formik";
import Layout from "../layout/Layout";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from "@chakra-ui/react";
import { Breadcrumb } from "../../common/components/Breadcrumb";
import { setTitle } from "../../common/utils/pageUtils";

import Acl from "./components/Acl";

const RoleLine = ({ role }) => {
  const { values, handleSubmit, handleChange, setFieldValue } = useFormik({
    initialValues: {
      name: role?.name || "",
      acl: role?.acl || [],
    },
    onSubmit: (res, { setSubmitting }) => {
      return new Promise(async (resolve, reject) => {
        try {
          if (role) {
            await _put(`/api/v1/admin/role/${role.name}`, res);
          } else {
            await _post(`/api/v1/admin/role/`, res);
          }
          document.location.reload(true);
        } catch (e) {
          console.log(e);
        }

        setSubmitting(false);
        resolve("onSubmitHandler complete");
      });
    },
  });

  const onDeleteClicked = async (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Supprimer le rôle !?")) {
      await _delete(`/api/v1/admin/role/${role.name}`);
      document.location.reload(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl py={2}>
        <FormLabel>Nom du rôle</FormLabel>
        <Input type="text" id="name" name="name" value={values.name} onChange={handleChange} />
      </FormControl>

      <Acl acl={values.acl} onChanged={(newAcl) => setFieldValue("acl", newAcl)} />

      {role && (
        <Box>
          <Button type="submit" variant="primary" mr={5}>
            Enregistrer
          </Button>
          <Button variant="outline" colorScheme="red" borderRadius="none" onClick={onDeleteClicked}>
            Supprimer le rôle
          </Button>
        </Box>
      )}
      {!role && (
        <Button type="submit" variant="primary">
          Créer le rôle
        </Button>
      )}
    </form>
  );
};

export default () => {
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    async function run() {
      const rolesList = await _get(`/api/v1/admin/roles/`);
      setRoles(rolesList);
    }
    run();
  }, []);

  const title = "Gestion des rôles";
  setTitle(title);

  return (
    <Layout>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]} color="grey.800">
        <Container maxW="xl">
          <Breadcrumb pages={[{ title: "Accueil", to: "/" }, { title: title }]} />
        </Container>
      </Box>
      <Box w="100%" minH="100vh" px={[1, 1, 12, 24]}>
        <Container maxW="xl">
          <Heading as="h1" mb={8} mt={6}>
            {title}
          </Heading>
          <Stack spacing={2}>
            <Accordion bg="white" mb={12} allowToggle>
              <AccordionItem>
                <AccordionButton bg="bluefrance" color="white" _hover={{ bg: "blue.700" }}>
                  <Box flex="1" textAlign="left" fontSize="gamma">
                    Créer un rôle
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} border={"1px solid"} borderTop={0} borderColor={"bluefrance"}>
                  <RoleLine role={null} />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            {roles.map((roleAttr, i) => {
              return (
                <Accordion bg="white" key={i} allowToggle>
                  <AccordionItem>
                    <AccordionButton
                      _expanded={{ bg: roleAttr.type === "user" ? "greensoft.300" : "grey.200", color: "bluefrance" }}
                      _hover={{ bg: "grey.200", color: "bluefrance" }}
                      bg={roleAttr.type === "user" ? "greensoft.500" : "transparent"}
                      color={roleAttr.type === "user" ? "white" : "bluefrance"}
                      border={"1px solid"}
                      borderColor={"bluefrance"}
                    >
                      <Box flex="1" textAlign="left" fontSize="gamma">
                        {roleAttr.name} {roleAttr.type === "user" ? "(Utilisateur)" : "(Permission)"}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4} border={"1px solid"} borderTop={0} borderColor={"bluefrance"}>
                      <RoleLine role={roleAttr} />
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              );
            })}
          </Stack>
        </Container>
      </Box>
    </Layout>
  );
};
