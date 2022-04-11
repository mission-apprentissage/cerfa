import React, { useState, useEffect, useCallback } from "react";
import {
  // Flex,
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
  // Container,
  // Switch,
  // Divider,
} from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ArrowRightLine, Close } from "../../theme/components/icons";
import { workspaceAtom } from "../../hooks/workspaceAtoms";
import { _put } from "../../common/httpClient";
import { Input } from "../Dossier/formEngine/components/Input/Input";

const ParameterModal = ({ isOpen, onClose, title = "Paramètres" }) => {
  const workspace = useRecoilValue(workspaceAtom);
  const setWorkspace = useSetRecoilState(workspaceAtom);
  const [wksNom, setWksNom] = useState(workspace?.nom || "");

  useEffect(() => {
    setWksNom(workspace?.nom || "");
  }, [workspace?.nom]);

  // TODO TextArea for description field

  const onSaveParametres = useCallback(async () => {
    try {
      const upwks = await _put(`/api/v1/workspace/entity/${workspace._id}/info`, {
        workspaceId: workspace._id,
        nom: wksNom,
      });
      setWorkspace({
        ...workspace,
        nom: upwks.nom,
      });
    } catch (error) {
      console.log(error);
    }
  }, [setWorkspace, wksNom, workspace]);

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
            {title}
          </Text>
        </ModalHeader>
        <ModalBody pb={6}>
          <Tabs variant="search">
            <TabList mb="1em" bg="white">
              <Tab pr="10rem">Général</Tab>
              {/* <Tab pr="10rem">Notifications</Tab> */}
            </TabList>
            <TabPanels>
              <TabPanel>
                <Box>
                  <Input
                    name="wks.parametres.nom"
                    label="Nom de l'espace :"
                    placeholder="Nom de l'espace."
                    value={wksNom}
                    maxLength={36}
                    mask="C"
                    maskBlocks={[
                      {
                        name: "C",
                        mask: "Pattern",
                        pattern: "^.*$",
                      },
                    ]}
                    mt={0}
                    onSubmit={setWksNom}
                  />

                  {/* <FormControl isRequired mt={2} isInvalid={errors.siret}>
                    <FormLabel>Siret</FormLabel>
                    <Input type="text" name="siret" value={values.siret} onChange={handleChange} required />
                    {errors.siret && touched.siret && <FormErrorMessage>{errors.siret}</FormErrorMessage>}
                  </FormControl> */}
                </Box>
              </TabPanel>
              {/* <TabPanel>
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
              </TabPanel> */}
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={onSaveParametres} type="submit">
            Enregistrer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ParameterModal;
