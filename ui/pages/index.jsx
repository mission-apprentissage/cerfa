import Head from "next/head";
import { Box, Container, Heading, Text, UnorderedList, ListItem, Button, Flex, Link } from "@chakra-ui/react";
import { Page } from "../components/Page/Page";
import { Breadcrumb } from "../components/Breadcrumb/Breadcrumb";
import NavLink from "next/link";

function Home({ data }) {
  console.log(data);
  const title = "Accueil";
  return (
    <Page>
      <Head>
        <title>Contrat apprentissage employeur public dématérialisé pour la fonction publique</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E">
        <Container maxW="xl">
          <Breadcrumb pages={[{ title: title }]} />
        </Container>
      </Box>
      <Box w="100%" py={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E">
        <Container maxW="xl">
          <Heading as="h1" fontSize="lg">
            Plateforme de saisie en ligne des contrats d&apos;apprentissage pour les employeurs publics.
          </Heading>
          <Box pt={4} pb={16} mt={8}>
            <Text>
              Vous pouvez générer le cerfa du contrat d&apos;apprentissage lorsque vous êtes :
              <br />
              <br />
            </Text>
            <UnorderedList ml="30px !important">
              <ListItem>
                un employeur public, relevant de la fonction publique d&apos;Etat, de la fonction publique territoriale
                ou de la fonction publique hospitalière ;
              </ListItem>
              <ListItem>un organisme de formation formant un apprenti en contrat chez un employeur public.</ListItem>
            </UnorderedList>
            <Text mt={8}>
              Cette plateforme propose :<br />
              <br />
            </Text>
            <UnorderedList ml="30px !important">
              <ListItem>le pré-remplissage d&apos;un maximum des éléments attendus ;</ListItem>
              <ListItem>un contrôle de cohérence et de réglementation de la donnée saisie ;</ListItem>
              <ListItem>
                la collaboration entre contributeurs (employeurs ou Centre de Formation des Apprentis) pour compléter le
                document ;
              </ListItem>
              <ListItem>la télétransmission du contrat à la place des envois par email ou courrier.</ListItem>
            </UnorderedList>
          </Box>
          <Flex justifyContent="end" w="full">
            <NavLink href={"/mes-dossiers/mon-espace"} passHref>
              <Button
                as={Link}
                fontSize={{ base: "md", md: "lg" }}
                p={{ base: 4, md: 6 }}
                h={{ base: 8, md: 10 }}
                variant="primary"
              >
                Accéder maintenant
              </Button>
            </NavLink>
          </Flex>
        </Container>
      </Box>
    </Page>
  );
}

export async function getServerSideProps() {
  // Fetch data from external API TEST
  const res = await fetch(`https://zoo-animal-api.herokuapp.com/animals/rand`);
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}

export default Home;
