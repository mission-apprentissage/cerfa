import React from "react";
import { Box, Spinner, Center } from "@chakra-ui/react";
import Head from "next/head";
import { Breadcrumb } from "../../../components/Breadcrumb/Breadcrumb";
import { Page } from "../../../components/Page/Page";
import { useRouter } from "next/router";

import WorkspaceLayout from "../../../components/Workspace/WorkspaceLayout";
import * as WorkspaceDossiers from "../../../components/Workspace/WorkspaceDossiers";
import NouveauDossier from "../../../components/Dossier/NouveauDossier";

import { useWorkspace } from "../../../hooks/useWorkspace";
import withAuth from "../../../components/withAuth";

const Loader = () => (
  <Center>
    <Spinner />
  </Center>
);

const MesDossiers = () => {
  const router = useRouter();
  const { part, slug } = router.query;
  let {
    isloaded,
    isReloaded,
    breadcrumbDetails,
    // paths,
    workspace,
  } = useWorkspace();

  if (!isloaded || !workspace) return <Spinner />;
  console.log(">", part, slug); //paths
  return (
    <Page>
      <Head>
        <title>Mes dossiers</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Breadcrumb pages={breadcrumbDetails} loading={!isReloaded} />
      <Box>
        {/* mes-dossiers/mon-espace 
            mes-dossiers/espaces-partages/:workspaceId/dossiers  */}
        {part === "mon-espace" && !slug && (
          <WorkspaceLayout
            header={isReloaded && <WorkspaceDossiers.Header />}
            content={!isReloaded ? <Loader /> : <WorkspaceDossiers.Content />}
          />
        )}
        {/* /mes-dossiers/dossiers-partages */}

        {/* mes-dossiers/mon-espace/:id/:step
            mes-dossiers/espaces-partages/:workspaceId/dossiers/:id/:step  
            /mes-dossiers/dossiers-partages/:id/:step  
            */}

        {/* /mes-dossiers/mon-espace/nouveau-dossier 
            /mes-dossiers/espaces-partages/${workspaceId}/dossiers/nouveau-dossier */}
        {part === "mon-espace" && slug?.[0] === "nouveau-dossier" && <NouveauDossier />}
      </Box>
    </Page>
  );
};

export default withAuth(MesDossiers);
