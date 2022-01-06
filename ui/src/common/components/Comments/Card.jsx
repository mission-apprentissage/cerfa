import React from "react";
import { Badge, Text, Flex, Box, Divider, Wrap, WrapItem, Avatar } from "@chakra-ui/react";
import { prettyPrintDate } from "../../utils/dateUtils";

export default ({ data }) => {
  return (
    <Flex flexDirection="column">
      <Wrap>
        <WrapItem>
          <Avatar name={data.createdBy} />
        </WrapItem>
        <Flex flexDirection="column">
          <Flex alignItems="center">
            <Text textStyle="sm" fontWeight="bold">
              {data.createdBy}
            </Text>
            <Text ml={1} fontWeight={700}>
              ({data.role})
            </Text>
          </Flex>
          <Text textStyle="sm">{prettyPrintDate(data.dateAjout)}</Text>
        </Flex>
      </Wrap>
      <Box mt={5}>
        <Text textStyle="sm" mb={2}>
          {data.contenu}
        </Text>
        <Text textStyle="sm" color="bluefrance">
          {data.notify.map((n) => `@${n} `)}
        </Text>
      </Box>
      <Divider color="grey.800" mt={2} />
    </Flex>
  );
};
