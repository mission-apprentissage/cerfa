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
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Flex,
} from "@chakra-ui/react";
import { Breadcrumb } from "../../common/components/Breadcrumb";
import { setTitle } from "../../common/utils/pageUtils";
import ACL from "./acl";

const RoleLine = ({ role }) => {
  const { values, handleSubmit, handleChange } = useFormik({
    initialValues: {
      newName: role?.name || "",
      newAcl: role?.acl || [],
    },
    onSubmit: ({ newAcl, newName }, { setSubmitting }) => {
      return new Promise(async (resolve, reject) => {
        try {
          if (role) {
            const body = {
              name: newName,
              acl: newAcl,
            };
            await _put(`/api/v1/admin/role/${role.name}`, body);
            document.location.reload(true);
          } else {
            const body = {
              name: newName,
              acl: newAcl,
            };
            await _post(`/api/v1/admin/role/`, body);
            document.location.reload(true);
          }
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
        <Input type="text" id="newName" name="newName" value={values.newName} onChange={handleChange} />
      </FormControl>

      <Accordion bg="white" mt={3} allowToggle>
        <AccordionItem>
          <AccordionButton _expanded={{ bg: "grey.200" }} border={"none"}>
            <Box flex="1" textAlign="left" fontSize="sm">
              Droits d'accès
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4} border={"none"} bg="grey.100">
            <FormControl p={2}>
              {ACL.map((item, i) => {
                return (
                  <Flex flexDirection="column" mb={5} key={i}>
                    <Box mb={2}>
                      <Checkbox
                        name="newAcl"
                        onChange={handleChange}
                        value={item.ref}
                        isChecked={values.newAcl.includes(item.ref)}
                        fontWeight="bold"
                      >
                        {item.feature}
                      </Checkbox>
                    </Box>
                    <Flex ml={5} pr={14}>
                      {item.subFeatures?.map((subitem, j) => {
                        return (
                          <HStack spacing={5} ml={5} key={`${i}_${j}`}>
                            <Checkbox
                              name="newAcl"
                              onChange={handleChange}
                              value={subitem.ref}
                              isChecked={values.newAcl.includes(subitem.ref)}
                              isDisabled={!values.newAcl.includes(item.ref)}
                            >
                              {subitem.feature}
                            </Checkbox>
                          </HStack>
                        );
                      })}
                    </Flex>
                  </Flex>
                );
              })}
            </FormControl>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

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
                    <AccordionButton _expanded={{ bg: "grey.200" }} border={"1px solid"} borderColor={"bluefrance"}>
                      <Box flex="1" textAlign="left" fontSize="gamma">
                        {roleAttr.name}
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
