import React from "react";
import { Box, FormLabel, Text, Flex } from "@chakra-ui/react";

import { useCerfaApprenti } from "../../../../common/hooks/useCerfa/parts/useCerfaApprenti";
import InputCerfa from "./Input";

const FormLearner = () => {
  const {
    get: {
      apprenti: {
        nom,
        prenom,
        sexe,
        nationalite,
        dateNaissance,
        departementNaissance,
        communeNaissance,
        nir,
        regimeSocial,
        handicap,
        situationAvantContrat,
        diplome,
        derniereClasse,
        diplomePrepare,
        intituleDiplomePrepare,
        telephone,
        courriel,
        adresse: { numero, voie, complement, codePostal, commune },
        responsableLegal: {
          nom: responsableLegalNom,
          prenom: responsableLegalPrenom,
          adresse: {
            numero: responsableLegalAdresseNumero,
            voie: responsableLegalAdresseVoie,
            complement: responsableLegalAdresseComplement,
            codePostal: responsableLegalAdresseCodePostal,
            commune: responsableLegalAdresseCommune,
          },
        },
        inscriptionSportifDeHautNiveau,
      },
    },
  } = useCerfaApprenti();
  return (
    <Box>
      <Flex>
        <Box w="55%" flex="1">
          <InputCerfa path="apprenti.nom" field={nom} type="text" mt="2" />
          <InputCerfa path="apprenti.prenom" field={prenom} type="text" mt="2" />
          <InputCerfa path="apprenti.nir" field={nir} type="text" mt="2" />
          <FormLabel fontWeight="bold" my={3}>
            Adresse de l'apprenti(e) :
          </FormLabel>
          <InputCerfa path="apprenti.adresse.numero" field={numero} type="text" mt="2" />
          <InputCerfa path="apprenti.adresse.voie" field={voie} type="text" mt="2" />
          <InputCerfa path="apprenti.adresse.complement" field={complement} type="text" mt="2" />
          <InputCerfa path="apprenti.adresse.codePostal" field={codePostal} type="text" mt="2" />
          <InputCerfa path="apprenti.adresse.commune" field={commune} type="text" mt="2" />
          <InputCerfa path="apprenti.telephone" field={telephone} type="text" mt="2" />
          <InputCerfa path="apprenti.courriel" field={courriel} type="text" mt="2" />

          <Text fontWeight="bold" my={3}>
            Représentant légal <Text as="span">(à renseigner si l'apprenti est mineur non émancipé)</Text>
          </Text>
          <InputCerfa path="apprenti.responsableLegal.nom" field={responsableLegalNom} type="text" mt="2" />
          <InputCerfa path="apprenti.responsableLegal.prenom" field={responsableLegalPrenom} type="text" mt="2" />
          <Text fontWeight="bold" my={3}>
            Adresse du représentant légal :
          </Text>
          <InputCerfa
            path="apprenti.responsableLegal.adresse.numero"
            field={responsableLegalAdresseNumero}
            type="text"
            mt="2"
          />
          <InputCerfa
            path="apprenti.responsableLegal.adresse.voie"
            field={responsableLegalAdresseVoie}
            type="text"
            mt="2"
          />
          <InputCerfa
            path="apprenti.responsableLegal.adresse.complement"
            field={responsableLegalAdresseComplement}
            type="text"
            mt="2"
          />
          <InputCerfa
            path="apprenti.responsableLegal.adresse.codePostal"
            field={responsableLegalAdresseCodePostal}
            type="text"
            mt="2"
          />
          <InputCerfa
            path="apprenti.responsableLegal.adresse.commune"
            field={responsableLegalAdresseCommune}
            type="text"
            mt="2"
          />
        </Box>
        <Box w="45%" ml="5w">
          <InputCerfa path="apprenti.dateNaissance" field={dateNaissance} type="date" mt="2" />
          <InputCerfa path="apprenti.sexe" field={sexe} type="select" mt="2" />
          <InputCerfa path="apprenti.departementNaissance" field={departementNaissance} type="text" mt="2" />
          <InputCerfa path="apprenti.communeNaissance" field={communeNaissance} type="text" mt="2" />
          <InputCerfa path="apprenti.nationalite" field={nationalite} type="select" mt="2" />
          <InputCerfa path="apprenti.regimeSocial" field={regimeSocial} type="select" mt="2" />
          <InputCerfa
            path="apprenti.inscriptionSportifDeHautNiveau"
            field={inscriptionSportifDeHautNiveau}
            type="radio"
            mt="2"
          />
          <InputCerfa path="apprenti.handicap" field={handicap} type="radio" mt="2" />
          <InputCerfa path="apprenti.situationAvantContrat" field={situationAvantContrat} type="select" mt="2" />
          <InputCerfa path="apprenti.diplomePrepare" field={diplomePrepare} type="select" mt="2" />
          <InputCerfa path="apprenti.derniereClasse" field={derniereClasse} type="select" mt="2" />
          <InputCerfa path="apprenti.intituleDiplomePrepare" field={intituleDiplomePrepare} type="text" mt="2" />
          <InputCerfa path="apprenti.diplome" field={diplome} type="select" mt="2" />
        </Box>
      </Flex>
    </Box>
  );
};

export default FormLearner;
