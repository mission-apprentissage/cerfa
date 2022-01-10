import React from "react";
import { Box, FormLabel, Flex } from "@chakra-ui/react";

import { useCerfaMaitres } from "../../../../common/hooks/useCerfa/parts/useCerfaMaitres";
import InputCerfa from "./Input";

const FormLearningMaster = () => {
  const {
    get: {
      maitre1: { nom: maitre1Nom, prenom: maitre1Prenom, dateNaissance: maitre1DateNaissance },
      maitre2: { nom: maitre2Nom, prenom: maitre2Prenom, dateNaissance: maitre2DateNaissance },
      employeur: { attestationEligibilite },
    },
  } = useCerfaMaitres();

  return (
    <Box>
      <Flex>
        <Box w="55%" flex="1">
          <FormLabel fontWeight={700}>Maître d'apprentissage n°1 </FormLabel>
          <InputCerfa path="maitre1.nom" field={maitre1Nom} type="text" mt="2" />
          <InputCerfa path="maitre1.prenom" field={maitre1Prenom} type="text" mt="2" />
          <InputCerfa path="maitre1.dateNaissance" field={maitre1DateNaissance} type="date" mt="2" />
        </Box>
        <Box w="55%" flex="1" ml={5}>
          <FormLabel fontWeight={700}>Maître d'apprentissage n°2 </FormLabel>
          <InputCerfa path="maitre2.nom" field={maitre2Nom} type="text" mt="2" />
          <InputCerfa path="maitre2.prenom" field={maitre2Prenom} type="text" mt="2" />
          <InputCerfa path="maitre2.dateNaissance" field={maitre2DateNaissance} type="date" mt="2" />
        </Box>
      </Flex>
      <InputCerfa path="employeur.attestationEligibilite" field={attestationEligibilite} type="consent" mt="2" />
    </Box>
  );
};

export default FormLearningMaster;
