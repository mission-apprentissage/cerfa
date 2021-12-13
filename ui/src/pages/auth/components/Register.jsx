import { Box, Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, Link, Text } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import * as Yup from "yup";
import jwt from "jsonwebtoken";

import useAuth from "../../../common/hooks/useAuth";
import useToken from "../../../common/hooks/useToken";
import { _post } from "../../../common/httpClient";

const Login = () => {
  const [, setAuth] = useAuth();
  const [, setToken] = useToken();
  const history = useHistory();

  const login = async (values, { setStatus }) => {
    try {
      const result = await _post("/api/v1/auth/login", values);
      if (result.loggedIn) {
        const user = jwt.decode(result.token);
        setAuth(user);
        setToken(result.token);
        history.push("/mon-espace/mes-dossiers");
      }
    } catch (e) {
      console.error(e);
      setStatus({ error: e.prettyMessage });
    }
  };

  return (
    <Box width={["auto", "28rem"]}>
      <Box>
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={Yup.object().shape({
            username: Yup.string().required("Requis"),
            email: Yup.string().email("Format invalide").required("Requis"),
            nom: Yup.string().required("Requis"),
            prenom: Yup.string().required("Requis"),
            telephone: Yup.string().required("Requis"),
            password: Yup.string().required("Requis"),
          })}
          onSubmit={login}
        >
          {({ status = {} }) => {
            return (
              <Form>
                <Box marginBottom="2w">
                  <Field name="username">
                    {({ field, meta }) => (
                      <FormControl isRequired isInvalid={meta.error && meta.touched} marginBottom="2w">
                        <FormLabel>Identifiant</FormLabel>
                        <Input {...field} id={field.name} placeholder="Votre identifiant..." />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="email">
                    {({ field, meta }) => (
                      <FormControl py={2} isRequired isInvalid={meta.error && meta.touched}>
                        <FormLabel>Email</FormLabel>
                        <Input {...field} id={field.name} placeholder="Votre email..." />
                      </FormControl>
                    )}
                  </Field>

                  <Field name="nom">
                    {({ field, meta }) => (
                      <FormControl py={2} isRequired isInvalid={meta.error && meta.touched}>
                        <FormLabel>Nom</FormLabel>
                        <Input {...field} id={field.name} placeholder="Votre nom" />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="prenom">
                    {({ field, meta }) => (
                      <FormControl py={2} isRequired isInvalid={meta.error && meta.touched}>
                        <FormLabel>Prénom</FormLabel>
                        <Input {...field} id={field.name} placeholder="Votre prénom" />
                      </FormControl>
                    )}
                  </Field>

                  <Field name="telephone">
                    {({ field, meta }) => (
                      <FormControl py={2} isRequired isInvalid={meta.error && meta.touched}>
                        <FormLabel>Télephone</FormLabel>
                        <Input {...field} id={field.name} placeholder="Votre télephone" />
                      </FormControl>
                    )}
                  </Field>

                  <Field name="password">
                    {({ field, meta }) => {
                      return (
                        <FormControl isRequired isInvalid={meta.error && meta.touched} marginBottom="2w">
                          <FormLabel>Mot de passe</FormLabel>
                          <Input {...field} id={field.name} type="password" placeholder="Votre mot de passe..." />
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        </FormControl>
                      );
                    }}
                  </Field>
                </Box>
                <HStack spacing="4w">
                  <Button variant="primary" type="submit" size="lg">
                    S'inscrire
                  </Button>
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
      <Text mt={12} fontSize="1rem">
        Vous avez déjà un compte ?
        <Link to="/auth/connexion" as={NavLink} color="bluefrance" ml={3}>
          Connexion
        </Link>
      </Text>
    </Box>
  );
};

export default Login;
