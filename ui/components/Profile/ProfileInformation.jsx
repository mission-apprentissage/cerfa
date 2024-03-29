import React from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Flex,
  HStack,
  RadioGroup,
  Radio,
  Divider,
} from "@chakra-ui/react";
import PhoneInput from "react-phone-input-2";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAuth from "../../hooks/useAuth";
import { _put } from "../../common/httpClient";
// import { hasPageAccessTo } from "../../common/utils/rolesUtils";
// import { betaVersion, BetaFeatures } from "../BetaFeatures/BetaFeatures";

const ProfileInformation = () => {
  let [auth] = useAuth();

  const { values, handleChange, handleSubmit, errors, touched, setFieldValue } = useFormik({
    initialValues: {
      prenom: auth.prenom || "",
      nom: auth.nom || "",
      username: auth.username || "",
      telephone: auth.telephone ? auth.telephone.replace("+", "") : "",
      email: auth.email || "",
      civility: auth.civility || "",
      beta: auth.beta || "",
    },
    validationSchema: Yup.object().shape({
      prenom: Yup.string(),
      name: Yup.string(),
      username: Yup.string(),
      phone: Yup.string(),
      civility: Yup.string(),
      email: Yup.string().email("Email invalide"),
    }),
    onSubmit: ({ nom, prenom, telephone, email, beta, civility }, { setSubmitting }) => {
      // eslint-disable-next-line no-undef
      return new Promise(async (resolve) => {
        try {
          await _put(`/api/v1/profile/user`, {
            nom: nom || null,
            prenom: prenom || null,
            telephone: telephone ? `+${telephone}` : null,
            civility: civility || null,
            email,
            beta: beta || null,
          });
          window.location.reload();
        } catch (e) {
          console.log(e);
        }

        setSubmitting(false);
        resolve("onSubmitHandler complete");
      });
    },
  });

  return (
    <Box w="100%" color="#1E1E1E">
      <Box>
        <Heading as="h1" fontSize="32px">
          Mes informations
        </Heading>
        <Box mt={8}>
          <RadioGroup value={values.civility}>
            <HStack>
              <Radio
                type="radio"
                name="civility"
                value={"Monsieur"}
                checked={values.civility !== "Madame"}
                onChange={handleChange}
              >
                Monsieur
              </Radio>
              <Radio
                type="radio"
                name="civility"
                value="Madame"
                checked={values.civility === "Madame"}
                onChange={handleChange}
              >
                Madame
              </Radio>
            </HStack>
          </RadioGroup>
        </Box>
        <Flex mt={2}>
          <FormControl isRequired mt={2} isInvalid={errors.prenom}>
            <FormLabel>Prénom</FormLabel>
            <Input type="text" name="prenom" value={values.prenom} onChange={handleChange} required />
            {errors.prenom && touched.prenom && <FormErrorMessage>{errors.prenom}</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.nom} ml={10}>
            <FormLabel>Nom</FormLabel>
            <Input type="text" name="nom" value={values.nom} onChange={handleChange} required />
            {errors.nom && touched.nom && <FormErrorMessage>{errors.nom}</FormErrorMessage>}
          </FormControl>
        </Flex>
        <FormControl isRequired isInvalid={errors.username} mt={5}>
          <FormLabel>Nom d&apos;Utilisateur</FormLabel>
          <Input type="text" name="username" value={values.username} onChange={handleChange} required isDisabled />
          {errors.username && touched.username && <FormErrorMessage>{errors.username}</FormErrorMessage>}
        </FormControl>
        <Flex mt={5}>
          <FormControl isInvalid={errors.telephone}>
            <FormLabel>Téléphone</FormLabel>
            <PhoneInput
              country={"fr"}
              value={values.telephone}
              masks={{
                fr: ". .. .. .. ..",
              }}
              countryCodeEditable={false}
              onChange={(value) => setFieldValue("telephone", value)}
              name="telephone"
            />
            {errors.telephone && touched.telephone && <FormErrorMessage>{errors.telephone}</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired isInvalid={errors.email} ml={10}>
            <FormLabel>E-mail</FormLabel>
            <Input type="email" name="email" value={values.email} onChange={handleChange} required isDisabled />
            {errors.email && touched.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
          </FormControl>
        </Flex>
        <Divider mt={10} mb={4} borderWidth="2px" />
        {/*hasPageAccessTo(auth, "signature_beta") && (
          <>
            <Box>
              <HStack>
                <FormLabel fontWeight="bold">Activer les fonctionnalité expérimentales de la plateforme ?</FormLabel>
                <RadioGroup value={values.beta}>
                  <HStack>
                    <Radio
                      type="radio"
                      name="beta"
                      value={betaVersion()}
                      checked={values.beta !== "non"}
                      onChange={handleChange}
                    >
                      Oui
                    </Radio>
                    <Radio type="radio" name="beta" value="non" checked={values.beta === "non"} onChange={handleChange}>
                      Non
                    </Radio>
                  </HStack>
                </RadioGroup>
              </HStack>
              <Box pl={4}>
                <Text>Cette activation vous donnera accès à :</Text>
                <BetaFeatures borderColor={"dgalt"} borderWidth={1} px={4} py={3} maxH="30vh" my={3} />
              </Box>
            </Box>
            <Divider mt={10} mb={4} borderWidth="2px" />
          </>
        )*/}
      </Box>
      <Box mt="2rem">
        <Button variant="primary" onClick={handleSubmit} type="submit">
          Enregistrer
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileInformation;
