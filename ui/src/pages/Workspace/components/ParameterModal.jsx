import React from "react";
import {
  Flex,
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  Container,
  Switch,
  Divider,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ArrowRightLine, Close } from "../../../theme/components/icons";

export default ({ isOpen, onClose }) => {
  const { values, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      spaceName: "",
      siret: "",
    },
    validationSchema: Yup.object().shape({
      spaceName: Yup.string(),
      siret: Yup.string(),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size={"4xl"}>
      <ModalOverlay />
      <ModalContent bg="white" color="primaryText" borderRadius="none">
        <Button
          display={"flex"}
          alignSelf={"flex-end"}
          color="bluefrance"
          fontSize={"epsilon"}
          onClick={() => {
            onClose();
          }}
          variant="unstyled"
          p={10}
          fontWeight={400}
        >
          Fermer{" "}
          <Text as={"span"} ml={2}>
            <Close boxSize={4} />
          </Text>
        </Button>
        <ModalHeader>
          <ArrowRightLine mt="-0.5rem" />
          <Text as="span" ml="1rem" textStyle={"h4"}>
            Paramètres
          </Text>
        </ModalHeader>
        <ModalBody pb={6}>
          <Tabs variant="search">
            <TabList mb="1em" bg="white">
              <Tab pr="10rem">Général</Tab>
              <Tab pr="10rem">Notifications</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Box>
                  <FormControl isRequired mt={2} isInvalid={errors.spaceName}>
                    <FormLabel>Nom de l'espace</FormLabel>
                    <Input type="text" name="spaceName" value={values.spaceName} onChange={handleChange} required />
                    {errors.spaceName && touched.spaceName && <FormErrorMessage>{errors.spaceName}</FormErrorMessage>}
                  </FormControl>
                  <FormControl isRequired mt={2} isInvalid={errors.siret}>
                    <FormLabel>Siret</FormLabel>
                    <Input type="text" name="siret" value={values.siret} onChange={handleChange} required />
                    {errors.siret && touched.siret && <FormErrorMessage>{errors.siret}</FormErrorMessage>}
                  </FormControl>
                </Box>
              </TabPanel>
              <TabPanel>
                <Box w="100%" color="#1E1E1E">
                  <Container maxW="xl">
                    <Box mt={5}>
                      <Text textStyle="h6">Groupe de notifications</Text>
                      <Box>
                        <Flex mt={5}>
                          <Text flex="1">Description de la notification</Text>
                          <Switch variant="icon" />
                        </Flex>
                        <Divider orientation="horizontal" mt={5} />
                        <Flex mt={5}>
                          <Text flex="1">Description de la notification</Text>
                          <Switch variant="icon" />
                        </Flex>
                        <Divider orientation="horizontal" mt={5} />
                      </Box>
                    </Box>
                    <Box mt={5}>
                      <Text textStyle="h6">Groupe de notifications</Text>
                      <Box>
                        <Flex mt={5}>
                          <Text flex="1">Description de la notification</Text>
                          <Switch variant="icon" />
                        </Flex>
                        <Divider orientation="horizontal" mt={5} />
                        <Flex mt={5}>
                          <Text flex="1">Description de la notification</Text>
                          <Switch variant="icon" />
                        </Flex>
                        <Divider orientation="horizontal" mt={5} />
                      </Box>
                    </Box>
                  </Container>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={handleSubmit} type="submit">
            Enregistrer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
