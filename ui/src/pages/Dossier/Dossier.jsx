import React from "react";
import { setTitle } from "../../common/utils/pageUtils";
import { Box } from "@chakra-ui/react";
import Layout from "../layout/Layout";
import Cerfa from "./Cerfa/Cerfa";

export default () => {
  const title = "Nouveau contrat";
  setTitle(title);
  return (
    <Layout>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]}>
        <Cerfa />
      </Box>
    </Layout>
  );
};
