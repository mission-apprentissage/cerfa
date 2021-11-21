import React from "react";
import {
  Box,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Text,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";

// import { _post, _get, _put } from "../../common/httpClient";

const FormLearner = () => {
  const phoneRegExp = /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/;
  const { values, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      name: "",
      firstname: "",
      nir: "",
      number: "",
      complement: "",
      zipCode: "",
      townShip: "",
      phone: "",
      email: "",
      nameLegal: "",
      numberLegal: "",
      wayLegal: "",
      complementLegal: "",
      zipCodeLegal: "",
      townShipLegal: "",
      birth: "",
      gender: "",
      departmentOfBirth: "",
      townShipOfBirth: "",
      nationality: "",
      socialRegime: "",
      sportList: "",
      handicapped: "",
      situationContract: "",
      diplomOrTitle: "",
      lastClass: "",
      lastDiplomOrTitle: "",
      highDiplom: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Requis"),
      firstname: Yup.string().required("Requis"),
      nir: Yup.string().required("Requis"),
      number: Yup.string().required("Requis"),
      complement: Yup.string().required("Requis"),
      zipCode: Yup.string().required("Requis"),
      townShip: Yup.string().required("Requis"),
      nameLegal: Yup.string(),
      numberLegal: Yup.string(),
      wayLegal: Yup.string(),
      complementLegal: Yup.string(),
      zipCodeLegal: Yup.string(),
      townShipLegal: Yup.string(),
      birth: Yup.string().required("Requis"),
      gender: Yup.string().required("Requis"),
      departmentOfBirth: Yup.string().required("Requis"),
      townShipOfBirth: Yup.string().required("Requis"),
      nationality: Yup.string().required("Requis"),
      socialRegime: Yup.string().required("Requis"),
      sportList: Yup.string().required("Requis"),
      handicapped: Yup.string().required("Requis"),
      situationContract: Yup.string().required("Requis"),
      diplomOrTitle: Yup.string().required("Requis"),
      lastClass: Yup.string().required("Requis"),
      lastDiplomOrTitle: Yup.string().required("Requis"),
      highDiplom: Yup.string().required("Requis"),
      phone: Yup.string().matches(phoneRegExp, "Phone number is not valid").required("Requis"),
      email: Yup.string().email("Email invalide").required("Required"),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <Box>
      <Box w="100%" pt={[4, 8]} px={[1, 24]} color="grey.800"></Box>
      <Box mx="5rem">
        <Heading textStyle="h2" marginBottom="2w">
          FORMULAIRE APPRENTI(E)
        </Heading>
        <Box>
          <Flex>
            <Box w="55%" flex="1">
              <FormControl isRequired mt={2} isInvalid={errors.name}>
                <FormLabel>Nom de naissance de l’apprenti(e) :</FormLabel>
                <Input type="text" name="name" onChange={handleChange} value={values.name} required />
                {errors.name && touched.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
              </FormControl>
              <FormControl isRequired mt={2} isInvalid={errors.firstname}>
                <FormLabel>Prénom de l’apprenti(e) :</FormLabel>
                <Input type="text" name="firstname" onChange={handleChange} value={values.firstname} required />
                {errors.firstname && touched.firstname && <FormErrorMessage>{errors.firstname}</FormErrorMessage>}
              </FormControl>
              <FormControl isRequired mt={2} isInvalid={errors.nir}>
                <FormLabel>NIR de l’apprenti(e)* :</FormLabel>
                <Input type="text" name="nir" onChange={handleChange} value={values.nir} required />
                {errors.nir && touched.nir && <FormErrorMessage>{errors.nir}</FormErrorMessage>}
              </FormControl>
              <FormLabel fontWeight="bold" my={3}>
                Adresse de l’apprenti(e) :
              </FormLabel>
              <FormControl isRequired mt={2} isInvalid={errors.number}>
                <FormLabel>N° :</FormLabel>
                <Input type="text" name="number" onChange={handleChange} value={values.number} required />
                {errors.number && touched.number && <FormErrorMessage>{errors.number}</FormErrorMessage>}
              </FormControl>
              <FormControl isRequired mt={2} isInvalid={errors.way}>
                <FormLabel>Voie :</FormLabel>
                <Input type="text" name="way" onChange={handleChange} value={values.way} required />
                {errors.way && touched.way && <FormErrorMessage>{errors.way}</FormErrorMessage>}
              </FormControl>
              <FormControl isRequired mt={2} isInvalid={errors.complement}>
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
                <Input type="text" name="email" onChange={handleChange} value={values.email} required />
                {errors.email && touched.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
              </FormControl>
              <Text fontWeight="bold" my={3}>
                Représentant légal <Text as="span">(à renseigner si l’apprenti est mineur non émancipé)</Text>
              </Text>
              <FormControl mt={2} isInvalid={errors.nameLegal}>
                <FormLabel>Nom de naissance et prénom :</FormLabel>
                <Input type="text" name="nameLegal" onChange={handleChange} value={values.nameLegal} />
                {errors.nameLegal && touched.nameLegal && <FormErrorMessage>{errors.nameLegal}</FormErrorMessage>}
              </FormControl>
              <Text fontWeight="bold" my={3}>
                Adresse du représentant légal :
              </Text>
              <FormControl mt={2} isInvalid={errors.numberLegal}>
                <FormLabel>N° :</FormLabel>
                <Input type="text" name="numberLegal" onChange={handleChange} value={values.numberLegal} />
                {errors.numberLegal && touched.numberLegal && <FormErrorMessage>{errors.numberLegal}</FormErrorMessage>}
              </FormControl>
              <FormControl mt={2} isInvalid={errors.wayLegal}>
                <FormLabel>Voie :</FormLabel>
                <Input type="text" name="wayLegal" onChange={handleChange} value={values.wayLegal} />
                {errors.wayLegal && touched.wayLegal && <FormErrorMessage>{errors.wayLegal}</FormErrorMessage>}
              </FormControl>
              <FormControl mt={2} isInvalid={errors.complementLegal}>
                <FormLabel>Complément :</FormLabel>
                <Input type="text" name="complementLegal" onChange={handleChange} value={values.complementLegal} />
                {errors.complementLegal && touched.complementLegal && (
                  <FormErrorMessage>{errors.complementLegal}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl mt={2} isInvalid={errors.zipCodeLegal}>
                <FormLabel>Code postal :</FormLabel>
                <Input type="text" name="zipCodeLegal" onChange={handleChange} value={values.zipCodeLegal} />
                {errors.zipCodeLegal && touched.zipCodeLegal && (
                  <FormErrorMessage>{errors.zipCodeLegal}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl mt={2} isInvalid={errors.townShipLegal}>
                <FormLabel>Commune :</FormLabel>
                <Input type="text" name="townShipLegal" onChange={handleChange} value={values.townShipLegal} />
                {errors.townShipLegal && touched.townShipLegal && (
                  <FormErrorMessage>{errors.townShipLegal}</FormErrorMessage>
                )}
              </FormControl>
            </Box>
            <Box w="45%" ml="5w">
              <FormControl isRequired mt={2} isInvalid={errors.birth}>
                <FormLabel>Date de naissance :</FormLabel>
                <Input type="date" name="birth" onChange={handleChange} value={values.birth} required />
                {errors.birth && touched.birth && <FormErrorMessage>{errors.birth}</FormErrorMessage>}
              </FormControl>
              <FormControl isRequired mt={2} isInvalid={errors.gender}>
                <FormLabel>Sexe :</FormLabel>
                <HStack w="40%">
                  <Flex alignItems="center">
                    <input
                      type="radio"
                      name="gender"
                      value="M"
                      checked={values.gender === "M"}
                      onChange={handleChange}
                    />
                    <FormLabel ml="1w">M</FormLabel>
                  </Flex>
                  <Flex alignItems="center">
                    <input
                      type="radio"
                      name="gender"
                      value="F"
                      checked={values.gender === "F"}
                      onChange={handleChange}
                    />
                    <FormLabel ml="1w">F</FormLabel>
                  </Flex>
                </HStack>
                {errors.gender && touched.gender && <FormErrorMessage>{errors.gender}</FormErrorMessage>}
              </FormControl>
              <FormControl isRequired mt={2} isInvalid={errors.departmentOfBirth}>
                <FormLabel>Département de naissance :</FormLabel>
                <Input
                  type="text"
                  name="departmentOfBirth"
                  onChange={handleChange}
                  value={values.departmentOfBirth}
                  required
                />
                {errors.departmentOfBirth && touched.departmentOfBirth && (
                  <FormErrorMessage>{errors.departmentOfBirth}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired mt={2} isInvalid={errors.townShipOfBirth}>
                <FormLabel>Commune de naissance :</FormLabel>
                <Input
                  type="text"
                  name="townShipOfBirth"
                  onChange={handleChange}
                  value={values.townShipOfBirth}
                  required
                />
                {errors.townShipOfBirth && touched.townShipOfBirth && (
                  <FormErrorMessage>{errors.townShipOfBirth}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired mt={2} isInvalid={errors.nationality}>
                <FormLabel>Régime social :</FormLabel>
                <Input type="text" name="nationality" onChange={handleChange} value={values.nationality} required />
                {errors.nationality && touched.nationality && <FormErrorMessage>{errors.nationality}</FormErrorMessage>}
              </FormControl>
              <FormControl isRequired mt={2} isInvalid={errors.socialRegime}>
                <FormLabel>Régime social :</FormLabel>
                <Input type="text" name="socialRegime" onChange={handleChange} value={values.socialRegime} required />
                {errors.socialRegime && touched.socialRegime && (
                  <FormErrorMessage>{errors.socialRegime}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired mt={2} isInvalid={errors.sportList}>
                <FormLabel>
                  Déclare être inscrit sur la liste des sportifs, entraîneurs, arbitres et juges sportifs de haut niveau
                  :
                </FormLabel>
                <HStack w="40%">
                  <Flex alignItems="center">
                    <input
                      type="radio"
                      name="sportList"
                      value="oui"
                      checked={values.sportList === "oui"}
                      onChange={handleChange}
                    />
                    <FormLabel ml="1w">oui</FormLabel>
                  </Flex>
                  <Flex alignItems="center">
                    <input
                      type="radio"
                      name="sportList"
                      value="non"
                      checked={values.sportList === "non"}
                      onChange={handleChange}
                    />
                    <FormLabel ml="1w">non</FormLabel>
                  </Flex>
                </HStack>
                {errors.sportList && touched.sportList && <FormErrorMessage>{errors.sportList}</FormErrorMessage>}
              </FormControl>
              <FormControl isRequired mt={2} isInvalid={errors.handicapped}>
                <FormLabel>Déclare bénéficier de la reconnaissance travailleur handicapé :</FormLabel>
                <HStack w="40%">
                  <Flex alignItems="center">
                    <input
                      type="radio"
                      name="handicapped"
                      value="oui"
                      checked={values.handicapped === "oui"}
                      onChange={handleChange}
                    />
                    <FormLabel ml="1w">oui</FormLabel>
                  </Flex>
                  <Flex alignItems="center">
                    <input
                      type="radio"
                      name="handicapped"
                      value="non"
                      checked={values.handicapped === "non"}
                      onChange={handleChange}
                    />
                    <FormLabel ml="1w">non</FormLabel>
                  </Flex>
                </HStack>
                {errors.handicapped && touched.handicapped && <FormErrorMessage>{errors.handicapped}</FormErrorMessage>}
              </FormControl>
              <FormControl isRequired mt={2} isInvalid={errors.situationContract}>
                <FormLabel>Situation avant ce contrat :</FormLabel>
                <Input
                  type="text"
                  name="situationContract"
                  onChange={handleChange}
                  value={values.situationContract}
                  required
                />
                {errors.situationContract && touched.situationContract && (
                  <FormErrorMessage>{errors.situationContract}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired mt={2} isInvalid={errors.diplomOrTitle}>
                <FormLabel>Dernier diplôme ou titre préparé :</FormLabel>
                <Input type="text" name="diplomOrTitle" onChange={handleChange} value={values.diplomOrTitle} required />
                {errors.diplomOrTitle && touched.diplomOrTitle && (
                  <FormErrorMessage>{errors.diplomOrTitle}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired mt={2} isInvalid={errors.lastClass}>
                <FormLabel>Dernière classe / année suivie :</FormLabel>
                <Input type="text" name="lastClass" onChange={handleChange} value={values.lastClass} required />
                {errors.lastClass && touched.lastClass && <FormErrorMessage>{errors.lastClass}</FormErrorMessage>}
              </FormControl>
              <FormControl isRequired mt={2} isInvalid={errors.lastDiplomOrTitle}>
                <FormLabel>Intitulé précis du dernier diplôme ou titre préparé :</FormLabel>
                <Input
                  type="text"
                  name="lastDiplomOrTitle"
                  onChange={handleChange}
                  value={values.lastDiplomOrTitle}
                  required
                />
                {errors.lastDiplomOrTitle && touched.lastDiplomOrTitle && (
                  <FormErrorMessage>{errors.lastDiplomOrTitle}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired mt={2} isInvalid={errors.highDiplom}>
                <FormLabel>Diplôme ou titre le plus élevé obtenu :</FormLabel>
                <Input type="text" name="highDiplom" onChange={handleChange} value={values.highDiplom} required />
                {errors.highDiplom && touched.highDiplom && <FormErrorMessage>{errors.highDiplom}</FormErrorMessage>}
              </FormControl>
            </Box>
          </Flex>
          <Box mt="2rem">
            <Button variant="primary" ml={3} onClick={handleSubmit} type="submit">
              Enregistrer
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FormLearner;
