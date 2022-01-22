import React from "react";
import {
  Box,
  FormLabel,
  Text,
  Flex,
  HStack,
  Collapse,
  VStack,
  UnorderedList,
  ListItem,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";

import { departements } from "../../../../common/constants/departements";
import { useCerfaContrat } from "../../../../common/hooks/useCerfa/parts/useCerfaContrat";
import {
  cerfaApprentiDateNaissanceAtom,
  cerfaApprentiAgeAtom,
} from "../../../../common/hooks/useCerfa/parts/useCerfaApprentiAtoms";
import {
  cerfaMaitre1DateNaissanceAtom,
  cerfaMaitre2DateNaissanceAtom,
} from "../../../../common/hooks/useCerfa/parts/useCerfaMaitresAtoms";
import {
  cerfaFormationDateDebutFormationAtom,
  cerfaFormationDateFinFormationAtom,
} from "../../../../common/hooks/useCerfa/parts/useCerfaFormationAtoms";

import { cerfaEmployeurAdresseDepartementAtom } from "../../../../common/hooks/useCerfa/parts/useCerfaEmployeurAtoms";
import InputCerfa from "./Input";

const FormContract = React.memo(() => {
  const maitre1DateNaissance = useRecoilValue(cerfaMaitre1DateNaissanceAtom);
  const maitre2DateNaissance = useRecoilValue(cerfaMaitre2DateNaissanceAtom);
  const formationDateDebutFormation = useRecoilValue(cerfaFormationDateDebutFormationAtom);
  const formationDateFinFormation = useRecoilValue(cerfaFormationDateFinFormationAtom);
  const apprentiDateNaissance = useRecoilValue(cerfaApprentiDateNaissanceAtom);
  const apprentiAge = useRecoilValue(cerfaApprentiAgeAtom);
  const employeurAdresseDepartement = useRecoilValue(cerfaEmployeurAdresseDepartementAtom);

  const {
    isLoading,
    get: {
      contrat: {
        // modeContractuel: contratModeContractuel,
        typeContratApp,
        typeDerogation,
        numeroContratPrecedent,
        numeroContratPrecedentDepartement,
        numeroContratPrecedentAnnee,
        numeroContratPrecedentMois,
        numeroContratPrecedentNc,
        // dateConclusion,
        dateDebutContrat,
        dateEffetAvenant,
        dateFinContrat,
        // lieuSignatureContrat,
        dureeTravailHebdoHeures,
        dureeTravailHebdoMinutes,
        travailRisque,
        // caisseRetraiteComplementaire,
        avantageNature,
        avantageNourriture,
        avantageLogement,
        autreAvantageEnNature,
        salaireEmbauche,
        smic,
        remunerationsAnnuelles,
      },
    },
    onSubmit: {
      contrat: {
        // modeContractuel: onSubmittedContratModeContractuel,
        typeContratApp: onSubmittedContratTypeContratApp,
        numeroContratPrecedent: onSubmittedContratNumeroContratPrecedent,
        dateDebutContrat: onSubmittedContratDateDebutContrat,
        dateEffetAvenant: onSubmittedContratDateEffetAvenant,
        // dateConclusion: onSubmittedContratDateConclusion,
        dateFinContrat: onSubmittedContratDateFinContrat,
        // lieuSignatureContrat: onSubmittedContratLieuSignatureContrat,
        typeDerogation: onSubmittedContratTypeDerogation,
        dureeTravailHebdoHeures: onSubmittedContratDureeTravailHebdoHeures,
        contratDureeTravailHebdoMinutes: onSubmittedContratDureeTravailHebdoMinutes,
        travailRisque: onSubmittedContratTravailRisque,
        // salaireEmbauche: onSubmittedContratSalaireEmbauche,
        // caisseRetraiteComplementaire: onSubmittedContratCaisseRetraiteComplementaire,
        avantageNature: onSubmittedContratAvantageNature,
        avantageNourriture: onSubmittedContratAvantageNourriture,
        avantageLogement: onSubmittedContratAvantageLogement,
        autreAvantageEnNature: onSubmittedContratAutreAvantageEnNature,
        remunerationTaux: onSubmittedContratRemunerationsAnnuellesTaux,
      },
    },
  } = useCerfaContrat();

  if (
    isLoading ||
    !apprentiDateNaissance ||
    !apprentiAge ||
    !employeurAdresseDepartement ||
    !maitre1DateNaissance ||
    !maitre2DateNaissance ||
    !formationDateDebutFormation ||
    !formationDateFinFormation
  )
    return (
      <Center>
        <Spinner />
      </Center>
    );

  return (
    <Box>
      <Flex>
        <Box w="55%" flex="1">
          <InputCerfa
            path="contrat.typeContratApp"
            field={typeContratApp}
            type="select"
            mt="2"
            onSubmittedField={onSubmittedContratTypeContratApp}
          />
          {/* <InputCerfa
            path="contrat.modeContractuel"
            field={contratModeContractuel}
            type="select"
            mt="2"
            onSubmittedField={onSubmittedContratModeContractuel}
          /> */}
          <InputCerfa
            path="contrat.typeDerogation"
            field={typeDerogation}
            type="select"
            mt="2"
            onSubmittedField={onSubmittedContratTypeDerogation}
            onAsyncData={{
              dateDebutContrat: dateDebutContrat?.value,
              apprentiDateNaissance: apprentiDateNaissance?.value,
              apprentiAge: apprentiAge?.value,
            }}
          />
          <Text textStyle="sm" fontStyle="italic">
            à renseigner si une dérogation existe pour ce contrat
          </Text>
          {(dateDebutContrat.value === "" || apprentiDateNaissance.value === "") && (
            <Text as={"span"} fontWeight="400" fontStyle="italic" textStyle="sm" opacity={0.8}>
              Pour appliquer une dérogation, merci de renseigner les champs:{" "}
              <Text as={"span"} textDecoration={apprentiDateNaissance.value === "" ? "underline tomato" : "none"}>
                la date de naissance de l'apprenti
              </Text>
              ,{" "}
              <Text as={"span"} textDecoration={dateDebutContrat.value === "" ? "underline tomato" : "none"}>
                la date de début d'exécution du contrat
              </Text>
            </Text>
          )}

          {(typeContratApp.valueDb === 21 ||
            typeContratApp.valueDb === 22 ||
            typeContratApp.valueDb === 23 ||
            typeContratApp.valueDb === 31 ||
            typeContratApp.valueDb === 32 ||
            typeContratApp.valueDb === 33 ||
            typeContratApp.valueDb === 34 ||
            typeContratApp.valueDb === 35 ||
            typeContratApp.valueDb === 36 ||
            typeContratApp.valueDb === 37) && (
            <InputCerfa
              path="contrat.numeroContratPrecedent"
              field={numeroContratPrecedent}
              type="text"
              mt="2"
              onSubmittedField={onSubmittedContratNumeroContratPrecedent}
              label={
                typeContratApp.valueDb === 21 || typeContratApp.valueDb === 22 || typeContratApp.valueDb === 23
                  ? numeroContratPrecedent.labelSuccession
                  : numeroContratPrecedent.labelAvenant
              }
              isRequired={
                !(typeContratApp.valueDb === 21 || typeContratApp.valueDb === 22 || typeContratApp.valueDb === 23)
              }
            />
          )}
          {numeroContratPrecedent.value !== "" && (
            <Box>
              <Text fontWeight="400" fontStyle="italic">
                Information sur le précedent contrat:
                <br /> {numeroContratPrecedentMois}/{numeroContratPrecedentAnnee}
                {", "}
                {departements[numeroContratPrecedentDepartement]?.name} ({numeroContratPrecedentDepartement})
                {numeroContratPrecedentNc === "NC" && ", non conforme."}
              </Text>
            </Box>
          )}
          {/* <InputCerfa
            path="contrat.dateConclusion"
            field={dateConclusion}
            type="date"
            mt="2"
            onSubmittedField={onSubmittedContratDateConclusion}
          />
          <Text textStyle="sm">(Date de signature du présent contrat)</Text> */}
        </Box>
        <Box w="55%" ml="5w">
          <InputCerfa
            path="contrat.dateDebutContrat"
            field={dateDebutContrat}
            type="date"
            mt="2"
            onSubmittedField={onSubmittedContratDateDebutContrat}
            onAsyncData={{
              apprentiDateNaissance: apprentiDateNaissance?.value,
              employeurAdresseDepartement: employeurAdresseDepartement?.value,
              dateFinContrat: dateFinContrat?.value,
              remunerationsAnnuelles: remunerationsAnnuelles,

              maitre1DateNaissance: maitre1DateNaissance?.value,
              maitre2DateNaissance: maitre2DateNaissance?.value,

              dateEffetAvenant: dateEffetAvenant?.value,

              formationDateDebutFormation: formationDateDebutFormation?.value,
            }}
          />
          {(typeContratApp.valueDb === 31 ||
            typeContratApp.valueDb === 32 ||
            typeContratApp.valueDb === 33 ||
            typeContratApp.valueDb === 34 ||
            typeContratApp.valueDb === 35 ||
            typeContratApp.valueDb === 36 ||
            typeContratApp.valueDb === 37) && (
            <InputCerfa
              path="contrat.dateEffetAvenant"
              field={dateEffetAvenant}
              type="date"
              mt="2"
              onSubmittedField={onSubmittedContratDateEffetAvenant}
              onAsyncData={{ dateDebutContrat: dateDebutContrat?.value, dateFinContrat: dateFinContrat?.value }}
            />
          )}
          <InputCerfa
            path="contrat.dateFinContrat"
            field={dateFinContrat}
            type="date"
            mt="2"
            onSubmittedField={onSubmittedContratDateFinContrat}
            onAsyncData={{
              dateDebutContrat: dateDebutContrat?.value,
              dateEffetAvenant: dateEffetAvenant?.value,
              formationDateFinFormation: formationDateFinFormation?.value,
              apprentiDateNaissance: apprentiDateNaissance?.value,
              apprentiAge: apprentiAge?.value,
              employeurAdresseDepartement: employeurAdresseDepartement?.value,
              remunerationsAnnuelles: remunerationsAnnuelles,
            }}
          />
        </Box>
      </Flex>
      <Box pt={4}>
        <Box mb={8}>
          <FormLabel fontWeight={700}>Durée hebdomadaire du travail :</FormLabel>
          <Flex w="55%">
            <InputCerfa
              path="contrat.dureeTravailHebdoHeures"
              field={dureeTravailHebdoHeures}
              type="number"
              onSubmittedField={onSubmittedContratDureeTravailHebdoHeures}
              precision={0}
              min={1}
            />
            <InputCerfa
              path="contrat.dureeTravailHebdoMinutes"
              field={dureeTravailHebdoMinutes}
              type="number"
              onSubmittedField={onSubmittedContratDureeTravailHebdoMinutes}
              precision={0}
            />
          </Flex>
        </Box>
        <InputCerfa
          path="contrat.travailRisque"
          field={travailRisque}
          type="radio"
          mt="2"
          mb="6"
          onSubmittedField={onSubmittedContratTravailRisque}
        />

        <FormLabel fontWeight={700} fontSize="1.3rem">
          Rémunération
        </FormLabel>
        <Box mt={6} borderColor={"dgalt"} borderWidth={2} px={4} py={3} borderStyle="dashed" rounded="md">
          {(dateDebutContrat.value === "" ||
            dateFinContrat.value === "" ||
            apprentiDateNaissance.value === "" ||
            employeurAdresseDepartement.value === "") && (
            <VStack alignItems="flex-start" color="mgalt">
              <Text>
                L'outil détermine les périodes de rémunération et s'assure du respect du minimum légale pour chacune des
                périodes, à partir des éléments renseignés.
              </Text>
              <UnorderedList ml="30px !important">
                <ListItem
                  fontWeight="400"
                  fontStyle="italic"
                  color={apprentiDateNaissance.value === "" ? "error" : "green.500"}
                >
                  La date de naissance de l'apprenti
                </ListItem>
                <ListItem
                  fontWeight="400"
                  fontStyle="italic"
                  color={dateDebutContrat.value === "" ? "error" : "green.500"}
                >
                  La date de début d'exécution du contrat
                </ListItem>
                <ListItem
                  fontWeight="400"
                  fontStyle="italic"
                  color={dateFinContrat.value === "" ? "error" : "green.500"}
                >
                  La date de fin du contrat
                </ListItem>
                <ListItem
                  fontWeight="400"
                  fontStyle="italic"
                  color={employeurAdresseDepartement.value === "" ? "error" : "green.500"}
                >
                  Le département de l'employeur
                </ListItem>
              </UnorderedList>
            </VStack>
          )}
          <Collapse
            in={
              dateDebutContrat.value !== "" &&
              dateFinContrat.value !== "" &&
              apprentiDateNaissance.value !== "" &&
              employeurAdresseDepartement.value !== ""
            }
            animateOpacity
          >
            {Object.keys(remunerationsAnnuelles).map((part, ite) => {
              if (ite === 1 || ite === 3 || ite === 5 || ite === 7) return null;
              let sub1 = 0;
              let sub2 = 0;
              if (ite === 0) {
                sub1 = 11;
                sub2 = 12;
              } else if (ite === 2) {
                sub1 = 21;
                sub2 = 22;
              } else if (ite === 4) {
                sub1 = 31;
                sub2 = 32;
              } else if (ite === 6) {
                sub1 = 41;
                sub2 = 42;
              }

              const [remPart1, remPart2] = [remunerationsAnnuelles[sub1], remunerationsAnnuelles[sub2]];
              const emptyLine = remPart1.taux.value === 0 && remPart2.taux.value === 0;

              return (
                <Box key={ite}>
                  {ite === 0 && !emptyLine && (
                    <Box fontSize="1.1rem" fontWeight="bold">
                      1 re année, du
                    </Box>
                  )}
                  {ite === 2 && !emptyLine && (
                    <Box fontSize="1.1rem" fontWeight="bold" mt={2}>
                      2 eme année, du
                    </Box>
                  )}
                  {ite === 4 && !emptyLine && (
                    <Box fontSize="1.1rem" fontWeight="bold" mt={2}>
                      3 eme année, du
                    </Box>
                  )}
                  {ite === 6 && !emptyLine && (
                    <Box fontSize="1.1rem" fontWeight="bold" mt={2}>
                      4 eme année, du
                    </Box>
                  )}
                  <Box>
                    {[remPart1, remPart2].map((remunerationsAnnuelle, j) => {
                      let path = j === 0 ? `${sub1}` : `${sub2}`;
                      if (remunerationsAnnuelle.taux.value === 0) {
                        return null;
                      }
                      return (
                        <HStack spacing={2} key={j} alignItems="flex-end">
                          <InputCerfa
                            path={`contrat.remunerationsAnnuelles.${path}.dateDebut`}
                            field={remunerationsAnnuelle.dateDebut}
                            type="date"
                            mt="2"
                            hasInfo={false}
                          />
                          <Box mt="1.7rem !important">au</Box>
                          <InputCerfa
                            path={`contrat.remunerationsAnnuelles.${path}.dateFin`}
                            field={remunerationsAnnuelle.dateFin}
                            type="date"
                            mt="2"
                            hasInfo={false}
                          />
                          <InputCerfa
                            path={`contrat.remunerationsAnnuelles.${path}.taux`}
                            field={remunerationsAnnuelle.taux}
                            min={remunerationsAnnuelle.tauxMinimal.value}
                            mt="2"
                            hasInfo={false}
                            numberStepper={true}
                            format={(val) => val + ` %`}
                            parse={(val) => val.replace(/^ %/, "")}
                            type="number"
                            onSubmittedField={(fieldPath, data) =>
                              onSubmittedContratRemunerationsAnnuellesTaux(fieldPath, data, path)
                            }
                          />
                          <Box w="100%" position="relative" fontStyle="italic" color="disablegrey" pl={2}>
                            soit {remunerationsAnnuelle.salaireBrut.value.toFixed(2)} € / mois. <br />
                            Seuil minimal légal {remunerationsAnnuelle.tauxMinimal.value} %
                          </Box>
                          {/* <Box mt="1.7rem !important">%</Box>
                          <Box mt="1.7rem !important">du</Box>
                          <InputCerfa
                            path={`contrat.remunerationsAnnuelles.${path}.typeSalaire`}
                            field={remunerationsAnnuelle.typeSalaire}
                            type="select"
                            mt="2"
                            hasInfo={false}
                          />
                          <Box mt="1.7rem !important">;</Box> */}
                        </HStack>
                      );
                    })}
                  </Box>
                </Box>
              );
            })}
            <Flex mt={5}>
              <Box w="55%" flex="1">
                <InputCerfa
                  path="contrat.salaireEmbauche"
                  field={salaireEmbauche}
                  type="number"
                  precision={2}
                  mt="2"
                  // onSubmittedField={onSubmittedContratSalaireEmbauche}
                />
              </Box>
            </Flex>
            <Flex mt={5}>
              {!smic?.isSmicException && (
                <Text>
                  Calculé sur la base du SMIC {smic?.annee} de {smic?.selectedSmic}€ mensuel (
                  {smic?.heuresHebdomadaires}
                  €/h) [Date d'entrée en vigueur {smic?.dateEntreeEnVigueur}]
                </Text>
              )}
              {smic?.isSmicException && (
                <Text>
                  Calculé sur la base du SMIC {smic?.annee} pour{" "}
                  <strong>{smic?.exceptions[employeurAdresseDepartement.value]?.nomDepartement}</strong> de{" "}
                  {smic?.selectedSmic}€ mensuel (
                  {smic?.exceptions[employeurAdresseDepartement.value]?.heuresHebdomadaires}
                  €/h) [Date d'entrée en vigueur {smic?.dateEntreeEnVigueur}]
                </Text>
              )}
            </Flex>
          </Collapse>
        </Box>

        {/* <Flex mt={3}>
          <InputCerfa
            path="contrat.caisseRetraiteComplementaire"
            field={caisseRetraiteComplementaire}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedContratCaisseRetraiteComplementaire}
          />
        </Flex> */}
        <Box mt={6}>
          <InputCerfa
            path="contrat.avantageNature"
            field={avantageNature}
            type="radio"
            mt="2"
            onSubmittedField={onSubmittedContratAvantageNature}
          />
          <Collapse in={avantageNature.value === "Oui"} animateOpacity>
            <FormLabel my={4} fontWeight={700}>
              Avantages en nature, le cas échéant :
            </FormLabel>
            <Flex>
              <Box flex="1">
                <InputCerfa
                  path="contrat.avantageNourriture"
                  field={avantageNourriture}
                  type="number"
                  min={1}
                  mt="2"
                  onSubmittedField={onSubmittedContratAvantageNourriture}
                />
              </Box>
              <Box ml={5}>
                <InputCerfa
                  path="contrat.avantageLogement"
                  field={avantageLogement}
                  type="number"
                  min={1}
                  mt="2"
                  onSubmittedField={onSubmittedContratAvantageLogement}
                />
              </Box>
            </Flex>
            <Box>
              <InputCerfa
                path="contrat.autreAvantageEnNature"
                field={autreAvantageEnNature}
                type="consent"
                mt="2"
                onSubmittedField={onSubmittedContratAutreAvantageEnNature}
              />
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Box>
  );
});

export default FormContract;
