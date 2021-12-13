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
} from "@chakra-ui/react";
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
    <Flex w="full" flexDirection="column" h="full">
      <Box>
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={Yup.object().shape({
            username: Yup.string().required("Requis"),
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
                        <Input {...field} id={field.name} placeholder="Votre email ou identifiant..." />
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
                  <Link to="/forgotten-password" as={NavLink} color="grey.600">
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
          Vous n'avez pas encore de compte ?
          <Link to="/auth/inscription" as={NavLink} color="bluefrance" ml={3}>
            Créer un compte
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default Login;
