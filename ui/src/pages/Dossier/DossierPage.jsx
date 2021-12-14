import React, { lazy } from "react";
import { Box, Container } from "@chakra-ui/react";
import Layout from "../layout/Layout";
import { useRouteMatch } from "react-router-dom";
import { Breadcrumb } from "../../common/components/Breadcrumb";
import { useDossier } from "../../common/hooks/useDossier";

const Dossier = lazy(() => import("./Dossier"));

export default () => {
  let match = useRouteMatch();
  const { isloaded, dossier } = useDossier(match.params.id);

  if (!isloaded && !dossier) {
    return null;
  }
  return (
    <Layout>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E">
        <Container maxW="xl">
          <Breadcrumb
            pages={[
              { title: "Accueil", to: "/" },
              { title: "Partagés avec moi", to: "/partages-avec-moi" },
              { title: dossier.nom },
            ]}
          />
        </Container>
      </Box>
      <Box w="100%" py={[4, 4]} px={[1, 1, 12, 24]} color="#1E1E1E">
        <Dossier />
      </Box>
    </Layout>
  );
};
