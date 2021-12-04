import React, { lazy } from "react";
import { Box } from "@chakra-ui/react";

const UploadFiles = lazy(() => import("../../../common/components/UploadFiles"));

export default () => {
  return (
    <Box mt={16}>
      Pieces jointes
      <UploadFiles />
    </Box>
  );
};
