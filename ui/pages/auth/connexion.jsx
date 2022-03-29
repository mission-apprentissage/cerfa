import {
  Flex,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  InputGroup,
  Input,
  InputRightElement,
  Link,
  Text,
  Divider,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import NavLink from "next/link";
import Head from "next/head";
import { Page } from "../../components/Page/Page";

import useAuth from "../../hooks/useAuth";
import useToken from "../../hooks/useToken";
import { _post, _get } from "../../common/httpClient";

import { ShowPassword } from "../../theme/components/icons";

const Login = (props) => {
  const [, setAuth] = useAuth();
  const [, setToken] = useToken();
  const router = useRouter();

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const login = async (values, { setStatus }) => {
    try {
      const result = await _post("/api/v1/auth/login", values);
      if (result.loggedIn) {
        const user = jwt.decode(result.token);
        setAuth(user);
        setToken(result.token);
        if (!user.confirmed) {
          router.push(`/en-attente-confirmation`);
        } else {
          router.push("/");
        }
      }
    } catch (e) {
      if (e.messages?.details?.message === "pds login") {
        setStatus({ error: "Veuillez vous connecter avec le portail de service." });
      } else {
        console.error(e);
        setStatus({ error: e.prettyMessage });
      }
    }
  };

  return (
    <Flex {...props}>
      <Heading as="h2" fontSize="2xl" mb={[3, 6]}>
        J&apos;ai déjà un compte
      </Heading>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={Yup.object().shape({
          username: Yup.string().required("Requis"),
          // TODO email only (username login removed 16/03/22)
          password: Yup.string().required("Requis"),
        })}
        onSubmit={login}
      >
        {({ status = {} }) => {
          return (
            <Form>
              <Box>
                <Field name="username">
                  {({ field, meta }) => (
                    <FormControl isRequired isInvalid={meta.error && meta.touched} mb={5}>
                      <FormLabel>Identifiant</FormLabel>
                      <Input {...field} id={field.name} placeholder="Exemple : prenom.nom@mail.com" />
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="password">
                  {({ field, meta }) => {
                    return (
                      <FormControl isRequired isInvalid={meta.error && meta.touched} mb={5}>
                        <FormLabel>Mot de passe</FormLabel>
                        <InputGroup size="md">
                          <Input
                            {...field}
                            id={field.name}
                            type={show ? "text" : "password"}
                            placeholder="Votre mot de passe..."
                          />
                          <InputRightElement width="2.5rem">
                            <ShowPassword boxSize={5} onClick={handleClick} />
                          </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    );
                  }}
                </Field>
              </Box>
              <HStack spacing="4w" mt={8}>
                <Button variant="primary" type="submit">
                  Se connecter
                </Button>
                <Link href="/auth/forgotten-password" as={NavLink} color="grey.600">
                  Mot de passe oublié
                </Link>
              </HStack>
              {status.error && (
                <Text color="error" mt={2}>
                  {status.error}
                </Text>
              )}
            </Form>
          );
        }}
      </Formik>
      <Box mt={12}>
        <Text fontSize="1rem">
          <Link href="/auth/inscription" as={NavLink} color="bluefrance" ml={3}>
            &gt; Je n&apos;ai pas encore de compte
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

const ConnexionPage = () => {
  const styleProps = {
    flexBasis: "50%",
    p: 12,
    justifyContent: "center",
  };
  const [linkToPds, setLinkToPds] = useState(null);

  useEffect(() => {
    const run = async () => {
      const data = await _get(`/api/v1/pds/getUrl`);
      setLinkToPds(data.authorizationUrl);
    };
    run();
  }, []);

  return (
    <Page>
      <Head>
        <title>Connexion</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex w="full" maxW="xl" mt={4}>
        <Login {...styleProps} flexDirection="column" border="1px solid" borderColor="openbluefrance" />
        <Flex {...styleProps}>
          <VStack spacing={6}>
            <Divider orientation="vertical" color="dgalt" />
            <Text fontSize="1rem">Ou</Text>
            <Divider orientation="vertical" color="dgalt" />
          </VStack>
          <Flex flexDirection="column" justifyContent="center" ml={12}>
            <Heading as="h2" fontSize="2xl" mb={[3, 6]}>
              Mes Démarches Emploi et Formation
            </Heading>
            <Button variant="secondary" type="submit" as={Link} href={linkToPds} isExternal>
              Se connecter avec le Portail de Services
              {/* <ExternalLinkLine w={"0.75rem"} h={"0.75rem"} ml={"0.25rem"} mt={"0.125rem"} /> */}
            </Button>
            <Box mt={6}>
              <Text fontSize="1rem" color="mgalt" fontStyle="italic">
                Vous allez être redirigé vers le Portail de Services.
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Page>
  );
};

export default ConnexionPage;
