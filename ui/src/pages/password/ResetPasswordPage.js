import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Text } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import queryString from "query-string";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import * as Yup from "yup";

import useAuth from "../../common/hooks/useAuth";
import { _post } from "../../common/httpClient";
import decodeJWT from "../../common/utils/decodeJWT";
import { setTitle } from "../../common/utils/pageUtils";

const ResetPasswordPage = () => {
  const [, setAuth] = useAuth();
  const history = useHistory();
  const location = useLocation();
  const { passwordToken } = queryString.parse(location.search);
  const username = decodeJWT(passwordToken).sub;

  const changePassword = async (values, { setStatus }) => {
    try {
      const user = await _post("/api/password/reset-password", { ...values, passwordToken });
      setAuth(user);
      history.push("/");
    } catch (e) {
      console.error(e);
      setStatus({
        error: (
          <span>
            Le lien est expiré ou invalide, merci de prendre contact avec un administrateur en précisant votre adresse
            mail :
            <br />
            <a href="mailto:catalogue@apprentissage.beta.gouv.fr">catalogue@apprentissage.beta.gouv.fr</a>
          </span>
        ),
      });
    }
  };

  const title = `Changement du mot de passe pour l'utilisateur ${username}`;
  setTitle(title);

  return (
    <Flex height="100vh" justifyContent="center" mt="10">
      <Box width={["auto", "28rem"]}>
        <Heading fontFamily="Marianne" fontWeight="700" marginBottom="2w">
          {title}
        </Heading>
        <Formik
          initialValues={{
            newPassword: "",
          }}
          validationSchema={Yup.object().shape({
            newPassword: Yup.string()
              .required("Veuillez saisir un mot de passe")
              .matches(
                "^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\d\\s:])([^\\s]){8,}$",
                "Le mot de passe doit contenir au moins 8 caractères, une lettre en minuscule, une lettre en majuscule, un chiffre et un caractère spécial (les espaces ne sont pas acceptés)"
              ),
          })}
          onSubmit={changePassword}
        >
          {({ status = {} }) => {
            return (
              <Form>
                <Field name="newPassword">
                  {({ field, meta }) => {
                    return (
                      <FormControl isRequired isInvalid={meta.error && meta.touched} marginBottom="2w">
                        <FormLabel>Nouveau mot de passe</FormLabel>
                        <Input {...field} id={field.name} type="password" placeholder="Votre nouveau mot de passe..." />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    );
                  }}
                </Field>
                <Button variant="primary" type="submit">
                  Réinitialiser le mot de passe
                </Button>
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
    </Flex>
  );
};

export default ResetPasswordPage;
