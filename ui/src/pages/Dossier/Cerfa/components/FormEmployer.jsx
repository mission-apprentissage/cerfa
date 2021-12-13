import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, FormErrorMessage, Text, Flex, HStack } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { _post } from "../../../../common/httpClient";
const endpointTCO =
  process.env.REACT_APP_ENDPOINT_TCO || "https://tables-correspondances.apprentissage.beta.gouv.fr/api/v1";

const FormEmployer = ({ onFetched }) => {
  const [isFetching, setIsFetching] = useState(false);

  const phoneRegExp =
    /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/;
  const { values, handleChange, handleSubmit, errors, touched, setFieldValue } = useFormik({
    initialValues: {
      priveOrPublic: "",
      name: "",
      number: "",
      way: "",
      complement: "",
      zipCode: "",
      townShip: "",
      phone: "",
      email: "",
      siret: "",
      typeEmployer: "",
      specificEmployer: "",
      companyCode: "",
      numberOfEmployees: "",
      collectiveAgreement: "",
      codeIDCC: "",
      publicSector: "",
    },
    validationSchema: Yup.object().shape({
      priveOrPublic: Yup.string().required("Requis"),
      name: Yup.string().required("Requis"),
      number: Yup.string().required("Requis"),
      way: Yup.string().required("Requis"),
      complement: Yup.string().required("Requis"),
      zipCode: Yup.string().required("Requis"),
      townShip: Yup.string().required("Requis"),
      phone: Yup.string().matches(phoneRegExp, "Phone number is not valid").required("Requis"),
      email: Yup.string().email("Email invalide").required("Required"),
      siret: Yup.string()
        .matches(/[0-9]{14}/, "Le siret est code sur 14 caractères numérique")
        .required("Veuillez saisir un siret"),
      typeEmployer: Yup.string().required("Requis"),
      specificEmployer: Yup.string().required("Requis"),
      companyCode: Yup.string().required("Requis"),
      numberOfEmployees: Yup.string().required("Requis"),
      collectiveAgreement: Yup.string().required("Requis"),
      codeIDCC: Yup.string().required("Requis"),
      publicSector: Yup.string().required("Requis"),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
      console.log(values);
    },
  });

  const handleSearch = async () => {
    setIsFetching(true);
    try {
      const { result } = await _post(`${endpointTCO}/siret`, { siret: values.siret });
      console.log(result);
      setFieldValue("number", result.numero_voie);
      setFieldValue("way", result.nom_voie);
      setFieldValue("complement", result.complement_adresse ?? "N/A");
      setFieldValue("zipCode", result.code_postal);
      setFieldValue("townShip", result.commune_implantation_nom);
      setFieldValue("companyCode", result.naf_code);
      setFieldValue("numberOfEmployees", result.entreprise_tranche_effectif_salarie.a);
    } catch (error) {
      console.log(error);
    }
    setIsFetching(false);
  };

  return (
    <Box>
      <FormControl>
        <HStack w="40%">
          <Flex alignItems="center">
            <input
              type="radio"
              name="priveOrPublic"
              value="prive"
              checked={values.priveOrPublic === "prive"}
              onChange={handleChange}
            />
            <Text ml="1w">employeur privé</Text>
          </Flex>
          <Flex alignItems="center">
            <input
              type="radio"
              name="priveOrPublic"
              value="public"
              checked={values.priveOrPublic === "public"}
              onChange={handleChange}
            />
            <Text ml="1w">employeur « public »</Text>
          </Flex>
        </HStack>
        {errors.priveOrPublic && touched.priveOrPublic && <FormErrorMessage>{errors.priveOrPublic}</FormErrorMessage>}
      </FormControl>
      <Flex>
        <Box w="55%" flex="1">
          <FormControl isRequired mt={2} isInvalid={errors.name}>
            <FormLabel>Nom et prénom ou dénomination :</FormLabel>
            <Input type="text" name="name" onChange={handleChange} value={values.name} required />
            {errors.name && touched.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
          </FormControl>
          <FormLabel my={3} fontWeight={700}>
            Adresse de l’établissement d’exécution du contrat :
          </FormLabel>
          <FormControl isRequired isInvalid={errors.number} mt={2}>
            <FormLabel>N° :</FormLabel>
            <Input type="text" name="number" onChange={handleChange} value={values.number} required />
            {errors.number && touched.number && <FormErrorMessage>{errors.number}</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired isInvalid={errors.way} mt={2}>
            <FormLabel>Voie :</FormLabel>
            <Input type="text" name="way" onChange={handleChange} value={values.way} required />
            {errors.way && touched.way && <FormErrorMessage>{errors.way}</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired isInvalid={errors.complement} mt={2}>
            <FormLabel>Complément :</FormLabel>
            <Input type="text" name="complement" onChange={handleChange} value={values.complement} required />
            {errors.complement && touched.complement && <FormErrorMessage>{errors.complement}</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.zipCode}>
            <FormLabel>Code postal :</FormLabel>
            <Input type="text" name="zipCode" onChange={handleChange} value={values.zipCode} required />
            {errors.zipCode && touched.zipCode && <FormErrorMessage>{errors.zipCode}</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.townShip}>
            <FormLabel>Commune :</FormLabel>
            <Input type="text" name="townShip" onChange={handleChange} value={values.townShip} required />
            {errors.townShip && touched.townShip && <FormErrorMessage>{errors.townShip}</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.phone}>
            <FormLabel>Téléphone :</FormLabel>
            <Input type="tel" name="phone" onChange={handleChange} value={values.phone} required />
            {errors.phone && touched.phone && <FormErrorMessage>{errors.phone}</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.email}>
            <FormLabel>Courriel :</FormLabel>
            <Input type="email" name="email" onChange={handleChange} value={values.email} required />
            {errors.email && touched.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
          </FormControl>
        </Box>
        <Box w="45%" ml="5w">
          <FormControl isRequired mt={2} isInvalid={errors.siret}>
            <FormLabel>N°SIRET de l’établissement d’exécution du contrat :</FormLabel>
            <Input
              type="text"
              name="siret"
              onChange={handleChange}
              value={values.siret}
              autoComplete="off"
              maxLength="14"
              pattern="[0-9]{14}"
              required
            />
            {errors.siret && touched.siret && <FormErrorMessage>{errors.siret}</FormErrorMessage>}
            <Button
              variant="primary"
              ml={3}
              my={4}
              onClick={handleSearch}
              loadingText="Rechercher"
              isLoading={isFetching}
            >
              Rechercher
            </Button>
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.typeEmployer}>
            <FormLabel>Type d’employeur :</FormLabel>
            <Input type="text" name="typeEmployer" onChange={handleChange} value={values.typeEmployer} required />
            {errors.typeEmployer && touched.typeEmployer && <FormErrorMessage>{errors.typeEmployer}</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.specificEmployer}>
            <FormLabel>Employeur spécifique :</FormLabel>
            <Input
              type="text"
              name="specificEmployer"
              onChange={handleChange}
              value={values.specificEmployer}
              required
            />
            {errors.specificEmployer && touched.specificEmployer && (
              <FormErrorMessage>{errors.specificEmployer}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isRequired isInvalid={errors.companyCode} mt={2}>
            <FormLabel>Code activité de l’entreprise (NAF) :</FormLabel>
            <Input type="text" name="companyCode" onChange={handleChange} value={values.companyCode} />
            {errors.companyCode && touched.companyCode && <FormErrorMessage>{errors.companyCode}</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired isInvalid={errors.numberOfEmployees} mt={2}>
            <FormLabel>Effectif total salariés de l’entreprise :</FormLabel>
            <Input
              type="text"
              name="numberOfEmployees"
              onChange={handleChange}
              value={values.numberOfEmployees}
              required
            />
            {errors.numberOfEmployees && touched.numberOfEmployees && (
              <FormErrorMessage>{errors.numberOfEmployees}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.collectiveAgreement}>
            <FormLabel>Convention collective applicable :</FormLabel>
            <Input
              type="text"
              name="collectiveAgreement"
              onChange={handleChange}
              value={values.collectiveAgreement}
              required
            />
            {errors.collectiveAgreement && touched.collectiveAgreement && (
              <FormErrorMessage>{errors.collectiveAgreement}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.codeIDCC}>
            <FormLabel>Code IDCC de la convention :</FormLabel>
            <Input type="text" name="codeIDCC" onChange={handleChange} value={values.codeIDCC} required />
            {errors.codeIDCC && touched.codeIDCC && <FormErrorMessage>{errors.codeIDCC}</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.publicSector}>
            <FormLabel>
              *Pour les employeurs du secteur public, adhésion de l’apprenti au régime spécifique d’assurance chômage :
            </FormLabel>
            <Input type="text" name="publicSector" onChange={handleChange} value={values.publicSector} required />
            {errors.publicSector && touched.publicSector && <FormErrorMessage>{errors.publicSector}</FormErrorMessage>}
          </FormControl>
        </Box>
      </Flex>
      <Box mt="2rem">
        <Button variant="primary" ml={3} onClick={handleSubmit} type="submit" isLoading={isFetching}>
          Enregistrer
        </Button>
      </Box>
    </Box>
  );
};

export default FormEmployer;
