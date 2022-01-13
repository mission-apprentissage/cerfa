import React from "react";
import { Box, FormLabel, Text, Flex, HStack, Collapse } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";

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
import InputCerfa from "./Input";

const FormContract = () => {
  const apprentiDateNaissance = useRecoilValue(cerfaApprentiDateNaissanceAtom);
  const maitre1DateNaissance = useRecoilValue(cerfaMaitre1DateNaissanceAtom);
  const maitre2DateNaissance = useRecoilValue(cerfaMaitre2DateNaissanceAtom);
  const formationDateDebutFormation = useRecoilValue(cerfaFormationDateDebutFormationAtom);
  const formationDateFinFormation = useRecoilValue(cerfaFormationDateFinFormationAtom);
  const apprentiAge = useRecoilValue(cerfaApprentiAgeAtom);

  const {
    get: {
      contrat: {
        typeContratApp,
        typeDerogation,
        numeroContratPrecedent,
        // dateConclusion,
        dateDebutContrat,
        dateEffetAvenant,
        dateFinContrat,
        // lieuSignatureContrat,
        dureeTravailHebdoHeures,
        dureeTravailHebdoMinutes,
        travailRisque,
        salaireEmbauche,
        caisseRetraiteComplementaire,
        avantageNature,
        avantageNourriture,
        avantageLogement,
        autreAvantageEnNature,
        remunerationMajoration,
        remunerationsAnnuelles,
      },
    },
    onSubmit: {
      contrat: {
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
        salaireEmbauche: onSubmittedContratSalaireEmbauche,
        caisseRetraiteComplementaire: onSubmittedContratCaisseRetraiteComplementaire,
        avantageNature: onSubmittedContratAvantageNature,
        avantageNourriture: onSubmittedContratAvantageNourriture,
        avantageLogement: onSubmittedContratAvantageLogement,
        autreAvantageEnNature: onSubmittedContratAutreAvantageEnNature,
        remunerationMajoration: onSubmittedContratRemunerationMajoration,
      },
    },
  } = useCerfaContrat();

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
          <InputCerfa
            path="contrat.typeDerogation"
            field={typeDerogation}
            type="select"
            mt="2"
            onSubmittedField={onSubmittedContratTypeDerogation}
          />
          <Text textStyle="sm" fontStyle="italic">
            à renseigner si une dérogation existe pour ce contrat
          </Text>
          {typeContratApp.valueDb !== 11 && (
            <InputCerfa
              path="contrat.numeroContratPrecedent"
              field={numeroContratPrecedent}
              type="text"
              mt="2"
              onSubmittedField={onSubmittedContratNumeroContratPrecedent}
            />
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
              apprentiAge: apprentiAge?.value,
              remunerationMajoration: remunerationMajoration?.valueDb,
              maitre1DateNaissance: maitre1DateNaissance?.value,
              maitre2DateNaissance: maitre2DateNaissance?.value,

              dateFinContrat: dateFinContrat?.value,
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
            }}
          />
          {/* <InputCerfa
            path="contrat.lieuSignatureContrat"
            field={lieuSignatureContrat}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedContratLieuSignatureContrat}
          /> */}
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
            />
            <InputCerfa
              path="contrat.dureeTravailHebdoMinutes"
              field={dureeTravailHebdoMinutes}
              type="number"
              onSubmittedField={onSubmittedContratDureeTravailHebdoMinutes}
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

        <Collapse in={dateDebutContrat.value !== ""} animateOpacity>
          <FormLabel fontWeight={700} fontSize="1.3rem">
            Rémunération
          </FormLabel>
          <InputCerfa
            path="contrat.remunerationMajoration"
            field={remunerationMajoration}
            type="select"
            mt="2"
            onSubmittedField={onSubmittedContratRemunerationMajoration}
            onAsyncData={{
              remunerationMajoration: remunerationMajoration,
              apprentiDateNaissance: apprentiDateNaissance?.value,
              dateDebutContrat: dateDebutContrat?.value,
              apprentiAge: apprentiAge?.value,
            }}
          />
          <Box mt={6} borderColor={"dgalt"} borderWidth={1} px={4} py={3}>
            {remunerationsAnnuelles.map((ra, i) => {
              if (i === 1 || i === 3 || i === 5 || i === 7) return null;

              return (
                <Box key={i}>
                  {i === 0 && (
                    <Box fontSize="1.1rem" fontWeight="bold">
                      1 re année, du
                    </Box>
                  )}
                  {i === 2 && (
                    <Box fontSize="1.1rem" fontWeight="bold" mt={2}>
                      2 eme année, du
                    </Box>
                  )}
                  {i === 4 && (
                    <Box fontSize="1.1rem" fontWeight="bold" mt={2}>
                      3 eme année, du
                    </Box>
                  )}
                  {i === 6 && (
                    <Box fontSize="1.1rem" fontWeight="bold" mt={2}>
                      4 eme année, du
                    </Box>
                  )}
                  <Box>
                    {[remunerationsAnnuelles[i], remunerationsAnnuelles[i + 1]].map((remunerationsAnnuelle, j) => {
                      let path = "";
                      switch (i + j) {
                        case 0:
                          path = "11";
                          break;
                        case 1:
                          path = "12";
                          break;
                        case 2:
                          path = "21";
                          break;
                        case 3:
                          path = "22";
                          break;
                        case 4:
                          path = "31";
                          break;
                        case 5:
                          path = "32";
                          break;
                        case 6:
                          path = "41";
                          break;
                        case 7:
                          path = "42";
                          break;

                        default:
                          break;
                      }
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
                            type="numberPrefixed"
                            mt="2"
                            hasInfo={false}
                            format={(val) => val + ` %`}
                            parse={(val) => val.replace(/^ %/, "")}
                          />
                          <Box w="100%" position="relative" fontStyle="italic" color="disablegrey" py={2}>
                            soit {remunerationsAnnuelle.salaireBrut.value} € / mois
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
                  mt="2"
                  onSubmittedField={onSubmittedContratSalaireEmbauche}
                />
              </Box>
            </Flex>
          </Box>
        </Collapse>

        <Flex mt={3}>
          <InputCerfa
            path="contrat.caisseRetraiteComplementaire"
            field={caisseRetraiteComplementaire}
            type="text"
            mt="2"
            onSubmittedField={onSubmittedContratCaisseRetraiteComplementaire}
          />
        </Flex>
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
                  type="text"
                  mt="2"
                  onSubmittedField={onSubmittedContratAvantageNourriture}
                />
                € / repas
              </Box>
              <Box ml={5}>
                <InputCerfa
                  path="contrat.avantageLogement"
                  field={avantageLogement}
                  type="text"
                  mt="2"
                  onSubmittedField={onSubmittedContratAvantageLogement}
                />
                € / mois
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
};

export default FormContract;
