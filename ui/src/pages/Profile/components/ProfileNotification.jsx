import React from "react";
import { Box, Container, Heading, Flex, Text, Switch, Divider } from "@chakra-ui/react";
import { setTitle } from "../../../common/utils/pageUtils";

const NotificationPage = () => {
  const title = "Mes Notifications";
  setTitle(title);

  return (
    <Box w="100%" color="#1E1E1E">
      <Container maxW="xl">
        <Box mr="15rem">
          <Heading as="h1" fontSize="32px">
            Mes notifications
          </Heading>
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
        </Box>
      </Container>
    </Box>
  );
};

export default NotificationPage;
