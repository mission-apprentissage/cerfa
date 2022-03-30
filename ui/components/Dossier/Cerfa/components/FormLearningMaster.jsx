import React from "react";
import { Box, FormLabel, Flex, Center, Spinner } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";

import { useCerfaMaitres } from "../../../../hooks/useCerfa/parts/useCerfaMaitres";
import { cerfaContratDateDebutContratAtom } from "../../../../hooks/useCerfa/parts/useCerfaContratAtoms";
import InputCerfa from "./Input";

// eslint-disable-next-line react/display-name
const FormLearningMaster = React.memo(() => {
  const dateDebutContrat = useRecoilValue(cerfaContratDateDebutContratAtom);
  const {
    isLoading,
    get: {
      maitre1: { nom: maitre1Nom, prenom: maitre1Prenom, dateNaissance: maitre1DateNaissance },
      maitre2: { nom: maitre2Nom, prenom: maitre2Prenom, dateNaissance: maitre2DateNaissance },
      employeur: { attestationEligibilite },
    },
    onSubmit: {
      maitre1: {
        nom: onSubmittedMaitre1Nom,
        prenom: onSubmittedMaitre1Prenom,
        dateNaissance: onSubmittedMaitre1DateNaissance,
      },
      maitre2: {
        nom: onSubmittedMaitre2Nom,
        prenom: onSubmittedMaitre2Prenom,
        dateNaissance: onSubmittedMaitre2DateNaissance,
      },
      employeur: { attestationEligibilite: onSubmittedEmployeurAttestationEligibilite },
    },
  } = useCerfaMaitres();

  if (isLoading || !dateDebutContrat)
    return (
      <Center>
        <Spinner />
      </Center>
    );

  return (
    <Box>
      <Flex>
        <Box w="55%" flex="1">
          <FormLabel fontWeight={700}>Maître d&lsquo;apprentissage n°1 </FormLabel>
          <InputCerfa
            path="maitre1.nom"
            field={maitre1Nom}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedMaitre1Nom}
            hasInfo={false}
          />
          <InputCerfa
            path="maitre1.prenom"
            field={maitre1Prenom}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedMaitre1Prenom}
            hasInfo={false}
          />
          <InputCerfa
            path="maitre1.dateNaissance"
            field={maitre1DateNaissance}
            type="date"
            mt="2"
            onSubmittedField={onSubmittedMaitre1DateNaissance}
            onAsyncData={{
              dateDebutContrat: dateDebutContrat?.value,
            }}
          />
        </Box>
        <Box w="55%" flex="1" ml={5}>
          <FormLabel fontWeight={700}>Maître d&lsquo;apprentissage n°2 (Optionnel)</FormLabel>
          <InputCerfa
            path="maitre2.nom"
            field={maitre2Nom}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedMaitre2Nom}
            hasInfo={false}
          />
          <InputCerfa
            path="maitre2.prenom"
            field={maitre2Prenom}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedMaitre2Prenom}
            hasInfo={false}
          />
          <InputCerfa
            path="maitre2.dateNaissance"
            field={maitre2DateNaissance}
            type="date"
            mt="2"
            onSubmittedField={onSubmittedMaitre2DateNaissance}
            onAsyncData={{
              dateDebutContrat: dateDebutContrat?.value,
            }}
          />
        </Box>
      </Flex>
      <InputCerfa
        path="employeur.attestationEligibilite"
        field={attestationEligibilite}
        type="consent"
        mt="2"
        onSubmittedField={onSubmittedEmployeurAttestationEligibilite}
      />
    </Box>
  );
});

export default FormLearningMaster;
