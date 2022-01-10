import React from "react";
import { Icon, Flex, Box } from "@chakra-ui/react";

const TooltipIconInfo = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM11 11V17H13V11H11ZM11 7V9H13V7H11Z"
      fill="currentColor"
    />
  </Icon>
);

const TooltipIconAlert = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z"
      fill="currentColor"
    />
  </Icon>
);
const Tooltip = ({ variant, children }) => {
  return (
    <Box>
      <Flex border={variant === "alert" ? "1px solid ##B34000" : "1px solid #0063CB"} w="15%">
        <Box bg={variant === "alert" ? "#B34000" : "#0063CB"} p={2}>
          {variant === "alert" ? (
            <TooltipIconAlert mx="auto" mt={3} w="30px" h="30px" color="white" />
          ) : (
            <TooltipIconInfo mx="auto" mt={3} w="30px" h="30px" color="white" />
          )}
        </Box>
        <Box mx="1rem" py={5}>
          {children}
        </Box>
      </Flex>
    </Box>
  );
};

export default Tooltip;
