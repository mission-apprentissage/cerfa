import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Text } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { _post } from "../../common/httpClient";
import { setTitle } from "../../common/utils/pageUtils";

const ForgottenPasswordPage = () => {
  const history = useHistory();

  const resetPassword = async (values, { setStatus }) => {
    try {
      // TODO email only (username login removed 21/03/22)
      await _post("/api/v1/password/forgotten-password", { ...values });
      setStatus({ message: "Un email vous a été envoyé." });
      setTimeout(() => history.push("/"), 1500);
    } catch (e) {
      console.error(e);
      setStatus({ error: e.prettyMessage });
    }
  };

  const title = "Mot de passe oublié";
  setTitle(title);

  return (
    <Flex height="100vh" justifyContent="center" mt="10">
      <Box width={["auto", "28rem"]}>
        <Heading fontFamily="Marianne" fontWeight="700" marginBottom="2w">
          {title}
        </Heading>
        <Formik
          initialValues={{
            username: "",
          }}
          validationSchema={Yup.object().shape({
            username: Yup.string().required("Veuillez saisir un email"),
          })}
          onSubmit={resetPassword}
        >
          {({ status = {} }) => {
            return (
              <Form>
                <Field name="username">
                  {({ field, meta }) => {
                    return (
                      <FormControl isRequired isInvalid={meta.error && meta.touched} marginBottom="2w">
                        <FormLabel>Identifiant</FormLabel>
                        <Input {...field} id={field.name} placeholder="Votre email" />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    );
                  }}
                </Field>
                <Button variant="primary" type={"submit"}>
                  Demander un nouveau mot de passe
                </Button>
                {status.error && (
                  <Text color="error" mt={2}>
                    {status.error}
                  </Text>
                )}
                {status.message && (
                  <Text color="info" mt={2}>
                    {status.message}
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

export default ForgottenPasswordPage;
