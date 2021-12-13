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
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ArrowRightLine, Close } from "../../../theme/components/icons";

const InviteModal = ({ title, size = "md", roles, isOpen, onClose, onInvite, defaultRoleValue = undefined }) => {
  const { values, handleChange, handleSubmit, errors, touched, resetForm } = useFormik({
    initialValues: {
      userEmail: "",
      roleId: defaultRoleValue || roles[0]._id,
    },
    validationSchema: Yup.object().shape({
      userEmail: Yup.string().email("L'email n'est pas au bon format").required("L'email est obligatoire"),
      roleId: Yup.string().required("Le role est obligatoire"),
    }),
    onSubmit: ({ userEmail, roleId }) => {
      return new Promise(async (resolve) => {
        onInvite({ userEmail, roleId });
        resetForm();
        onClose();
        resolve("onSubmitHandler publish complete");
      });
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      size="4xl"
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
          <Box px={[4, 8]} mb={5}>
            <Flex flexDirection="column">
              <HStack spacing={3}>
                <Input
                  size={size}
                  type="email"
                  name="userEmail"
                  onChange={handleChange}
                  value={values["userEmail"]}
                  required
                  placeholder="Renseigner un e-mail"
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
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export { InviteModal };
