import React, { useState } from "react";
import { Box, Flex, Heading, Container, Button, Text } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { useDossier } from "../../common/hooks/useDossier";
import { setTitle } from "../../common/utils/pageUtils";

import Layout from "../layout/Layout";
import { Breadcrumb } from "../../common/components/Breadcrumb";

export default ({ match }) => {
  const { isloaded, createDossier, saveDossier } = useDossier();
  const [isCreating, setIsCreating] = useState(false);
  const history = useHistory();

  const title = "Commencer un nouveau dossier";
  setTitle(title);

  const onStartClicked = async () => {
    setIsCreating(true);
    const { _id } = await createDossier();
    setIsCreating(false);
    // TODO Temporary saved
    await saveDossier(_id);
    history.push(`/mon-espace/mes-dossiers/${_id}/cerfa`);
  };

  if (!isloaded) return null;

  return (
    <Layout match={match}>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]} color="grey.800">
        <Container maxW="xl">
          <Breadcrumb
            pages={[
              { title: "Accueil", to: "/" },
              { title: "Mes dossiers", to: "/mon-espace/mes-dossiers" },
              { title: "Nouveau dossier" },
            ]}
          />
        </Container>
      </Box>
      <Box w="100%" px={[1, 1, 12, 24]} mt={5}>
        <Container maxW="xl">
          <Heading as="h1" flexGrow="1">
            Créer un nouveau dossier
          </Heading>

          <Flex flexDir="column" width="100%" mt={9}>
            <Text>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an unknow.
              <br />
              <br />
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book. Qui velit provident est Quis aperiam sit placeat culpa. Sed
              fugiat quae aut officia eius est neque animi? Et esse delectus est perspiciatis Quis eum enim voluptate
              aut totam voluptatibus. Aut voluptates soluta sit delectus ipsa eum dolores officia.
              <br />
              <br />
              Sed consequuntur rerum sed minima consequuntur non quia voluptates aut cumque repellendus a cumque
              reprehenderit aut aspernatur commodi.
            </Text>
            <Flex width="100%" justifyContent="flex-end" mt={9}>
              <Button size="lg" onClick={onStartClicked} variant="primary" isLoading={isCreating}>
                Commencer la saisie
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Layout>
  );
};
