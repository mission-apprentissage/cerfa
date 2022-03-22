import {
  Flex,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Link,
  Text,
  Divider,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import NavLink from "next/link";

import useAuth from "../../hooks/useAuth";
import useToken from "../../hooks/useToken";
import { _post, _get } from "../../common/httpClient";

import { ExternalLinkLine } from "../../theme/components/icons";

const Login = () => {
  const [, setAuth] = useAuth();
  const [, setToken] = useToken();
  const router = useRouter();

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
    <Flex w="full" flexDirection="column">
      <Box>
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
                        <Input {...field} id={field.name} placeholder="Votre email..." />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="password">
                    {({ field, meta }) => {
                      return (
                        <FormControl isRequired isInvalid={meta.error && meta.touched} mb={5}>
                          <FormLabel>Mot de passe</FormLabel>
                          <Input {...field} id={field.name} type="password" placeholder="Votre mot de passe..." />
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        </FormControl>
                      );
                    }}
                  </Field>
                </Box>
                <HStack spacing="4w" mt={8}>
                  <Button variant="primary" type="submit">
                    Connexion
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
      </Box>
      <Box mt={12}>
        <Text fontSize="1rem">
          Vous n&apos;avez pas encore de compte ?
          <Link href="/auth/inscription" as={NavLink} color="bluefrance" ml={3}>
            Créer un compte
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default Login;
