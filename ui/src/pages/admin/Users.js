// TODO
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
  useToast,
  Text,
} from "@chakra-ui/react";
import { Breadcrumb } from "../../common/components/Breadcrumb";
import { setTitle } from "../../common/utils/pageUtils";
import generator from "generate-password-browser";
import { useQuery } from "react-query";

import Acl from "./components/Acl";

const buildRolesAcl = (newRoles, roles) => {
  let acl = [];
  for (let i = 0; i < newRoles.length; i++) {
    const selectedRole = newRoles[i];
    const selectedRoleAcl = roles.reduce((acc, curr) => {
      if (selectedRole === curr.name) return [...acc, ...curr.acl];
      return acc;
    }, []);
    acl = [...acl, ...selectedRoleAcl];
  }
  return acl;
};

const UserLine = ({ user, roles }) => {
  const toast = useToast();
  const [, setRolesAcl] = useState(buildRolesAcl(user?.roles || [], roles));

  useEffect(() => {
    async function run() {
      setRolesAcl(buildRolesAcl(user?.roles || [], roles));
    }
    run();
  }, [roles, user]);

  const newTmpPassword = generator.generate({
    length: 10,
    numbers: true,
    lowercase: true,
    uppercase: true,
    strict: true,
  });

  const { values, handleSubmit, handleChange, setFieldValue } = useFormik({
    initialValues: {
      accessAllCheckbox: user?.isAdmin ? ["on"] : [],
      roles: user?.roles || [],
      acl: user?.acl || [],
      newNom: user?.nom || "",
      newPrenom: user?.prenom || "",
      newEmail: user?.email || "",
      newTmpPassword,
    },
    onSubmit: (
      { apiKey, accessAllCheckbox, newNom, newPrenom, newEmail, newTmpPassword, roles, acl },
      { setSubmitting }
    ) => {
      return new Promise(async (resolve) => {
        const accessAll = accessAllCheckbox.includes("on");
        try {
          if (user) {
            const body = {
              options: {
                prenom: newPrenom,
                nom: newNom,
                email: newEmail,
                roles,
                acl,
                permissions: {
                  isAdmin: accessAll,
                },
              },
            };
            await _put(`/api/v1/admin/user/${user._id}`, body);
            document.location.reload(true);
          } else {
            const body = {
              password: newTmpPassword,
              options: {
                prenom: newPrenom,
                nom: newNom,
                email: newEmail,
                roles,
                acl,
                permissions: {
                  isAdmin: accessAll,
                },
              },
            };
            await _post(`/api/v1/admin/user/`, body);
            document.location.reload(true);
          }
        } catch (e) {
          console.log(e);
          const response = await (e?.json ?? {});
          const message = response?.message ?? e?.message;

          toast({
            title: "Error",
            description: message,
            status: "error",
            duration: 10000,
          });
        }

        setSubmitting(false);
        resolve("onSubmitHandler complete");
      });
    },
  });

  const onDeleteClicked = async (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Delete user !?")) {
      await _delete(`/api/v1/admin/user/${user._id}`);
      document.location.reload(true);
    }
  };

  const handleRoleChange = (roleName) => {
    let oldRolesAcl = [];
    oldRolesAcl = buildRolesAcl(values.roles, roles);

    let customAcl = [];
    for (let i = 0; i < values.acl.length; i++) {
      const currentAcl = values.acl[i];
      if (!oldRolesAcl.includes(currentAcl)) {
        customAcl.push(currentAcl);
      }
    }

    let newRolesAcl = [];
    let newRoles = [];
    if (values.roles.includes(roleName)) {
      newRoles = values.roles.filter((r) => r !== roleName);
      newRolesAcl = buildRolesAcl(newRoles, roles);
    } else {
      newRoles = [...values.roles, roleName];
      newRolesAcl = buildRolesAcl(newRoles, roles);
    }

    setFieldValue("acl", customAcl);
    setFieldValue("roles", newRoles);

    setRolesAcl(newRolesAcl);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Text>Compte créé sur: {user?.orign_register}</Text>
      <FormControl py={2}>
        <FormLabel>Nom</FormLabel>
        <Input type="text" id="newNom" name="newNom" value={values.newNom} onChange={handleChange} />
      </FormControl>
      <FormControl py={2}>
        <FormLabel>Prenom</FormLabel>
        <Input type="text" id="newPrenom" name="newPrenom" value={values.newPrenom} onChange={handleChange} />
      </FormControl>

      <FormControl py={2}>
        <FormLabel>Email</FormLabel>
        <Input type="email" id="newEmail" name="newEmail" value={values.newEmail} onChange={handleChange} />
      </FormControl>

      {!user && (
        <FormControl py={2}>
          <FormLabel>Mot de passe temporaire</FormLabel>
          <Input
            type="text"
            id="newTmpPassword"
            name="newTmpPassword"
            value={values.newTmpPassword}
            onChange={handleChange}
          />
        </FormControl>
      )}

      <FormControl py={2} mt={3}>
        <Checkbox
          name="accessAllCheckbox"
          id="accessAllCheckbox"
          isChecked={values.accessAllCheckbox.length > 0}
          onChange={handleChange}
          value="on"
          fontWeight={values.accessAllCheckbox.length > 0 ? "bold" : "normal"}
          color={"bluefrance"}
        >
          Admin
        </Checkbox>
      </FormControl>

      <FormControl py={2}>
        <FormLabel>Type de compte</FormLabel>
        <HStack spacing={5}>
          {roles
            .filter((role) => role.type === "user")
            .map((role, i) => {
              return (
                <Checkbox
                  name="roles"
                  key={i}
                  onChange={() => handleRoleChange(role.name)}
                  value={role.name}
                  isChecked={values.roles.includes(role.name)}
                >
                  {role.name}
                </Checkbox>
              );
            })}
        </HStack>
      </FormControl>

      <Acl
        acl={values.acl}
        title=" Droits d'accès Supplémentaire"
        onChanged={(newAcl) => setFieldValue("acl", newAcl)}
      />

      {user && (
        <Box>
          <Button type="submit" variant="primary" mr={5}>
            Enregistrer
          </Button>
          <Button variant="outline" colorScheme="red" borderRadius="none" onClick={onDeleteClicked}>
            Supprimer l'utilisateur
          </Button>
        </Box>
      )}
      {!user && (
        <Button type="submit" variant="primary">
          Créer l'utilisateur
        </Button>
      )}
    </form>
  );
};

export default () => {
  const { data: roles } = useQuery("roles", () => _get(`/api/v1/admin/roles/`), {
    refetchOnWindowFocus: false,
  });

  const { data: users } = useQuery("users", () => _get(`/api/v1/admin/users/`), {
    refetchOnWindowFocus: false,
  });

  const title = "Gestion des utilisateurs";
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
            <Accordion bg="white" allowToggle>
              {roles && (
                <AccordionItem mb={12}>
                  <AccordionButton bg="bluefrance" color="white" _hover={{ bg: "blue.700" }}>
                    <Box flex="1" textAlign="left" fontSize="gamma">
                      Créer un utilisateur
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4} border={"1px solid"} borderTop={0} borderColor={"bluefrance"}>
                    <UserLine user={null} roles={roles} />
                  </AccordionPanel>
                </AccordionItem>
              )}

              {roles &&
                users?.map((user) => {
                  return (
                    <AccordionItem key={user.username}>
                      {({ isExpanded }) => (
                        <>
                          <AccordionButton
                            _expanded={{ bg: "grey.200" }}
                            border={"1px solid"}
                            borderColor={"bluefrance"}
                          >
                            <Box flex="1" textAlign="left" fontSize="gamma">
                              {user.username} - {user.prenom} {user.nom}
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel pb={4} border={"1px solid"} borderTop={0} borderColor={"bluefrance"}>
                            {isExpanded && <UserLine user={user} roles={roles} />}
                          </AccordionPanel>
                        </>
                      )}
                    </AccordionItem>
                  );
                })}
            </Accordion>
          </Stack>
        </Container>
      </Box>
    </Layout>
  );
};
