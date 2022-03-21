import { Icon } from "@chakra-ui/react";
import React from "react";

export function Comment(props) {
  return (
    <Icon viewBox="0 0 24 24" w="24px" h="24px" {...props}>
      <path fill="currentColor" d="M0 0h24v24H0z" />
      <path d="M6.455 19L2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.455zm-.692-2H20V5H4v13.385L5.763 17zM11 10h2v2h-2v-2zm-4 0h2v2H7v-2zm8 0h2v2h-2v-2z" />
    </Icon>
  );
}
