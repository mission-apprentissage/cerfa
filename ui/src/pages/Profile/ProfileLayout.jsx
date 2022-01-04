import React, { useState } from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import Layout from "../layout/Layout";
import ProfileInformation from "./components/ProfileInformation";
import NotificationPage from "./components/ProfileNotification";

const ProfileLayout = () => {
  const [information, setInformation] = useState(true);
  return (
    <Layout>
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
          <Box
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
          </Box>
        </Box>
        <Box w="100%" pt={[4, 8]}>
          {information ? <ProfileInformation /> : <NotificationPage />}
        </Box>
      </Flex>
    </Layout>
  );
};

export default ProfileLayout;
