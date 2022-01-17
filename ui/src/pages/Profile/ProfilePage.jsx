import React, { useState } from "react";
import { Box, Container, Flex, Heading } from "@chakra-ui/react";
import Layout from "../layout/Layout";
import ProfileInformation from "./components/ProfileInformation";
import ProfileNotification from "./components/ProfileNotification";
import { setTitle } from "../../common/utils/pageUtils";
import { Breadcrumb } from "../../common/components/Breadcrumb";

const ProfileLayout = () => {
  const [information, setInformation] = useState(true);
  const title = information ? "Mes Informations" : "Mes Notifications";
  setTitle(title);
  return (
    <Layout>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E">
        <Container maxW="xl">
          <Breadcrumb pages={[{ title: "Mon Compte", to: "/" }, { title: title }]} />
        </Container>
      </Box>
      <Flex>
        <Box w="30%" pt={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E">
          <Box
            borderLeft="2px solid"
            _hover={{ cursor: "pointer" }}
            borderColor={information ? "bluefrance" : "white"}
            color={information ? "bluefrance" : ""}
            onClick={() => setInformation(true)}
          >
            <Heading as="h2" fontSize="md" ml={3}>
              Mes informations
            </Heading>
          </Box>
          {/* <Box
            borderLeft="2px solid"
            _hover={{ cursor: "pointer" }}
            borderColor={!information ? "bluefrance" : "white"}
            color={!information ? "bluefrance" : ""}
            mt={10}
            onClick={() => setInformation(false)}
          >
            <Heading as="h2" fontSize="md" ml={3}>
              Mes notification
            </Heading>
          </Box> */}
        </Box>
        <Box w="100%" pt={[4, 8]}>
          {information ? <ProfileInformation /> : <ProfileNotification />}
        </Box>
      </Flex>
    </Layout>
  );
};

export default ProfileLayout;
