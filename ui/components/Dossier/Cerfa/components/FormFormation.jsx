import React from "react";
import { Box, FormLabel, Flex, Center, Spinner, Text, Collapse } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";

import { useCerfaFormation } from "../../../../hooks/useCerfa/parts/useCerfaFormation";
import {
  cerfaContratDateDebutContratAtom,
  cerfaContratDateFinContratAtom,
} from "../../../../hooks/useCerfa/parts/useCerfaContratAtoms";
import InputCerfa from "./Input";

// eslint-disable-next-line react/display-name
const FormFormation = React.memo(() => {
  const contratDateDebutContrat = useRecoilValue(cerfaContratDateDebutContratAtom);
  const contratDateFinContrat = useRecoilValue(cerfaContratDateFinContratAtom);
  const {
    isLoading,
    get: {
      organismeFormation: {
        siret,
        denomination,
        formationInterne,
        uaiCfa,
        adresse: { numero, voie, complement, codePostal, commune },
      },
      etablissementFormation: {
        memeResponsable,
        siret: etablissementFormationSiret,
        denomination: etablissementFormationDenomination,
        uaiCfa: etablissementFormationUaiCfa,
        adresse: {
          numero: etablissementFormationAdresseNumero,
          voie: etablissementFormationAdresseVoie,
          complement: etablissementFormationAdresseComplement,
          codePostal: etablissementFormationAdresseCodePostal,
          commune: etablissementFormationAdresseCommune,
        },
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
      etablissementFormation: {
        memeResponsable: onSubmittedEtablissementFormationMemeResponsable,
        siret: onSubmittedEtablissementFormationSiret,
        denomination: onSubmittedEtablissementFormationDenomination,
        uaiCfa: onSubmittedEtablissementFormationUaiCfa,
        adresse: {
          numero: onSubmittedEtablissementFormationAdresseNumero,
          voie: onSubmittedEtablissementFormationAdresseVoie,
          complement: onSubmittedEtablissementFormationAdresseComplement,
          codePostal: onSubmittedEtablissementFormationAdresseCodePostal,
          commune: onSubmittedEtablissementFormationAdresseCommune,
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

  if (isLoading || !contratDateDebutContrat || !contratDateFinContrat)
    return (
      <Center>
        <Spinner />
      </Center>
    );

  return (
    <>
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
              hasInfo={false}
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
              type="number"
              precision={0}
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
              path="formation.rncp"
              field={rncp}
              type="text"
              mt="2"
              onSubmittedField={onSubmittedRncp}
              // onAsyncData={{ value: codeDiplome.value }}
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
                precision={0}
                min={1}
                onSubmittedField={onSubmittedFormationDureeFormation}
              />
            </Flex>
          </Box>
        </Flex>
      </Box>
      <Box>
        <Text fontWeight="bold" my={3}>
          Le lieu de formation :
        </Text>
        <InputCerfa
          path="etablissementFormation.memeResponsable"
          field={memeResponsable}
          type="radio"
          mt="2"
          onSubmittedField={onSubmittedEtablissementFormationMemeResponsable}
        />
        <Collapse in={memeResponsable.value === "Non"} animateOpacity>
          <InputCerfa
            path="etablissementFormation.siret"
            field={etablissementFormationSiret}
            type="text"
            mb="2"
            // hasComments
            onSubmittedField={onSubmittedEtablissementFormationSiret}
          />
          <Flex>
            <Box w="55%" flex="1">
              <InputCerfa
                path="etablissementFormation.denomination"
                field={etablissementFormationDenomination}
                type="text"
                mt="2"
                onSubmittedField={onSubmittedEtablissementFormationDenomination}
                hasInfo={false}
              />
              <InputCerfa
                path="etablissementFormation.uaiCfa"
                field={etablissementFormationUaiCfa}
                type="text"
                mt="2"
                onSubmittedField={onSubmittedEtablissementFormationUaiCfa}
              />
              <FormLabel fontWeight={700} my={3}>
                Adresse du lieu de formation :{" "}
              </FormLabel>
              <InputCerfa
                path="etablissementFormation.adresse.numero"
                field={etablissementFormationAdresseNumero}
                type="number"
                precision={0}
                mt="2"
                onSubmittedField={onSubmittedEtablissementFormationAdresseNumero}
                hasInfo={false}
              />
              <InputCerfa
                path="etablissementFormation.adresse.voie"
                field={etablissementFormationAdresseVoie}
                type="text"
                mt="2"
                onSubmittedField={onSubmittedEtablissementFormationAdresseVoie}
                hasInfo={false}
              />
              <InputCerfa
                path="etablissementFormation.adresse.complement"
                field={etablissementFormationAdresseComplement}
                type="text"
                mt="2"
                onSubmittedField={onSubmittedEtablissementFormationAdresseComplement}
                hasInfo={false}
              />
              <InputCerfa
                path="etablissementFormation.adresse.codePostal"
                field={etablissementFormationAdresseCodePostal}
                type="text"
                mt="2"
                onSubmittedField={onSubmittedEtablissementFormationAdresseCodePostal}
                hasInfo={false}
              />
              <InputCerfa
                path="etablissementFormation.adresse.commune"
                field={etablissementFormationAdresseCommune}
                type="text"
                mt="2"
                onSubmittedField={onSubmittedEtablissementFormationAdresseCommune}
                hasInfo={false}
              />
            </Box>
          </Flex>
        </Collapse>
      </Box>
    </>
  );
});

export default FormFormation;
