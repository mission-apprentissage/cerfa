import React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Input,
  Select,
  HStack,
  Spinner,
  Avatar,
  Center,
  Link,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRecoilValue } from "recoil";
import { DateTime } from "luxon";
import { ArrowRightLine, Close, Question } from "../../../theme/components/icons";
import { useQueries, useQueryClient, useMutation } from "react-query";
import { _get, _post, _put, _delete } from "../../../common/httpClient";
import { workspaceAtom } from "../../../common/hooks/workspaceAtoms";
import { Table } from "../../../common/components/Table";
import { hasContextAccessTo } from "../../../common/utils/rolesUtils";
import { NavLink } from "react-router-dom";

function useWorkspaceParametresAcces() {
  const workspace = useRecoilValue(workspaceAtom);
  const [
    { data: workspaceContributors, isLoading: isLoadingContributors, isFetching: isFetchingContributors },
    { data: roles, isLoading: isLoadingRoles, isFetching: isFetchingRoles },
  ] = useQueries([
    {
      queryKey: ["wksContributors", 1],
      queryFn: () => _get(`/api/v1/workspace/contributors?workspaceId=${workspace._id}`),
      refetchOnWindowFocus: false,
    },
    {
      queryKey: ["wksroles", 2],
      queryFn: () => _get(`/api/v1/workspace/roles_list?workspaceId=${workspace._id}`),
      refetchOnWindowFocus: false,
    },
  ]);

  return {
    workspaceContributors,
    roles: roles || [],
    initRole: roles?.length > 0 ? roles[0]._id : "",
    isLoading: isLoadingContributors || isLoadingRoles || isFetchingRoles || isFetchingContributors,
  };
}

const InviteModal = ({ title, size = "md", isOpen, onClose, onInvite, defaultRoleValue = undefined }) => {
  const queryClient = useQueryClient();
  const { workspaceContributors, roles, isLoading, initRole } = useWorkspaceParametresAcces();
  const workspace = useRecoilValue(workspaceAtom);

  const onAddContributor = useMutation(
    ({ userEmail, roleId, acl = [] }) => {
      return _post(`/api/v1/workspace/contributors`, {
        workspaceId: workspace._id,
        userEmail,
        roleId,
        acl,
      });
    },
    {
      onSuccess: () => queryClient.invalidateQueries("wksContributors"),
    }
  );

  const onChangeContributorRole = useMutation(
    ({ userEmail, roleId, acl = [] }) => {
      return _put(`/api/v1/workspace/contributors`, {
        workspaceId: workspace._id,
        userEmail,
        roleId,
        acl,
      });
    },
    {
      onSuccess: () => queryClient.invalidateQueries("wksContributors"),
    }
  );

  const onDeleteContributor = useMutation(
    (contributor) => {
      // eslint-disable-next-line no-restricted-globals
      const remove = confirm("Voulez-vous vraiment retirer l'accès de cet utilisateur ?");
      if (remove) {
        try {
          return _delete(
            `/api/v1/workspace/contributors?workspaceId=${workspace._id}&userEmail=${contributor.user.email.replace(
              "+",
              "%2B"
            )}&permId=${contributor.permission.permId}`
          );
        } catch (e) {
          console.error(e);
        }
      }
      return Promise.reject();
    },
    {
      onSuccess: () => queryClient.invalidateQueries("wksContributors"),
    }
  );

  const { values, handleChange, handleSubmit, errors, touched, resetForm } = useFormik({
    initialValues: {
      userEmail: "",
      roleId: initRole,
    },
    validationSchema: Yup.object().shape({
      userEmail: Yup.string().email("L'email n'est pas au bon format").required("L'email est obligatoire"),
      roleId: Yup.string().required("Le rôle est obligatoire"),
    }),
    onSubmit: ({ userEmail, roleId }) => {
      return new Promise(async (resolve) => {
        await onAddContributor.mutate({ userEmail, roleId });
        resetForm();
        resolve("onSubmitHandler publish complete.");
      });
    },
  });

  if (isLoading) return null;

  // console.log(workspaceContributors); // TODO separate component to avoid re-rendering when submit form

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      size="6xl"
    >
      <ModalOverlay />
      <ModalContent bg="white" color="primaryText" borderRadius="none">
        <Button
          display={"flex"}
          alignSelf={"flex-end"}
          color="bluefrance"
          fontSize={"epsilon"}
          onClick={() => {
            resetForm();
            onClose();
          }}
          variant="unstyled"
          p={8}
          fontWeight={400}
        >
          Fermer{" "}
          <Text as={"span"} ml={2}>
            <Close boxSize={4} />
          </Text>
        </Button>
        <ModalHeader px={[4, 8]} pt={[3, 3]} pb={[3, 6]}>
          <Heading as="h2" fontSize="1.7rem">
            <Flex>
              <Text as={"span"}>
                <ArrowRightLine boxSize={26} />
              </Text>
              <Text as={"span"} ml={4}>
                {title}
              </Text>
            </Flex>
          </Heading>
        </ModalHeader>
        <ModalBody p={0}>
          {isLoading && <Spinner />}
          {!isLoading && (
            <Box px={[4, 8]} mb={5}>
              <Text textStyle="xs">
                <Question w="10px" h="10px" mt="-0.2rem" /> Une question sur un rôle ? Consulter la{" "}
                <Link
                  color="bluefrance"
                  as={NavLink}
                  to={"/assistance/faq#31d725e0aa704c11b7b3e02534b2c971"}
                  isExternal
                >
                  FAQ
                </Link>
              </Text>
              <Flex flexDirection="column" py={5}>
                <HStack spacing={3}>
                  <Input
                    size={size}
                    type="email"
                    name="userEmail"
                    onChange={handleChange}
                    value={values["userEmail"]}
                    required
                    placeholder="Renseigner un courriel"
                    variant="outline"
                    isInvalid={errors.userEmail && touched.userEmail}
                    outlineOffset="0px"
                    _focus={{
                      boxShadow: "none",
                      outlineColor: "none",
                    }}
                    _focusVisible={{
                      boxShadow: "none",
                      outline: "2px solid",
                      outlineColor: errors.userEmail && touched.userEmail ? "error" : "#2A7FFE",
                    }}
                    _invalid={{
                      borderBottomColor: "error",
                      boxShadow: "none",
                      outline: "2px solid",
                      outlineColor: "error",
                    }}
                  />
                  <Select
                    name="roleId"
                    size={size}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    onChange={handleChange}
                    iconColor={"gray.800"}
                    data-testid={"actions-roles"}
                    w="30%"
                  >
                    {roles.map((role, j) => {
                      return (
                        <option key={role._id + j} value={role._id}>
                          {role.title}
                        </option>
                      );
                    })}
                  </Select>
                  <Button
                    size={size}
                    type="submit"
                    variant={values.userEmail !== "" ? "primary" : "secondary"}
                    onClick={handleSubmit}
                    loadingText="Enregistrement des modifications"
                    isDisabled={values.userEmail === ""}
                    px={6}
                  >
                    Inviter
                  </Button>
                </HStack>
                {errors.userEmail && touched.userEmail && (
                  <Box color="tomato" my={2}>
                    {errors.userEmail}
                  </Box>
                )}
              </Flex>
              <Flex mt={8}>
                <Table
                  data={workspaceContributors.map((d) => ({
                    CreatedAt: {
                      Header: "Ajouté le",
                      width: 50,
                      value: d.permission.addedAt,
                    },
                    Username: {
                      Header: "Utilisateur",
                      width: 120,
                      value: "",
                    },
                    Email: {
                      Header: "Courriel",
                      width: 150,
                      value: d.user.email,
                    },
                    Role: {
                      Header: "Rôle pour l'espace",
                      width: 80,
                      value: d.permission.name,
                    },
                    Actions: {
                      Header: "Actions",
                      width: 40,
                      value: null,
                    },
                  }))}
                  components={{
                    CreatedAt: (value, i) => {
                      return <>{DateTime.fromISO(value).setLocale("fr-FR").toLocaleString()}</>;
                    },
                    Username: (value, i) => {
                      const constrib = workspaceContributors[i];
                      const hasAccount = constrib.user.prenom && constrib.user.nom;
                      const username = hasAccount
                        ? `${constrib.user.prenom} ${constrib.user.nom}`
                        : `Invité non vérifié`;
                      return (
                        <HStack>
                          <Avatar size="sm" name={hasAccount ? username : ""} />
                          <Text>{username}</Text>
                          {constrib.user.type && <Text fontWeight="bold">{`(${constrib.user.type})`}</Text>}
                        </HStack>
                      );
                    },
                    Role: (value, i) => {
                      return (
                        <Box w="full">
                          {workspaceContributors[i].owner && <Text as="i">Propriétaire</Text>}
                          {!workspaceContributors[i].owner && (
                            <Select
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              onChange={async (e) => {
                                const roleId = e.target.value;
                                if (roleId === "custom") {
                                  console.log("TODO");
                                } else {
                                  onChangeContributorRole.mutate({
                                    userEmail: workspaceContributors[i].user.email,
                                    roleId,
                                  });
                                }
                              }}
                              iconColor={"gray.800"}
                              data-testid={"actions-select"}
                              value={
                                workspaceContributors[i].permission.name === "wks.custom"
                                  ? "custom"
                                  : workspaceContributors[i].permission._id
                              }
                            >
                              {roles.map((role, j) => {
                                return (
                                  <option key={role._id + j} value={role.name === "wks.custom" ? "custom" : role._id}>
                                    {role.title}
                                  </option>
                                );
                              })}
                            </Select>
                          )}
                        </Box>
                      );
                    },
                    Actions: (value, i) => {
                      return (
                        <Center pl={5}>
                          {!workspaceContributors[i].owner &&
                            hasContextAccessTo(
                              workspace,
                              "wks/page_espace/page_parametres/gestion_acces/supprimer_contributeur"
                            ) && (
                              <CloseIcon
                                color="bluefrance"
                                onClick={async () => {
                                  onDeleteContributor.mutate(workspaceContributors[i]);
                                }}
                                cursor="pointer"
                              />
                            )}
                        </Center>
                      );
                    },
                  }}
                />
              </Flex>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export { InviteModal };
