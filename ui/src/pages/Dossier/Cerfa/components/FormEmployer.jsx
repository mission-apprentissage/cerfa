import React, { useState } from "react";
import { Box, FormLabel, Flex, useDisclosure, Text, Link } from "@chakra-ui/react";

import AcknowledgeModal from "../../../../common/components/Modals/AcknowledgeModal";

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
      employeur: { siret: onSubmittedEmployeurSiret },
    },
  } = useCerfaEmployeur();

  const [hasSeenPrivateSectorModal, setHasSeenPrivateSectorModal] = useState(false);
  const isPrivateSectorAckModal = useDisclosure();

  return (
    <Box>
      <AcknowledgeModal
        title="Vous êtes employeur privé"
        isOpen={privePublic.value === "Employeur privé" && !hasSeenPrivateSectorModal}
        onClose={isPrivateSectorAckModal.onClose}
        onAcknowledgement={() => {
          setHasSeenPrivateSectorModal(true);
          isPrivateSectorAckModal.onClose();
        }}
      >
        <Text>
          Ce service de dépôt en ligne est reservé aux employeurs publics pour le moment. <br />
          Vous ne pourrez pas continuer ce dossier. <br />
          <br />
          Veuillez consulter{" "}
          <Link href={"/"} color={"bluefrance"} textDecoration={"underline"} isExternal>
            la fiche pratique
          </Link>{" "}
          pour établir un contrat d'apprentissage en tant qu'employeur privé.
        </Text>
      </AcknowledgeModal>
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
          <InputCerfa path="employeur.typeEmployeur" field={typeEmployeur} type="select" mt="2" />
          <InputCerfa path="employeur.employeurSpecifique" field={employeurSpecifique} type="select" mt="2" />
          <InputCerfa path="employeur.naf" field={naf} type="text" mt="2" />
          <InputCerfa path="employeur.nombreDeSalaries" field={nombreDeSalaries} type="text" mt="2" />
          <InputCerfa path="employeur.codeIdcc" field={codeIdcc} type="text" mt="2" />
          <InputCerfa path="employeur.libelleIdcc" field={libelleIdcc} type="text" mt="2" />
          <InputCerfa path="employeur.caisseComplementaire" field={caisseComplementaire} type="text" mt="2" />
          <InputCerfa path="employeur.regimeSpecifique" field={regimeSpecifique} type="radio" mt="2" />
          {/* <InputCerfa path="employeur.attestationEligibilite" field={attestationEligibilite} type="text" mt="2" /> */}
          {/* attestationPieces */}
        </Box>
      </Flex>
    </Box>
  );
};

export default FormEmployer;
