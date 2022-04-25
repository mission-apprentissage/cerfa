import React from "react";
import { Box, UnorderedList, ListItem } from "@chakra-ui/react";

export const betaVersion = () => {
  return "v1.0.0";
};

export const BetaFeatures = (props) => {
  return (
    <Box {...props}>
      <UnorderedList>
        <ListItem>La signatures électronique</ListItem>
      </UnorderedList>
    </Box>
  );
};
