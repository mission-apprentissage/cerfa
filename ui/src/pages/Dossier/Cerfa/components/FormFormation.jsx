import React from "react";
import { Box, FormLabel, Flex } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";

import { useCerfaFormation } from "../../../../common/hooks/useCerfa/parts/useCerfaFormation";
import {
  cerfaContratDateDebutContratAtom,
  cerfaContratDateFinContratAtom,
} from "../../../../common/hooks/useCerfa/parts/useCerfaContratAtoms";
import InputCerfa from "./Input";

const FormFormation = React.memo((props) => {
  const contratDateDebutContrat = useRecoilValue(cerfaContratDateDebutContratAtom);
  const contratDateFinContrat = useRecoilValue(cerfaContratDateFinContratAtom);
  const {
    get: {
      organismeFormation: {
        siret,
        denomination,
        formationInterne,
        uaiCfa,
        adresse: { numero, voie, complement, codePostal, commune },
      },
      formation: {
        rncp,
        codeDiplome,
        dateDebutFormation,
        dateFinFormation,
        dureeFormation,
        intituleQualification,
        typeDiplome,
      },
    },
    onSubmit: {
      organismeFormation: {
        formationInterne: onSubmittedOrganismeFormationFormationInterne,
        siret: onSubmittedOrganismeFormationSiret,
        denomination: onSubmittedOrganismeFormationDenomination,
        uaiCfa: onSubmittedOrganismeFormationUaiCfa,
        adresse: {
          numero: onSubmittedOrganismeFormationAdresseNumero,
          voie: onSubmittedOrganismeFormationAdresseVoie,
          complement: onSubmittedOrganismeFormationAdresseComplement,
          codePostal: onSubmittedOrganismeFormationAdresseCodePostal,
          commune: onSubmittedOrganismeFormationAdresseCommune,
        },
      },
      formation: {
        rncp: onSubmittedRncp,
        codeDiplome: onSubmittedFormationCodeDiplome,
        dateDebutFormation: onSubmittedFormationDateDebutFormation,
        dateFinFormation: onSubmittedFormationDateFinFormation,
        dureeFormation: onSubmittedFormationDureeFormation,
        typeDiplome: onSubmittedFormationTypeDiplome,
        intituleQualification: onSubmittedFormationIntituleQualification,
      },
    },
  } = useCerfaFormation();

  return (
    <Box>
      <InputCerfa
        path="organismeFormation.formationInterne"
        field={formationInterne}
        type="radio"
        mt="2"
        mb={6}
        onSubmittedField={onSubmittedOrganismeFormationFormationInterne}
      />
      <InputCerfa
        path="organismeFormation.siret"
        field={siret}
        type="text"
        mb="10"
        // hasComments
        onSubmittedField={onSubmittedOrganismeFormationSiret}
      />

      <Flex>
        <Box w="55%" flex="1">
          <InputCerfa
            path="organismeFormation.denomination"
            field={denomination}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedOrganismeFormationDenomination}
          />
          <InputCerfa
            path="organismeFormation.uaiCfa"
            field={uaiCfa}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedOrganismeFormationUaiCfa}
          />
          <FormLabel fontWeight={700} my={3}>
            Adresse du CFA responsable :{" "}
          </FormLabel>
          <InputCerfa
            path="organismeFormation.adresse.numero"
            field={numero}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedOrganismeFormationAdresseNumero}
            hasInfo={false}
          />
          <InputCerfa
            path="organismeFormation.adresse.voie"
            field={voie}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedOrganismeFormationAdresseVoie}
            hasInfo={false}
          />
          <InputCerfa
            path="organismeFormation.adresse.complement"
            field={complement}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedOrganismeFormationAdresseComplement}
            hasInfo={false}
          />
          <InputCerfa
            path="organismeFormation.adresse.codePostal"
            field={codePostal}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedOrganismeFormationAdresseCodePostal}
            hasInfo={false}
          />
          <InputCerfa
            path="organismeFormation.adresse.commune"
            field={commune}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedOrganismeFormationAdresseCommune}
            hasInfo={false}
          />
        </Box>
        <Box w="45%" flex="1" ml="5w">
          <InputCerfa
            path="formation.typeDiplome"
            field={typeDiplome}
            type="select"
            mt="2"
            onSubmittedField={onSubmittedFormationTypeDiplome}
          />
          <InputCerfa
            path="formation.intituleQualification"
            field={intituleQualification}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedFormationIntituleQualification}
          />
          <InputCerfa
            path="formation.codeDiplome"
            field={codeDiplome}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedFormationCodeDiplome}
            // onAsyncData={{ value: rncp.value }}
          />
          <InputCerfa
            path="formation.rncp"
            field={rncp}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedRncp}
            // onAsyncData={{ value: codeDiplome.value }}
          />
          <FormLabel fontWeight={700} my={3}>
            Organisation de la formation en CFA :
          </FormLabel>
          <InputCerfa
            path="formation.dateDebutFormation"
            field={dateDebutFormation}
            type="date"
            mt="2"
            onSubmittedField={onSubmittedFormationDateDebutFormation}
            onAsyncData={{
              dateFinFormation: dateFinFormation?.value,
              contratDateDebutContrat: contratDateDebutContrat?.value,
            }}
          />
          <InputCerfa
            path="formation.dateFinFormation"
            field={dateFinFormation}
            type="date"
            mt="2"
            onSubmittedField={onSubmittedFormationDateFinFormation}
            onAsyncData={{
              dateDebutFormation: dateDebutFormation?.value,
              contratDateFinContrat: contratDateFinContrat?.value,
            }}
          />
          <Flex mt={4}>
            <InputCerfa
              path="formation.dureeFormation"
              field={dureeFormation}
              type="number"
              mt="2"
              onSubmittedField={onSubmittedFormationDureeFormation}
            />
          </Flex>
        </Box>
      </Flex>
      {/* <Box>
        <FormControl isRequired mt={2} isInvalid={errors.checkEmployer}>
          <Flex>
            <Checkbox type="checkbox" value="oui" name="checkEmployer" onChange={handleChange} required />
            <FormLabel ml={3} mt={2} fontWeight={700} textStyle="sm" fontStyle="italic">
              L’employeur atteste disposer de l’ensemble des pièces justificatives nécessaires au dépôt du contrat
            </FormLabel>
          </Flex>
          {errors.checkEmployer && touched.checkEmployer && <FormErrorMessage>{errors.checkEmployer}</FormErrorMessage>}
        </FormControl>
        <FormControl isRequired mt={2} isInvalid={errors.madeIn}>
          <FormLabel>Fait à :</FormLabel>
          <Input type="text" name="madeIn" onChange={handleChange} value={values.madeIn} required />
          {errors.madeIn && touched.madeIn && <FormErrorMessage>{errors.madeIn}</FormErrorMessage>}
        </FormControl>
      </Box>
*/}
    </Box>
  );
});

export default FormFormation;
