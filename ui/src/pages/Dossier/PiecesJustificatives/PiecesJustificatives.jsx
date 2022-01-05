import React, { lazy } from "react";
import { Box } from "@chakra-ui/react";

const UploadFiles = lazy(() => import("./components/UploadFiles"));

export default () => {
  return (
    <Box mt={8} pt={2}>
      <UploadFiles title="Convention de formation" typeDocument="CONVENTION_FORMATION" onUploadSuccessed={() => {}} />
      <UploadFiles
        title="Convention d'aménagement de durée"
        typeDocument="CONVENTION_REDUCTION_DUREE"
        onUploadSuccessed={() => {}}
      />
    </Box>
  );
};
