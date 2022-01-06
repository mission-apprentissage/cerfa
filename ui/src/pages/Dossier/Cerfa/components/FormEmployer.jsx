import React from "react";
import { Box, FormLabel, Flex } from "@chakra-ui/react";

import { useCerfaEmployeur } from "../../../../common/hooks/useCerfa/parts/useCerfaEmployeur";
import InputCerfa from "./Input";

const FormEmployer = ({ onFetched }) => {
  const {
    get: {
      employeur: {
        siret,
        denomination,
        // raison_sociale,
        naf,
        nombreDeSalaries,
        codeIdcc,
        libelleIdcc,
        telephone,
        courriel,
        adresse: { numero, voie, complement, codePostal, commune },
        // nom,
        // prenom,
        typeEmployeur,
        employeurSpecifique,
        caisseComplementaire,
        regimeSpecifique,
        // attestationEligibilite,
        // attestationPieces,
      },
    },
    onSubmit: {
      employeur: { siret: onSubmittedEmployeurSiret },
    },
  } = useCerfaEmployeur();

  return (
    <Box>
      <InputCerfa
        path="employeur.siret"
        field={siret}
        type="text"
        mb="10"
        // hasComments
        onSubmittedField={onSubmittedEmployeurSiret}
      />
      {/* <FormControl>
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
      </FormControl> */}
      <Flex>
        <Box w="55%" flex="1">
          <InputCerfa path="employeur.denomination" field={denomination} type="text" mt="2" />
          <FormLabel fontWeight={700} my={3}>
            Adresse de l'établissement d'exécution du contrat :
          </FormLabel>
          <InputCerfa path="employeur.adresse.numero" field={numero} type="text" mt="2" />
          <InputCerfa path="employeur.adresse.voie" field={voie} type="text" mt="2" />
          <InputCerfa path="employeur.adresse.complement" field={complement} type="text" mt="2" />
          <InputCerfa path="employeur.adresse.codePostal" field={codePostal} type="text" mt="2" />
          <InputCerfa path="employeur.adresse.commune" field={commune} type="text" mt="2" />

          <InputCerfa path="employeur.telephone" field={telephone} type="text" mt="2" />
          <InputCerfa path="employeur.courriel" field={courriel} type="text" mt="2" />
        </Box>
        <Box w="45%" ml="5w">
          <InputCerfa path="employeur.typeEmployeur" field={typeEmployeur} type="text" mt="2" />
          <InputCerfa path="employeur.employeurSpecifique" field={employeurSpecifique} type="text" mt="2" />
          <InputCerfa path="employeur.naf" field={naf} type="text" mt="2" />
          <InputCerfa path="employeur.nombreDeSalaries" field={nombreDeSalaries} type="text" mt="2" />
          <InputCerfa path="employeur.codeIdcc" field={codeIdcc} type="text" mt="2" />
          <InputCerfa path="employeur.libelleIdcc" field={libelleIdcc} type="text" mt="2" />
          <InputCerfa path="employeur.caisseComplementaire" field={caisseComplementaire} type="text" mt="2" />
          <InputCerfa path="employeur.regimeSpecifique" field={regimeSpecifique} type="text" mt="2" />
          {/* <InputCerfa path="employeur.attestationEligibilite" field={attestationEligibilite} type="text" mt="2" /> */}
          {/* attestationPieces */}
        </Box>
      </Flex>
    </Box>
  );
};

export default FormEmployer;