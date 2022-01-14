import React from "react";
import { Box, FormLabel, Text, Flex, Collapse } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";

import { useCerfaApprenti } from "../../../../common/hooks/useCerfa/parts/useCerfaApprenti";
import {
  cerfaContratDateDebutContratAtom,
  cerfaContratDateFinContratAtom,
  cerfaContratRemunerationMajorationAtom,
} from "../../../../common/hooks/useCerfa/parts/useCerfaContratAtoms";
import InputCerfa from "./Input";

const FormLearner = () => {
  const dateDebutContrat = useRecoilValue(cerfaContratDateDebutContratAtom);
  const dateFinContrat = useRecoilValue(cerfaContratDateFinContratAtom);
  const remunerationMajoration = useRecoilValue(cerfaContratRemunerationMajorationAtom);
  const {
    get: {
      apprenti: {
        nom,
        prenom,
        sexe,
        nationalite,
        dateNaissance,
        majeur,
        departementNaissance,
        communeNaissance,
        // nir,
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
        apprentiMineurNonEmancipe: apprentiApprentiMineurNonEmancipe,
        responsableLegal: {
          nom: responsableLegalNom,
          prenom: responsableLegalPrenom,
          memeAdresse: responsableLegalMemeAdresse,
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
    onSubmit: {
      apprenti: {
        nom: onSubmittedApprentiNom,
        prenom: onSubmittedApprentiPrenom,
        sexe: onSubmittedApprentiSexe,
        nationalite: onSubmittedApprentiNationalite,
        departementNaissance: onSubmittedApprentiDepartementNaissance,
        communeNaissance: onSubmittedApprentiCommuneNaissance,
        dateNaissance: onSubmittedApprentiDateNaissance,
        regimeSocial: onSubmittedApprentiRegimeSocial,
        handicap: onSubmittedApprentiHandicap,
        situationAvantContrat: onSubmittedApprentiSituationAvantContrat,
        diplome: onSubmittedApprentiDiplome,
        derniereClasse: onSubmittedApprentiDerniereClasse,
        diplomePrepare: onSubmittedApprentiDiplomePrepare,
        intituleDiplomePrepare: onSubmittedApprentiIntituleDiplomePrepare,
        telephone: onSubmittedApprentiTelephone,
        courriel: onSubmittedApprentiCourriel,
        adresse: {
          numero: onSubmittedApprentiAdresseNumero,
          voie: onSubmittedApprentiAdresseVoie,
          complement: onSubmittedApprentiAdresseComplement,
          codePostal: onSubmittedApprentiAdresseCodePostal,
          commune: onSubmittedApprentiAdresseCommune,
        },
        apprentiMineurNonEmancipe: onSubmittedApprentiApprentiMineurNonEmancipe,
        responsableLegal: {
          nom: onSubmittedApprentiResponsableLegalNom,
          prenom: onSubmittedApprentiResponsableLegalPrenom,
          memeAdresse: onSubmittedApprentiResponsableLegalMemeAdresse,
          adresse: {
            numero: onSubmittedApprentiResponsableLegalAdresseNumero,
            voie: onSubmittedApprentiResponsableLegalAdresseVoie,
            complement: onSubmittedApprentiResponsableLegalAdresseComplement,
            codePostal: onSubmittedApprentiResponsableLegalAdresseCodePostal,
            commune: onSubmittedApprentiResponsableLegalAdresseCommune,
          },
        },
        inscriptionSportifDeHautNiveau: onSubmittedApprentiInscriptionSportifDeHautNiveau,
      },
    },
  } = useCerfaApprenti();
  return (
    <Box>
      <Flex>
        <Box w="55%" flex="1">
          <InputCerfa path="apprenti.nom" field={nom} type="text" mt="2" onSubmittedField={onSubmittedApprentiNom} />
          <InputCerfa
            path="apprenti.prenom"
            field={prenom}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedApprentiPrenom}
          />
          {/* <InputCerfa path="apprenti.nir" field={nir} type="text" mt="2" /> */}
          <FormLabel fontWeight="bold" my={3}>
            Adresse de l'apprenti(e) :
          </FormLabel>
          <InputCerfa
            path="apprenti.adresse.numero"
            field={numero}
            type="number"
            precision={0}
            mt="2"
            onSubmittedField={onSubmittedApprentiAdresseNumero}
            hasInfo={false}
          />
          <InputCerfa
            path="apprenti.adresse.voie"
            field={voie}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedApprentiAdresseVoie}
            hasInfo={false}
          />
          <InputCerfa
            path="apprenti.adresse.complement"
            field={complement}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedApprentiAdresseComplement}
            hasInfo={false}
          />
          <InputCerfa
            path="apprenti.adresse.codePostal"
            field={codePostal}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedApprentiAdresseCodePostal}
            hasInfo={false}
          />
          <InputCerfa
            path="apprenti.adresse.commune"
            field={commune}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedApprentiAdresseCommune}
            hasInfo={false}
          />
          <InputCerfa
            path="apprenti.telephone"
            field={telephone}
            type="phone"
            mt="2"
            onSubmittedField={onSubmittedApprentiTelephone}
          />
          <InputCerfa
            path="apprenti.courriel"
            field={courriel}
            type="email"
            mt="2"
            onSubmittedField={onSubmittedApprentiCourriel}
          />

          {!majeur && (
            <Box mt={5}>
              <Text>L'apprenti(e) n'est pas majeur, merci de compléter les informations suivantes</Text>
              <InputCerfa
                path="apprenti.apprentiMineurNonEmancipe"
                field={apprentiApprentiMineurNonEmancipe}
                type="radio"
                mt="2"
                onSubmittedField={onSubmittedApprentiApprentiMineurNonEmancipe}
              />
              <Collapse in={apprentiApprentiMineurNonEmancipe.value === "Oui"} animateOpacity>
                <Text fontWeight="bold" my={3}>
                  Représentant légal
                </Text>
                <InputCerfa
                  path="apprenti.responsableLegal.nom"
                  field={responsableLegalNom}
                  type="text"
                  mt="2"
                  onSubmittedField={onSubmittedApprentiResponsableLegalNom}
                />
                <InputCerfa
                  path="apprenti.responsableLegal.prenom"
                  field={responsableLegalPrenom}
                  type="text"
                  mt="2"
                  onSubmittedField={onSubmittedApprentiResponsableLegalPrenom}
                />
                <Text fontWeight="bold" my={3}>
                  Adresse du représentant légal :
                </Text>
                <InputCerfa
                  path="apprenti.responsableLegal.memeAdresse"
                  field={responsableLegalMemeAdresse}
                  type="radio"
                  mt="2"
                  onSubmittedField={onSubmittedApprentiResponsableLegalMemeAdresse}
                />
                <Collapse in={responsableLegalMemeAdresse.value === "Non"} animateOpacity>
                  <InputCerfa
                    path="apprenti.responsableLegal.adresse.numero"
                    field={responsableLegalAdresseNumero}
                    type="number"
                    precision={0}
                    mt="2"
                    onSubmittedField={onSubmittedApprentiResponsableLegalAdresseNumero}
                    hasInfo={false}
                  />
                  <InputCerfa
                    path="apprenti.responsableLegal.adresse.voie"
                    field={responsableLegalAdresseVoie}
                    type="text"
                    mt="2"
                    onSubmittedField={onSubmittedApprentiResponsableLegalAdresseVoie}
                    hasInfo={false}
                  />
                  <InputCerfa
                    path="apprenti.responsableLegal.adresse.complement"
                    field={responsableLegalAdresseComplement}
                    type="text"
                    mt="2"
                    onSubmittedField={onSubmittedApprentiResponsableLegalAdresseComplement}
                    hasInfo={false}
                  />
                  <InputCerfa
                    path="apprenti.responsableLegal.adresse.codePostal"
                    field={responsableLegalAdresseCodePostal}
                    type="text"
                    mt="2"
                    onSubmittedField={onSubmittedApprentiResponsableLegalAdresseCodePostal}
                    hasInfo={false}
                  />
                  <InputCerfa
                    path="apprenti.responsableLegal.adresse.commune"
                    field={responsableLegalAdresseCommune}
                    type="text"
                    mt="2"
                    onSubmittedField={onSubmittedApprentiResponsableLegalAdresseCommune}
                    hasInfo={false}
                  />
                </Collapse>
              </Collapse>
            </Box>
          )}
        </Box>
        <Box w="45%" ml="5w">
          <InputCerfa
            path="apprenti.dateNaissance"
            field={dateNaissance}
            type="date"
            mt="2"
            onSubmittedField={onSubmittedApprentiDateNaissance}
            onAsyncData={{
              dateDebutContrat: dateDebutContrat?.value,
              remunerationMajoration: remunerationMajoration?.valueDb,
              dateFinContrat: dateFinContrat?.value,
            }}
          />
          <InputCerfa
            path="apprenti.sexe"
            field={sexe}
            type="select"
            mt="2"
            onSubmittedField={onSubmittedApprentiSexe}
          />
          <InputCerfa
            path="apprenti.departementNaissance"
            field={departementNaissance}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedApprentiDepartementNaissance}
          />
          <InputCerfa
            path="apprenti.communeNaissance"
            field={communeNaissance}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedApprentiCommuneNaissance}
          />
          <InputCerfa
            path="apprenti.nationalite"
            field={nationalite}
            type="select"
            mt="2"
            onSubmittedField={onSubmittedApprentiNationalite}
          />
          <InputCerfa
            path="apprenti.regimeSocial"
            field={regimeSocial}
            type="select"
            mt="2"
            onSubmittedField={onSubmittedApprentiRegimeSocial}
          />
          <InputCerfa
            path="apprenti.inscriptionSportifDeHautNiveau"
            field={inscriptionSportifDeHautNiveau}
            type="radio"
            mt="2"
            onSubmittedField={onSubmittedApprentiInscriptionSportifDeHautNiveau}
          />
          <InputCerfa
            path="apprenti.handicap"
            field={handicap}
            type="radio"
            mt="2"
            onSubmittedField={onSubmittedApprentiHandicap}
          />
          <InputCerfa
            path="apprenti.situationAvantContrat"
            field={situationAvantContrat}
            type="select"
            mt="2"
            onSubmittedField={onSubmittedApprentiSituationAvantContrat}
          />
          <InputCerfa
            path="apprenti.diplomePrepare"
            field={diplomePrepare}
            type="select"
            mt="2"
            onSubmittedField={onSubmittedApprentiDiplomePrepare}
          />
          <InputCerfa
            path="apprenti.derniereClasse"
            field={derniereClasse}
            type="select"
            mt="2"
            onSubmittedField={onSubmittedApprentiDerniereClasse}
          />
          <InputCerfa
            path="apprenti.intituleDiplomePrepare"
            field={intituleDiplomePrepare}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedApprentiIntituleDiplomePrepare}
          />
          <InputCerfa
            path="apprenti.diplome"
            field={diplome}
            type="select"
            mt="2"
            onSubmittedField={onSubmittedApprentiDiplome}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default FormLearner;
