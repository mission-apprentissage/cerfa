import React from "react";
import { Badge, Text, Flex, Box, Divider, Wrap, WrapItem, Avatar } from "@chakra-ui/react";
import { prettyPrintDate } from "../../utils/dateUtils";

export default ({ data }) => {
  return (
    <Flex flexDirection="column">
      <Wrap>
        <WrapItem>
          <Avatar name={data.qui} />
        </WrapItem>
        <Flex flexDirection="column">
          <Flex alignItems="center">
            <Text textStyle="sm" fontWeight="bold">
              {data.qui}
            </Text>
            <Badge
              variant="solid"
              bg="greenmedium.300"
              borderRadius="16px"
              color="grey.800"
              textStyle="sm"
              px="15px"
              ml="10px"
            >
              {data.role}
            </Badge>
          </Flex>
          <Text textStyle="sm">{prettyPrintDate(data.dateAjout)}</Text>
        </Flex>
      </Wrap>
      <Box mt={5}>
        <Text textStyle="sm" mb={2}>
          {data.contenu}
        </Text>
        <Text textStyle="sm" color="bluefrance">
          {data.notifify.map((n) => `@${n} `)}
        </Text>
      </Box>
      <Divider borderWidth="2px" color="grey.500" mt={2} />
    </Flex>
  );
};
