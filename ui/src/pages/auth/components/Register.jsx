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
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import * as Yup from "yup";
import jwt from "jsonwebtoken";

import useAuth from "../../../common/hooks/useAuth";
import useToken from "../../../common/hooks/useToken";
import { _post } from "../../../common/httpClient";

const Register = () => {
  const [, setAuth] = useAuth();
  const [, setToken] = useToken();
  const history = useHistory();

  const register = async (values, { setStatus }) => {
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

  const { values, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      compte: "",
      email: "",
      nom: "",
      prenom: "",
      // password: "",
    },
    validationSchema: Yup.object().shape({
      compte: Yup.string().required("Requis"),
      email: Yup.string().email("Format d'email invalide").required("Requis"),
      nom: Yup.string().required("Requis"),
      prenom: Yup.string().required("Requis"),
      // password: Yup.string().required("Requis"),
    }),
    onSubmit: (values, rest) => {
      return new Promise(async (resolve) => {
        await register(values, rest);
        resolve("onSubmitHandler publish complete");
      });
    },
  });

  return (
    <Flex w="full" flexDirection="column" h="full">
      <Box>
        <Box marginBottom="2w">
          <FormControl py={2} isRequired isInvalid={errors.compte && touched.compte}>
            <FormLabel>Je représente</FormLabel>
            <RadioGroup id="compte" name="compte" value={values.compte}>
              <HStack spacing={5}>
                <Radio value="entreprise" onChange={handleChange}>
                  une entreprise
                </Radio>
                <Radio value="cfa" onChange={handleChange}>
                  un CFA
                </Radio>
              </HStack>
            </RadioGroup>
            {errors.compte && touched.compte && <FormErrorMessage>{errors.compte}</FormErrorMessage>}
          </FormControl>

          <FormControl py={2} isRequired isInvalid={errors.email && touched.email}>
            <FormLabel>Email</FormLabel>
            <Input id="email" name="email" placeholder="Votre email..." onChange={handleChange} value={values.email} />
            {errors.email && touched.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
          </FormControl>

          <FormControl py={2} isRequired isInvalid={errors.nom && touched.nom}>
            <FormLabel>Nom</FormLabel>
            <Input id="nom" name="nom" onChange={handleChange} placeholder="Votre nom" value={values.nom} />
            {errors.nom && touched.nom && <FormErrorMessage>{errors.nom}</FormErrorMessage>}
          </FormControl>

          <FormControl py={2} isRequired isInvalid={errors.prenom && touched.prenom}>
            <FormLabel>Prénom</FormLabel>
            <Input id="prenom" name="prenom" onChange={handleChange} placeholder="Votre prénom" value={values.prenom} />
            {errors.prenom && touched.prenom && <FormErrorMessage>{errors.prenom}</FormErrorMessage>}
          </FormControl>

          {/* <Field name="password">
                    {({ field, meta }) => {
                      return (
                        <FormControl isRequired isInvalid={meta.error && meta.touched} marginBottom="2w">
                          <FormLabel>Mot de passe</FormLabel>
                          <Input {...field} id={field.name} type="password" placeholder="Votre mot de passe..." />
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        </FormControl>
                      );
                    }}
                  </Field> */}
        </Box>
        <HStack spacing="4w">
          <Button size="lg" type="submit" variant="primary" onClick={handleSubmit} px={6}>
            S'inscrire
          </Button>
        </HStack>
      </Box>
      <Text mt={12} fontSize="1rem">
        Vous avez déjà un compte ?
        <Link to="/auth/connexion" as={NavLink} color="bluefrance" ml={3}>
          Connexion
        </Link>
      </Text>
    </Flex>
  );
};

export default Register;
