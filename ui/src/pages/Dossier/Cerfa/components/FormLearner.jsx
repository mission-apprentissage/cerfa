import React, { useState } from "react";
import {
  Box,
  FormLabel,
  Text,
  Flex,
  Collapse,
  Center,
  Spinner,
  Button,
  List,
  ListItem,
  ListIcon,
  Link,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";

import { useCerfaApprenti } from "../../../../common/hooks/useCerfa/parts/useCerfaApprenti";
import {
  cerfaContratDateDebutContratAtom,
  cerfaContratDateFinContratAtom,
  cerfaContratRemunerationsAnnuellesAtom,
} from "../../../../common/hooks/useCerfa/parts/useCerfaContratAtoms";
import { cerfaEmployeurAdresseDepartementAtom } from "../../../../common/hooks/useCerfa/parts/useCerfaEmployeurAtoms";

import InputCerfa from "./Input";

// import { NavLink } from "react-router-dom";
import Tooltip from "../../../../common/components/Tooltip";
import { ArrowRightLine } from "../../../../theme/components/icons";

const CheckFieldsCompletion = () => {
  const { validate, fieldsErrored } = useCerfaApprenti();
  const [triggered, setTriggered] = useState(false);
  console.log(fieldsErrored);
  return (
    <>
      <Button
        mr={4}
        size="md"
        variant="secondary"
        onClick={() => {
          setTriggered(true);
          validate();
        }}
      >
        Est-ce que tous mes champs sont remplis ?
      </Button>
      <Collapse in={fieldsErrored.length > 0 && triggered} animateOpacity>
        <Tooltip variant="alert" mt={5}>
          <Text>{fieldsErrored.length} champ(s) non remplis :</Text>
          <List spacing={3} mt={3}>
            {fieldsErrored.map(({ type, name, label }) => {
              let anchor = name;
              if (type === "text" || type === "select" || type === "radio" || type === "phone" || type === "email") {
                anchor = `${name}_section-label`;
              }
              return (
                <ListItem key={name}>
                  <ListIcon as={ArrowRightLine} color="flatwarm" />
                  {/*
            TODO SHOULD BE LIKE THIS
             <Link as={NavLink} to={"#apprenti_departementNaissance_section-label"}>
          Département de naissance
        </Link> */}
                  <Link
                    onClick={() => {
                      const element = document.getElementById(anchor);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    {label.replace(":", "")}
                  </Link>
                </ListItem>
              );
            })}
          </List>
        </Tooltip>
      </Collapse>
    </>
  );
};

const FormLearner = React.memo(() => {
  const dateDebutContrat = useRecoilValue(cerfaContratDateDebutContratAtom);
  const dateFinContrat = useRecoilValue(cerfaContratDateFinContratAtom);
  const remunerationsAnnuelles = useRecoilValue(cerfaContratRemunerationsAnnuellesAtom);
  const employeurAdresseDepartement = useRecoilValue(cerfaEmployeurAdresseDepartementAtom);

  const {
    isLoading,
    get: {
      apprenti: {
        nom,
        prenom,
        sexe,
        nationalite,
        dateNaissance,
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
        adresse: { numero, voie, complement, codePostal, commune, pays },
        apprentiMineur: apprentiApprentiMineur,
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
            pays: responsableLegalAdressePays,
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
          pays: onSubmittedApprentiAdressePays,
        },
        apprentiMineur: onSubmittedApprentiApprentiMineur,
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
            pays: onSubmittedApprentiResponsableLegalAdressePays,
          },
        },
        inscriptionSportifDeHautNiveau: onSubmittedApprentiInscriptionSportifDeHautNiveau,
      },
    },
  } = useCerfaApprenti();

  if (isLoading || !dateDebutContrat || !dateFinContrat || !employeurAdresseDepartement)
    return (
      <Center>
        <Spinner />
      </Center>
    );

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
            path="apprenti.adresse.pays"
            field={pays}
            type="select"
            mt="2"
            onSubmittedField={onSubmittedApprentiAdressePays}
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
            hasInfo={false}
          />

          <Box mt={5}>
            <InputCerfa
              path="apprenti.apprentiMineur"
              field={apprentiApprentiMineur}
              type="radio"
              mt="2"
              onSubmittedField={onSubmittedApprentiApprentiMineur}
              hasInfo={false}
            />
            <InputCerfa
              path="apprenti.apprentiMineurNonEmancipe"
              field={apprentiApprentiMineurNonEmancipe}
              type="radio"
              mt="2"
              onSubmittedField={onSubmittedApprentiApprentiMineurNonEmancipe}
            />
          </Box>

          <Box mt={5}>
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
                <InputCerfa
                  path="apprenti.responsableLegal.adresse.pays"
                  field={responsableLegalAdressePays}
                  type="select"
                  mt="2"
                  onSubmittedField={onSubmittedApprentiResponsableLegalAdressePays}
                  hasInfo={false}
                />
              </Collapse>
            </Collapse>
          </Box>
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
              remunerationsAnnuelles: remunerationsAnnuelles,
              dateFinContrat: dateFinContrat?.value,
              employeurAdresseDepartement: employeurAdresseDepartement?.value,
              apprentiApprentiMineur: apprentiApprentiMineur?.value,
            }}
          />
          <InputCerfa
            path="apprenti.sexe"
            field={sexe}
            type="select"
            mt="2"
            onSubmittedField={onSubmittedApprentiSexe}
            hasInfo={false}
          />
          <InputCerfa
            path="apprenti.departementNaissance"
            field={departementNaissance}
            type="text"
            mt="2"
            forceUpperCase={true}
            onSubmittedField={onSubmittedApprentiDepartementNaissance}
          />
          <InputCerfa
            path="apprenti.communeNaissance"
            field={communeNaissance}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedApprentiCommuneNaissance}
            hasInfo={false}
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
            hasInfo={false}
          />
          <InputCerfa
            path="apprenti.inscriptionSportifDeHautNiveau"
            field={inscriptionSportifDeHautNiveau}
            type="radio"
            mt="2"
            onSubmittedField={onSubmittedApprentiInscriptionSportifDeHautNiveau}
            hasInfo={false}
          />
          <InputCerfa
            path="apprenti.handicap"
            field={handicap}
            type="radio"
            mt="2"
            onSubmittedField={onSubmittedApprentiHandicap}
            hasInfo={false}
          />
          <InputCerfa
            path="apprenti.situationAvantContrat"
            field={situationAvantContrat}
            type="select"
            mt="2"
            onSubmittedField={onSubmittedApprentiSituationAvantContrat}
            hasInfo={false}
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
            hasInfo={false}
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
      <CheckFieldsCompletion />
    </Box>
  );
});

export default FormLearner;
