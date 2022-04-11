import React from "react";
import { Box, Spinner, Center } from "@chakra-ui/react";
import Head from "next/head";
import { Breadcrumb } from "../../../components/Breadcrumb/Breadcrumb";
import { Page } from "../../../components/Page/Page";
import { useRouter } from "next/router";

import WorkspaceLayout from "../../../components/Workspace/WorkspaceLayout";
import * as WorkspaceDossiers from "../../../components/Workspace/WorkspaceDossiers";
import * as SharedDossiers from "../../../components/Workspace/SharedDossiers";
import NouveauDossier from "../../../components/Dossier/NouveauDossier";
import Dossier from "../../../components/Dossier/Dossier";

import { useWorkspace } from "../../../hooks/useWorkspace";
import withAuth from "../../../components/withAuth";

const Loader = () => (
  <Center>
    <Spinner />
  </Center>
);

const MesDossiers = () => {
  const router = useRouter();
  // TODO REFACT SPLITTING SLUG
  const { part, slug = [] } = router.query;
  const isMySpacePage = part === "mon-espace" && !slug.length;
  const isSharedSpacePage = part === "espaces-partages" && slug?.[slug.length - 1] === "dossiers";
  const isSharedFolders = part === "dossiers-partages";

  const isNouveauDossier = slug.includes("nouveau-dossier");

  const isSpacePages = (isMySpacePage || isSharedSpacePage) && !isNouveauDossier && !isSharedFolders;
  const workspaceId = isSharedSpacePage ? slug?.[0] : null;

  const isDossierPage = !isSpacePages && !isNouveauDossier;
  const dossierId = isDossierPage ? slug?.[slug.length - 2] : null;

  let {
    isloaded,
    isReloaded,
    breadcrumbDetails,
    // paths,
    workspace,
  } = useWorkspace();

  if (!isloaded || !workspace) return <Spinner />;

  console.log(">", part, slug); //paths
  console.log(workspaceId, dossierId, isDossierPage, isNouveauDossier);

  return (
    <Page>
      <Head>
        <title>Mes dossiers</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Breadcrumb pages={breadcrumbDetails} loading={!isReloaded} />
      <Box>
        {/* /mon-espace ; /espaces-partages/:workspaceId/dossiers  */}
        {isSpacePages && (
          <WorkspaceLayout
            header={isReloaded && <WorkspaceDossiers.Header isSharedWorkspace={part === "espaces-partages"} />}
            content={!isReloaded ? <Loader /> : <WorkspaceDossiers.Content />}
          />
        )}

        {/* /dossiers-partages */}
        {isSharedFolders && !dossierId && (
          <WorkspaceLayout
            header={isReloaded && <SharedDossiers.Header />}
            content={!isReloaded ? <Loader /> : <SharedDossiers.Content />}
          />
        )}

        {/* /mon-espace/:id/:step ; /espaces-partages/:workspaceId/dossiers/:id/:step ; /dossiers-partages/:id/:step */}
        {isDossierPage && dossierId && <Dossier />}

        {/* /mon-espace/nouveau-dossier ; /espaces-partages/:workspaceId/dossiers/nouveau-dossier */}
        {isNouveauDossier && <NouveauDossier />}
      </Box>
    </Page>
  );
};

export default withAuth(MesDossiers);
