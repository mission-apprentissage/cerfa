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
        naf,
        nombreDeSalaries,
        codeIdcc,
        libelleIdcc,
        telephone,
        courriel,
        adresse: { numero, voie, complement, codePostal, commune },
        typeEmployeur,
        employeurSpecifique,
        caisseComplementaire,
        regimeSpecifique,
        privePublic,
      },
    },
    onSubmit: {
      employeur: {
        siret: onSubmittedEmployeurSiret,
        denomination: onSubmittedEmployeurDenomination,
        typeEmployeur: onSubmittedEmployeurTypeEmployeur,
        employeurSpecifique: onSubmittedEmployeurEmployeurSpecifique,
        nombreDeSalaries: onSubmittedEmployeurNombreDeSalaries,
        naf: onSubmittedEmployeurNaf,
        codeIdcc: onSubmittedEmployeurCodeIdcc,
        libelleIdcc: onSubmittedEmployeurLibelleIdcc,
        caisseComplementaire: onSubmittedEmployeurCaisseComplementaire,
        telephone: onSubmittedEmployeurTelephone,
        courriel: onSubmittedEmployeurCourriel,
        regimeSpecifique: onSubmittedEmployeurRegimeSpecifique,
        adresse: {
          numero: onSubmittedEmployeurAdresseNumero,
          voie: onSubmittedEmployeurAdresseVoie,
          complement: onSubmittedEmployeurAdresseComplement,
          codePostal: onSubmittedEmployeurAdresseCodePostal,
          commune: onSubmittedEmployeurAdresseCommune,
        },
      },
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
      <Flex>
        <Box w="55%" flex="1">
          <InputCerfa path="employeur.privePublic" field={privePublic} type="radio" mt="2" />
          <InputCerfa
            path="employeur.denomination"
            field={denomination}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedEmployeurDenomination}
          />
          <FormLabel fontWeight={700} my={3}>
            Adresse de l'établissement d'exécution du contrat :
          </FormLabel>
          <InputCerfa
            path="employeur.adresse.numero"
            field={numero}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedEmployeurAdresseNumero}
          />
          <InputCerfa
            path="employeur.adresse.voie"
            field={voie}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedEmployeurAdresseVoie}
          />
          <InputCerfa
            path="employeur.adresse.complement"
            field={complement}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedEmployeurAdresseComplement}
          />
          <InputCerfa
            path="employeur.adresse.codePostal"
            field={codePostal}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedEmployeurAdresseCodePostal}
          />
          <InputCerfa
            path="employeur.adresse.commune"
            field={commune}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedEmployeurAdresseCommune}
          />

          <InputCerfa
            path="employeur.telephone"
            field={telephone}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedEmployeurTelephone}
          />
          <InputCerfa
            path="employeur.courriel"
            field={courriel}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedEmployeurCourriel}
          />
        </Box>
        <Box w="45%" ml="5w">
          <InputCerfa
            path="employeur.typeEmployeur"
            field={typeEmployeur}
            type="select"
            mt="2"
            onSubmittedField={onSubmittedEmployeurTypeEmployeur}
          />
          <InputCerfa
            path="employeur.employeurSpecifique"
            field={employeurSpecifique}
            type="select"
            mt="2"
            onSubmittedField={onSubmittedEmployeurEmployeurSpecifique}
          />
          <InputCerfa path="employeur.naf" field={naf} type="text" mt="2" onSubmittedField={onSubmittedEmployeurNaf} />
          <InputCerfa
            path="employeur.nombreDeSalaries"
            field={nombreDeSalaries}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedEmployeurNombreDeSalaries}
          />
          <InputCerfa
            path="employeur.codeIdcc"
            field={codeIdcc}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedEmployeurCodeIdcc}
          />
          <InputCerfa
            path="employeur.libelleIdcc"
            field={libelleIdcc}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedEmployeurLibelleIdcc}
          />
          <InputCerfa
            path="employeur.caisseComplementaire"
            field={caisseComplementaire}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedEmployeurCaisseComplementaire}
          />
          <InputCerfa
            path="employeur.regimeSpecifique"
            field={regimeSpecifique}
            type="radio"
            mt="2"
            onSubmittedField={onSubmittedEmployeurRegimeSpecifique}
          />
          {/* <InputCerfa path="employeur.attestationEligibilite" field={attestationEligibilite} type="text" mt="2" /> */}
          {/* attestationPieces */}
        </Box>
      </Flex>
    </Box>
  );
};

export default FormEmployer;
