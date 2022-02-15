import React from "react";
import { Icon as CIcon, Flex, Box, Spinner } from "@chakra-ui/react";
import { ErrorIcon, ValidateIcon } from "../../theme/components/icons/index";

const RibbonsIconInfo = (props) => (
  <CIcon viewBox="0 0 24 24" {...props}>
    <path
      d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM11 11V17H13V11H11ZM11 7V9H13V7H11Z"
      fill="currentColor"
    />
  </CIcon>
);

const RibbonsIconAlert = (props) => (
  <CIcon viewBox="0 0 24 24" {...props}>
    <path
      d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z"
      fill="currentColor"
    />
  </CIcon>
);

const colorsMap = {
  success: "flatsuccess",
  error: "flaterror",
  warning: "flatwarm",
  info: "plaininfo",
  unstyled: "grey.600",
};

const Icon = ({ variant, ...rest }) => {
  switch (variant) {
    case "success":
      return <ValidateIcon {...rest} />;
    case "error":
      return <ErrorIcon {...rest} />;
    case "warning":
      return <RibbonsIconAlert {...rest} />;
    case "info":
      return <RibbonsIconInfo {...rest} />;
    case "unstyled":
      return <Spinner {...rest} />;
    default:
      return <RibbonsIconInfo {...rest} />;
  }
};

const Ribbons = ({ variant = "info", oneLiner = true, children, ...rest }) => {
  return (
    <Box {...rest}>
      <Flex borderColor={colorsMap[variant]} borderLeftWidth={"4px"} borderStyle={"solid"} bg="galt2" py={3}>
        {oneLiner && (
          <Flex px={4} alignItems="center">
            <Icon variant={variant} mx="auto" boxSize="4" color={colorsMap[variant]} mt="0.125rem" />
          </Flex>
        )}
        <Flex color={colorsMap[variant]} alignItems="center" justifyContent="center" flexDirection="column">
          {children}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Ribbons;
