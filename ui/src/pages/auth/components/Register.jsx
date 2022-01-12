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
import { CheckIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import generator from "generate-password-browser";
import * as Yup from "yup";

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

const Register = () => {
  const [step, setStep] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [entrepriseData, setEntrepriseData] = useState(null);
  const [succeeded, setSucceeded] = useState(false);

  const { values, handleChange, handleSubmit, errors, touched, setFieldValue } = useFormik({
    initialValues: {
      compte: "",
      email: "",
      siret: "",
      nom: "",
      prenom: "",
    },
    validationSchema: Yup.object().shape({
      compte: Yup.string().required("Requis"),
      email: Yup.string().email("Format d'email invalide").required("Votre email est obligatoire"),
      siret: Yup.string()
        .matches(new RegExp("^([0-9]{14}|[0-9]{9} [0-9]{4})$"), {
          message: `n'est pas un siret valide`,
          excludeEmptyString: true,
        })
        .required("Le siret est obligatoire"),
      nom: Yup.string().required("Votre nom est obligatoire"),
      prenom: Yup.string().required("Votre prénom est obligatoire"),
    }),
    onSubmit: (values) => {
      return new Promise(async (resolve) => {
        try {
          const newTmpPassword = generator.generate({
            length: 10,
            numbers: true,
            lowercase: true,
            uppercase: true,
            strict: true,
          });
          const result = await _post("/api/v1/auth/register", { ...values, password: newTmpPassword });
          if (result.succeeded) {
            setSucceeded(true);
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
                <FormLabel>Votre Siret</FormLabel>
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
                        {!entrepriseData.data.secretSiret && (
                          <>
                            <Box>{entrepriseData.data.enseigne || entrepriseData.data.entreprise_raison_sociale}</Box>
                            <Box>
                              {entrepriseData.data.numero_voie} {entrepriseData.data.nom_voie}
                            </Box>
                            {entrepriseData.data.complement_adresse && (
                              <Box>{entrepriseData.data.complement_adresse}</Box>
                            )}
                            <Box>
                              {entrepriseData.data.code_postal} {entrepriseData.data.localite}
                            </Box>
                          </>
                        )}
                        {entrepriseData.data.secretSiret && (
                          <>
                            <Box>Votre siret est valide.</Box>
                            <Box>
                              En revanche, en raison de sa nature, nous ne pourrons pas récupérer les informations
                              reliées. (telles que l'adresse et autres données)
                            </Box>
                          </>
                        )}
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
          {step === 2 && !succeeded && (
            <>
              <FormControl py={2} isRequired isInvalid={errors.email && touched.email}>
                <FormLabel>Votre Email</FormLabel>
                <Input
                  id="email"
                  name="email"
                  placeholder="Votre email..."
                  onChange={handleChange}
                  value={values.email}
                />
                {errors.email && touched.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
              </FormControl>
              <FormControl py={2} isRequired isInvalid={errors.nom && touched.nom}>
                <FormLabel>Nom</FormLabel>
                <Input id="nom" name="nom" onChange={handleChange} placeholder="Votre nom" value={values.nom} />
                {errors.nom && touched.nom && <FormErrorMessage>{errors.nom}</FormErrorMessage>}
              </FormControl>

              <FormControl py={2} isRequired isInvalid={errors.prenom && touched.prenom}>
                <FormLabel>Prénom</FormLabel>
                <Input
                  id="prenom"
                  name="prenom"
                  onChange={handleChange}
                  placeholder="Votre prénom"
                  value={values.prenom}
                />
                {errors.prenom && touched.prenom && <FormErrorMessage>{errors.prenom}</FormErrorMessage>}
              </FormControl>
            </>
          )}
          {step === 2 && succeeded && (
            <Center h="20vh">
              <CheckIcon color="green.500" mr={10} />
              <Text color="green.500" fontWeight="bold">
                Merci pour votre inscription! <br />
                Vous avez reçu un email d'activation.
              </Text>
            </Center>
          )}
        </Box>
        {step > 0 && (
          <HStack spacing="4w">
            {!succeeded && (
              <Link onClick={() => setStep(step - 1)} color="grey.600">
                {"< Précedent"}
              </Link>
            )}
            {step === 1 && (
              <Button
                size="md"
                variant="primary"
                onClick={() => setStep(2)}
                px={6}
                isDisabled={!entrepriseData || !entrepriseData?.successed}
              >
                Suivant
              </Button>
            )}
            {step === 2 && !succeeded && (
              <Button size="lg" type="submit" variant="primary" onClick={handleSubmit} px={6}>
                S'inscrire
              </Button>
            )}
          </HStack>
        )}
      </Box>
      <Flex flexGrow={1} alignItems="end">
        <Text mt={8} fontSize="1rem">
          Vous avez déjà un compte ?
          <Link to="/auth/connexion" as={NavLink} color="bluefrance" ml={3}>
            Connexion
          </Link>
        </Text>
      </Flex>
    </Flex>
  );
};

export default Register;
