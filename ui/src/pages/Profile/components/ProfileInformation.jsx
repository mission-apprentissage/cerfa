import React from "react";
import { Box, Heading, FormControl, FormLabel, Input, FormErrorMessage, Button, Flex } from "@chakra-ui/react";
import useAuth from "../../../common/hooks/useAuth";
import { useFormik } from "formik";
import * as Yup from "yup";

const ProfileInformation = () => {
  let [auth] = useAuth();

  const phoneRegExp =
    /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/;
  const { values, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      prenom: auth.prenom,
      nom: auth.nom,
      username: auth.username,
      telephone: auth.telephone,
      email: auth.email,
    },
    validationSchema: Yup.object().shape({
      prenom: Yup.string(),
      name: Yup.string(),
      username: Yup.string(),
      phone: Yup.string().matches(phoneRegExp, "Phone number is not valid"),
      email: Yup.string().email("Email invalide"),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <Box w="100%" color="#1E1E1E">
      <Box mr="15rem">
        <Heading as="h1" fontSize="32px">
          Mes informations
        </Heading>
        <Flex mt={5}>
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
          <FormLabel>Nom d'Utilisateur</FormLabel>
          <Input type="text" name="username" value={values.username} onChange={handleChange} required />
          {errors.username && touched.username && <FormErrorMessage>{errors.username}</FormErrorMessage>}
        </FormControl>
        <Flex mt={5}>
          <FormControl isInvalid={errors.telephone}>
            <FormLabel>Téléphone</FormLabel>
            <Input type="tel" name="telephone" value={values.telephone} onChange={handleChange} />
            {errors.telephone && touched.telephone && <FormErrorMessage>{errors.telephone}</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired isInvalid={errors.email} ml={10}>
            <FormLabel>E-mail</FormLabel>
            <Input type="email" name="email" value={values.email} onChange={handleChange} required isDisabled />
            {errors.email && touched.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
          </FormControl>
        </Flex>
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
