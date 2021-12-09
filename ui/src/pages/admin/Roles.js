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
  VStack,
  Input,
  Stack,
  Flex,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import { Breadcrumb } from "../../common/components/Breadcrumb";
import { setTitle } from "../../common/utils/pageUtils";
import ACL from "./acl";

const specialsAcls = {
  "wks/page_espace/page_dossiers/voir_liste_dossiers": [
    "wks/page_espace/page_dossiers/voir_liste_dossiers/tous",
    "wks/page_espace/page_dossiers/voir_liste_dossiers/instruction_en_cours",
  ],
};

const shouldBeNotAllowed = (acl, ref) => {
  const isAncestorsAllowed = (acl, ref) => {
    const ancestorRef = ref.substring(0, ref.lastIndexOf("/"));
    const hasAncestor = ancestorRef !== "";
    if (hasAncestor) {
      return isAncestorsAllowed(acl, ancestorRef) && acl.includes(ref);
    } else {
      return acl.includes(ref);
    }
  };

  const parentRef = ref.substring(0, ref.lastIndexOf("/"));
  const isRootRef = parentRef === "";

  return isRootRef ? false : !isAncestorsAllowed(acl, parentRef);
};

const RoleLine = ({ role }) => {
  const specialskeys = Object.keys(specialsAcls);
  let specialValues = {};
  for (let index = 0; index < specialskeys.length; index++) {
    specialValues[`${specialskeys[index]}_SUB`] = "";
    for (let j = 0; j < specialsAcls[specialskeys[index]].length; j++) {
      const uniq = specialsAcls[specialskeys[index]][j];
      if (role?.acl.includes(uniq)) {
        specialValues[`${specialskeys[index]}_SUB`] = uniq;
      }
    }
  }

  const { values, handleSubmit, handleChange } = useFormik({
    initialValues: {
      newName: role?.name || "",
      newAcl: role?.acl || [],
      ...specialValues,
    },
    onSubmit: ({ newAcl, newName, ...rest }, { setSubmitting }) => {
      return new Promise(async (resolve, reject) => {
        let tmp = [...newAcl];
        const specialskeys = Object.keys(specialsAcls);
        for (let index = 0; index < specialskeys.length; index++) {
          tmp = tmp.filter((a) => !specialsAcls[specialskeys[index]].includes(a));
          tmp.push(rest[`${specialskeys[index]}_SUB`]);
        }

        const final = [];
        for (let index = 0; index < tmp.length; index++) {
          const aclRef = tmp[index];
          if (!shouldBeNotAllowed(tmp, aclRef)) {
            final.push(aclRef);
          }
        }

        try {
          if (role) {
            await _put(`/api/v1/admin/role/${role.name}`, {
              name: newName,
              acl: final,
            });
          } else {
            await _post(`/api/v1/admin/role/`, {
              name: newName,
              acl: final,
            });
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

  const rendreACL = (feature, deepth) => {
    return (
      <>
        {feature.map((item, i) => {
          let shouldBeDisabled = shouldBeNotAllowed(values.newAcl, item.ref);

          return (
            <Flex flexDirection="column" mb={deepth === 0 ? 5 : 2} key={`${item.ref}_${deepth}`} w="100%">
              <Box mb={2}>
                <Checkbox
                  name="newAcl"
                  onChange={handleChange}
                  value={item.ref}
                  isChecked={values.newAcl.includes(item.ref)}
                  isDisabled={shouldBeDisabled}
                  fontWeight={deepth < 2 ? "bold" : "none"}
                >
                  {item.feature}
                </Checkbox>
              </Box>
              {!item.uniqSubFeature && (
                <Box ml={5} pr={14}>
                  {item.subFeatures?.map((subitem, j) => {
                    if (subitem.subFeatures) {
                      return (
                        <Flex flexDirection="column" key={`${subitem.ref}_${deepth}`} ml={5}>
                          {rendreACL([subitem], deepth + 1)}
                        </Flex>
                      );
                    }

                    return (
                      <VStack spacing={5} ml={5} key={`${subitem.ref}_${deepth}`} alignItems="baseline">
                        <Checkbox
                          name="newAcl"
                          onChange={handleChange}
                          value={subitem.ref}
                          isChecked={values.newAcl.includes(subitem.ref)}
                          isDisabled={shouldBeDisabled || !values.newAcl.includes(item.ref)}
                        >
                          {subitem.feature}
                        </Checkbox>
                      </VStack>
                    );
                  })}
                </Box>
              )}
              {item.uniqSubFeature && (
                <Box ml={5} pr={14}>
                  <RadioGroup id={`${item.ref}_SUB`} name={`${item.ref}_SUB`} defaultValue={values[`${item.ref}_SUB`]}>
                    <VStack spacing={0} ml={5} alignItems="baseline">
                      {item.subFeatures?.map((subitem, j) => {
                        return (
                          <Radio
                            key={`${subitem.ref}_${deepth}`}
                            value={subitem.ref}
                            onChange={handleChange}
                            isDisabled={shouldBeDisabled || !values.newAcl.includes(item.ref)}
                          >
                            {subitem.feature}
                          </Radio>
                        );
                      })}
                    </VStack>
                  </RadioGroup>
                </Box>
              )}
            </Flex>
          );
        })}
      </>
    );
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
            <FormControl p={2}>{rendreACL(ACL, 0)}</FormControl>
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

export default ({ match }) => {
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
    <Layout match={match}>
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
