import React from "react";
import {
  Icon,
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Wrap,
  WrapItem,
  Avatar,
  Flex,
  Text,
  Badge,
  Stack,
} from "@chakra-ui/react";
import { prettyPrintDate } from "../utils/dateUtils";

const TooltipIcon = (props) => (
  <Icon viewBox="0 0 24 24" w="24px" h="24px" {...props}>
    <path
      d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z"
      fill="currentColor"
    />
  </Icon>
);

const InfoTooltip = ({ description, example, history, noHistory }) => {
  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <IconButton icon={<TooltipIcon color={"grey.700"} w="23px" h="23px" />} />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader fontWeight="bold">Description</PopoverHeader>
        <PopoverBody>
          <Stack>
            <Text dangerouslySetInnerHTML={{ __html: description }} />
            <Text as="samp">Exemple: {example}</Text>
          </Stack>
        </PopoverBody>
        {history && !noHistory && (
          <>
            <PopoverHeader fontWeight="bold">Historique</PopoverHeader>
            <PopoverBody>
              {history?.map((entry, i) => {
                return (
                  <Wrap key={i} mb={3}>
                    <WrapItem>
                      <Avatar name={entry.who} size="xs" />
                    </WrapItem>
                    <Flex flexDirection="column">
                      <Flex alignItems="center">
                        <Text textStyle="sm" fontWeight="bold">
                          {entry.who}
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
                          {entry.role}
                        </Badge>
                      </Flex>
                      <Text textStyle="xs">{prettyPrintDate(entry.when)}</Text>
                    </Flex>
                    <Text textStyle="sm" mt="0">
                      A modifié(e) la valeur du champ par {entry.to}
                    </Text>
                  </Wrap>
                );
              })}
            </PopoverBody>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default InfoTooltip;