import {
  Flex,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  VStack,
  HStack,
  Input,
  Link,
  Text,
  RadioGroup,
  Radio,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import * as Yup from "yup";

import jwt from "jsonwebtoken";

import useToken from "../../../common/hooks/useToken";
import useAuth from "../../../common/hooks/useAuth";
import { _post } from "../../../common/httpClient";

const validate = async (validationSchema, obj) => {
  let isValid = false;
  let error = null;
  try {
    await validationSchema.validate(obj);
    isValid = true;
  } catch (err) {
    error = err;
  }
  return { isValid, error };
};

const Finalize = () => {
  const [auth, setAuth] = useAuth();
  const [, setToken] = useToken();
  const history = useHistory();
  const [step, setStep] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [entrepriseData, setEntrepriseData] = useState(null);

  const { values, handleChange, handleSubmit, errors, touched, setFieldValue } = useFormik({
    initialValues: {
      compte: "",
      siret: auth.siret || "",
    },
    validationSchema: Yup.object().shape({
      compte: Yup.string().required("Requis"),
      siret: Yup.string()
        .matches(new RegExp("^([0-9]{14}|[0-9]{9} [0-9]{4})$"), {
          message: `n'est pas un siret valide`,
          excludeEmptyString: true,
        })
        .required("Le siret est obligatoire"),
    }),
    onSubmit: (values) => {
      return new Promise(async (resolve) => {
        try {
          const result = await _post("/api/v1/pds/finalize", values);
          if (result.loggedIn) {
            const user = jwt.decode(result.token);
            setAuth(user);
            setToken(result.token);
            history.push("/mon-espace/mes-dossiers");
          }
        } catch (e) {
          console.error(e);
        }
        resolve("onSubmitHandler publish complete");
      });
    },
  });

  const siretLookUp = async (e) => {
    const siret = e.target.value;
    setEntrepriseData(null);
    const validationSchema = Yup.object().shape({
      siret: Yup.string()
        .matches(new RegExp("^([0-9]{14}|[0-9]{9} [0-9]{4})$"), {
          message: `n'est pas un siret valide`,
          excludeEmptyString: true,
        })
        .required("Le siret est obligatoire"),
    });

    const { isValid } = await validate(validationSchema, { siret });
    if (!isValid) {
      return setFieldValue("siret", siret);
    }

    setFieldValue("siret", siret);
    setIsFetching(true);
    const response = await _post(`/api/v1/siret/adresse`, {
      siret,
    });
    setIsFetching(false);
    let ret = {
      successed: true,
      data: response.result,
      message: null,
    };
    if (Object.keys(response.result).length === 0) {
      ret = {
        successed: false,
        data: null,
        message: response.messages.error,
      };
    }
    if (response.result.ferme) {
      ret = {
        successed: false,
        data: null,
        message: `Le Siret ${siret} est un établissement fermé.`,
      };
    }
    setEntrepriseData(ret);
  };

  return (
    <Flex w="full" flexDirection="column" h="full" mt={4}>
      <Box>
        <Box marginBottom="2w">
          {step === 0 && (
            <FormControl py={2} isRequired isInvalid={errors.compte && touched.compte}>
              <FormLabel>Je représente :</FormLabel>
              <RadioGroup id="compte" name="compte" value={values.compte} mt={8}>
                <VStack alignItems="baseline" fontSize="1.2rem" spacing={8}>
                  <Radio
                    value="entreprise"
                    onChange={(e) => {
                      setStep(1);
                      handleChange(e);
                      siretLookUp({ target: { value: values.siret } });
                    }}
                    size="lg"
                  >
                    une entreprise
                  </Radio>
                  <Radio
                    value="cfa"
                    onChange={(e) => {
                      setStep(1);
                      handleChange(e);
                      siretLookUp({ target: { value: values.siret } });
                    }}
                    size="lg"
                  >
                    un CFA
                  </Radio>
                </VStack>
              </RadioGroup>
              {errors.compte && touched.compte && <FormErrorMessage>{errors.compte}</FormErrorMessage>}
            </FormControl>
          )}

          {step === 1 && (
            <>
              <FormControl py={2} isRequired isInvalid={errors.siret && touched.siret}>
                <FormLabel>Vérification de votre Siret</FormLabel>
                <Input
                  id="siret"
                  name="siret"
                  placeholder="Votre siret..."
                  onChange={siretLookUp}
                  value={values.siret}
                  isDisabled={isFetching}
                />
                {errors.siret && touched.siret && <FormErrorMessage>{errors.siret}</FormErrorMessage>}
              </FormControl>
              <Center
                borderWidth="2px"
                borderStyle="dashed"
                borderColor={entrepriseData ? (entrepriseData.successed ? "green.500" : "error") : "grey.400"}
                rounded="md"
                minH="50"
                flexDirection="column"
                p={4}
              >
                {isFetching && <Spinner />}
                {!isFetching && entrepriseData && (
                  <>
                    {entrepriseData.data && (
                      <>
                        <Box>{entrepriseData.data.enseigne || entrepriseData.data.entreprise_raison_sociale}</Box>
                        <Box>
                          {entrepriseData.data.numero_voie} {entrepriseData.data.nom_voie}
                        </Box>
                        {entrepriseData.data.complement_adresse && <Box>{entrepriseData.data.complement_adresse}</Box>}
                        <Box>
                          {entrepriseData.data.code_postal} {entrepriseData.data.localite}
                        </Box>
                      </>
                    )}
                    {entrepriseData.message && (
                      <Box color="error" my={2}>
                        {entrepriseData.message}
                      </Box>
                    )}
                  </>
                )}
              </Center>
            </>
          )}
        </Box>
        {step > 0 && (
          <>
            <HStack spacing="4w">
              <Link onClick={() => setStep(step - 1)} color="grey.600">
                {"< Précedent"}
              </Link>
              {step === 1 && (
                <Button
                  size="md"
                  variant="primary"
                  onClick={handleSubmit}
                  px={6}
                  isDisabled={!entrepriseData || !entrepriseData?.successed}
                >
                  Finaliser votre inscription
                </Button>
              )}
            </HStack>
            <Flex flexGrow={1} alignItems="end">
              <Text mt={8} fontSize="1rem">
                Vous rencontrez des difficultés à passer cette étape ?
                <Link to="/support" as={NavLink} color="bluefrance" ml={3}>
                  Contacter le support
                </Link>
              </Text>
            </Flex>
          </>
        )}
      </Box>
    </Flex>
  );
};

export default Finalize;
