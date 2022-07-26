import React from "react";
import { Box, Text } from "@chakra-ui/react";

const MentionsLegales = () => {
  return (
    <Box pt={1} pb={16}>
      <Box>
        <Text textAlign="center" mt={6}>
          Mentions légales « CELIA »
        </Text>
        <Box mt={4}>
          <Text>
            Le présent Site internet, accessible à l’adresse « celia.emploi.gouv.fr», est édité par le ministère du
            Travail, du Plein emploi et de l’Insertion (Délégation générale à l’emploi et à la formation
            professionnelle) (ci-après le « Ministère ») dont le siège est situé au 10-18 place des Cinq Martyrs du
            Lycée Buffon, 75015 Paris (tél. : 01 44 38 38 38) et dont le directeur de la publication est Bruno Lucas.
            L’hébergement du Site internet est assuré par la société CEGEDIM située à Boulogne Billancourt (92) La
            conception et la réalisation du site sont effectuées par le ministère du Travail, du Plein emploi et de
            l’insertion (Délégation générale à l’emploi et à la formation professionnelle) située au 10-10 place des
            Cinq Martyrs du Lycée Buffon, 75015 Paris
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
export default MentionsLegales;
