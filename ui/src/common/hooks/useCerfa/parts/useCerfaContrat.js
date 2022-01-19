/***
 * Multiple states on purpose to avoid full re-rendering at each modification
 */

import { useCallback } from "react";
import { DateTime } from "luxon";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import {
  fieldCompletionPercentage,
  convertValueToDate,
  convertDateToValue,
  convertOptionToValue,
  convertValueToOption,
  convertValueToMultipleSelectOption,
  convertMultipleSelectOptionToValue,
  caclAgeAtDate,
  normalizeInputNumberForDb,
} from "../../../utils/formUtils";
import { buildRemunerations, buildRemunerationsDbValue } from "../../../utils/form/remunerationsUtils";
import { saveCerfa } from "../useCerfa";
import { cerfaAtom } from "../cerfaAtom";
import { dossierAtom } from "../../useDossier/dossierAtom";
import { cerfaApprentiAgeAtom, cerfaApprentiDateNaissanceAtom } from "./useCerfaApprentiAtoms";
import * as contratAtoms from "./useCerfaContratAtoms";

const cerfaContratCompletion = (res) => {
  let fieldsToKeep = {
    // contratModeContractuel: res.contrat.modeContractuel,
    contratTypeContratApp: res.contrat.typeContratApp,
    contratDateDebutContrat: res.contrat.dateDebutContrat,
    // contratDateConclusion: res.contrat.dateConclusion,
    contratDateFinContrat: res.contrat.dateFinContrat,
    // contratLieuSignatureContrat: res.contrat.lieuSignatureContrat,
    // contratTypeDerogation: res.contrat.typeDerogation,
    contratDureeTravailHebdoHeures: res.contrat.dureeTravailHebdoHeures,
    // contratDureeTravailHebdoMinutes: res.contrat.dureeTravailHebdoMinutes,
    contratTravailRisque: res.contrat.travailRisque,
    // contratSalaireEmbauche: res.contrat.salaireEmbauche,
    // contratCaisseRetraiteComplementaire: res.contrat.caisseRetraiteComplementaire,
    contratAvantageNature: res.contrat.avantageNature,
  };
  let countFields = 6;
  const avantageNature = res.contrat.avantageNature.value;
  const contratInitial = res.contrat.typeContratApp.value === 11;
  const avenant =
    res.contrat.typeContratApp.value === 31 ||
    res.contrat.typeContratApp.value === 32 ||
    res.contrat.typeContratApp.value === 33 ||
    res.contrat.typeContratApp.value === 34 ||
    res.contrat.typeContratApp.value === 35 ||
    res.contrat.typeContratApp.value === 36 ||
    res.contrat.typeContratApp.value === 37;

  if (!contratInitial) {
    if (avenant) {
      fieldsToKeep = {
        ...fieldsToKeep,
        contratDateEffetAvenant: res.contrat.dateEffetAvenant,
        contratNumeroContratPrecedent: res.contrat.numeroContratPrecedent,
      };
      countFields = countFields + 2;
    }
  }

  if (avantageNature) {
    if (res.contrat.avantageNourriture.value !== "")
      fieldsToKeep = { ...fieldsToKeep, contratAvantageNourriture: res.contrat.avantageNourriture };
    else if (res.contrat.avantageLogement.value !== "")
      fieldsToKeep = { ...fieldsToKeep, contratAvantageLogement: res.contrat.avantageLogement };
    else if (res.contrat.autreAvantageEnNature.value !== "") {
      fieldsToKeep = { ...fieldsToKeep, contratAutreAvantageEnNature: res.contrat.autreAvantageEnNature };
    }

    countFields = countFields + 1;
  }

  return fieldCompletionPercentage(fieldsToKeep, countFields);
};

export const CerfaContratController = async (dossier) => {
  return {
    contrat: {
      dateDebutContrat: {
        doAsyncActions: async (value, data) => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          const dateDebutContrat = DateTime.fromISO(value).setLocale("fr-FR");
          let dureeContrat = 0;

          if (data.dateFinContrat) {
            const dateFinContrat = DateTime.fromISO(data.dateFinContrat).setLocale("fr-FR");
            const diffInMonths = dateFinContrat.diff(dateDebutContrat, "months");
            dureeContrat = diffInMonths.months;
          }

          // const today = DateTime.now().setLocale("fr-FR");
          // if (dateDebutContrat <= today) {
          //   return {
          //     successed: false,
          //     data: null,
          //     message: "Date de début de contrat ne peut pas être antérieure à aujourd'hui",
          //   };
          // }

          if (data.dateEffetAvenant) {
            const dateEffetAvenant = DateTime.fromISO(data.dateEffetAvenant).setLocale("fr-FR");
            if (dateDebutContrat > dateEffetAvenant) {
              return {
                successed: false,
                data: null,
                message: "Date de début de contrat ne peut pas être après la date d'effet de l'avenant",
              };
            }
          }

          if (data.formationDateDebutFormation) {
            const formationDateDebutFormation = DateTime.fromISO(data.formationDateDebutFormation).setLocale("fr-FR");
            if (dateDebutContrat < formationDateDebutFormation.minus({ months: 3 })) {
              return {
                successed: false,
                data: null,
                message: "Le contrat peut commencer au maximum 3 mois avant le début de la formation",
              };
            }
          }

          if (data.dateFinContrat) {
            const dateFinContrat = DateTime.fromISO(data.dateFinContrat).setLocale("fr-FR");
            if (dateDebutContrat >= dateFinContrat) {
              return {
                successed: false,
                data: null,
                message: "Date de début de contrat ne peut pas être après la date de fin de contrat",
              };
            }
          }

          if (data.dateFinContrat) {
            if (dureeContrat < 6) {
              return {
                successed: false,
                data: null,
                message: "La durée du contrat de peut pas être inférieure à 6 mois",
              };
            }
          }

          if (data.dateFinContrat) {
            if (dureeContrat > 54) {
              return {
                successed: false,
                data: null,
                message: "La durée du contrat de peut pas être suprérieure à 4 ans et 6 mois",
              };
            }
          }

          if (data.maitre1DateNaissance !== "") {
            const { age: ageMaitre1 } = caclAgeAtDate(data.maitre1DateNaissance, value);
            if (ageMaitre1 < 18) {
              return {
                successed: false,
                data: null,
                message:
                  "Le maître d'apprentissage doit avoir au moins 18 ans à la date de début d'exécution du contrat",
              };
            }
          }

          if (data.maitre2DateNaissance !== "") {
            const { age: ageMaitre2 } = caclAgeAtDate(data.maitre2DateNaissance, value);
            if (ageMaitre2 < 18) {
              return {
                successed: false,
                data: null,
                message:
                  "Le maître d'apprentissage doit avoir au moins 18 ans à la date de début d'exécution du contrat",
              };
            }
          }

          let age = null;
          if (data.apprentiDateNaissance !== "") {
            const cAge = caclAgeAtDate(data.apprentiDateNaissance, value);
            age = cAge.age;

            if (age < 15) {
              return {
                successed: false,
                data: null,
                message: "L'apprenti(e) doit avoir au moins 15 ans à la date de début d'exécution du contrat",
              };
            }

            if (data.dateFinContrat !== "" && data.employeurAdresseDepartement !== "") {
              const { remunerationsAnnuelles, salaireEmbauche, remunerationsAnnuellesDbValue, smicObj } =
                buildRemunerations({
                  apprentiDateNaissance: data.apprentiDateNaissance,
                  apprentiAge: age,
                  dateDebutContrat: value,
                  dateFinContrat: data.dateFinContrat,
                  employeurAdresseDepartement: data.employeurAdresseDepartement,
                  remunerationsAnnuelles: data.remunerationsAnnuelles,
                });

              return {
                successed: true,
                data: {
                  dateDebutContrat: value,
                  dateFinContrat: data.dateFinContrat,
                  remunerationsAnnuelles,
                  remunerationsAnnuellesDbValue,
                  smicObj,
                  salaireEmbauche,
                  dureeContrat,
                  apprentiDateNaissance: data.apprentiDateNaissance,
                  apprentiAge: age,
                },
                message: null,
              };
            }
          }

          return {
            successed: true,
            data: {
              dateDebutContrat: value,
              dateFinContrat: data.dateFinContrat,
              dureeContrat,
              apprentiDateNaissance: data.apprentiDateNaissance,
              apprentiAge: age,
            },
            message: null,
          };
        },
      },
      dateFinContrat: {
        doAsyncActions: async (value, data) => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          const dateFinContrat = DateTime.fromISO(value).setLocale("fr-FR");
          let dureeContrat = 0;

          if (data.dateDebutContrat) {
            const dateDebutContrat = DateTime.fromISO(data.dateDebutContrat).setLocale("fr-FR");
            const diffInMonths = dateFinContrat.diff(dateDebutContrat, "months");
            dureeContrat = diffInMonths.months;
          }

          if (data.dateDebutContrat) {
            const dateDebutContrat = DateTime.fromISO(data.dateDebutContrat).setLocale("fr-FR");
            if (dateDebutContrat >= dateFinContrat) {
              return {
                successed: false,
                data: null,
                message: "Date de fin de contrat ne peut pas être avant la date de début de contrat",
              };
            }
          }
          if (data.dateEffetAvenant) {
            const dateEffetAvenant = DateTime.fromISO(data.dateEffetAvenant).setLocale("fr-FR");
            if (dateEffetAvenant > dateFinContrat) {
              return {
                successed: false,
                data: null,
                message: "Date de fin de contrat ne peut pas être avant la date d'effet de l'avenant",
              };
            }
          }

          if (data.dateDebutContrat) {
            if (dureeContrat < 6) {
              return {
                successed: false,
                data: null,
                message: "La durée du contrat de peut pas être inférieure à 6 mois",
              };
            }
          }

          if (data.dateDebutContrat) {
            if (dureeContrat > 54) {
              return {
                successed: false,
                data: null,
                message: "La durée du contrat de peut pas être suprérieure à 4 ans et 6 mois",
              };
            }
          }

          if (data.formationDateFinFormation) {
            const formationDateFinFormation = DateTime.fromISO(data.formationDateFinFormation).setLocale("fr-FR");
            if (dateFinContrat > formationDateFinFormation.plus({ months: 3 })) {
              return {
                successed: false,
                data: null,
                message: "Le contrat peut se terminer au maximum 3 mois après la fin de la formation",
              };
            }
          }

          if (
            data.apprentiDateNaissance !== "" &&
            data.dateDebutContrat !== "" &&
            data.employeurAdresseDepartement !== ""
          ) {
            const { remunerationsAnnuelles, salaireEmbauche, remunerationsAnnuellesDbValue, smicObj } =
              buildRemunerations({
                apprentiDateNaissance: data.apprentiDateNaissance,
                apprentiAge: data.apprentiAge,
                dateDebutContrat: data.dateDebutContrat,
                dateFinContrat: value,
                employeurAdresseDepartement: data.employeurAdresseDepartement,
                remunerationsAnnuelles: data.remunerationsAnnuelles,
              });

            return {
              successed: true,
              data: {
                dateFinContrat: value,
                dateDebutContrat: data.dateDebutContrat,
                dateEffetAvenant: data.dateEffetAvenant,
                dureeContrat,
                remunerationsAnnuelles,
                remunerationsAnnuellesDbValue,
                smicObj,
                salaireEmbauche,
              },
              message: null,
            };
          }

          return {
            successed: true,
            data: {
              dateFinContrat: value,
              dateDebutContrat: data.dateDebutContrat,
              dateEffetAvenant: data.dateEffetAvenant,
              dureeContrat,
            },
            message: null,
          };
        },
      },
      dateEffetAvenant: {
        doAsyncActions: async (value, data) => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          const dateEffetAvenant = DateTime.fromISO(value).setLocale("fr-FR");
          if (data.dateDebutContrat) {
            const dateDebutContrat = DateTime.fromISO(data.dateDebutContrat).setLocale("fr-FR");
            if (dateDebutContrat > dateEffetAvenant) {
              return {
                successed: false,
                data: null,
                message: "Date d'effet de l'avenant ne peut pas être avant la date de début d'exécution du contrat",
              };
            }
          }

          if (data.dateFinContrat) {
            const dateFinContrat = DateTime.fromISO(data.dateFinContrat).setLocale("fr-FR");
            if (dateFinContrat < dateEffetAvenant) {
              return {
                successed: false,
                data: null,
                message: "Date d'effet de l'avenant ne peut pas être après la date de fin de contrat",
              };
            }
          }

          return {
            successed: true,
            data: {
              dateEffetAvenant: value,
              dateDebutContrat: data.dateDebutContrat,
              dateFinContrat: data.dateFinContrat,
            },
            message: null,
          };
        },
      },
      typeDerogation: {
        doAsyncActions: async (value, data) => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return {
            successed: true,
            data: {
              ...data,
              typeDerogation: value,
            },
            message: null,
          };
        },
      },
      dureeTravailHebdoHeures: {
        doAsyncActions: async (value, data) => {
          await new Promise((resolve) => setTimeout(resolve, 100));

          if (parseInt(value) > 40) {
            return {
              successed: false,
              data: null,
              message: "la durée de travail hebdomadaire en heures ne peut excéder 40h",
            };
          }

          return {
            successed: true,
            data: {
              dureeTravailHebdoHeures: value,
            },
            message: null,
          };
        },
      },
      dureeTravailHebdoMinutes: {
        doAsyncActions: async (value, data) => {
          await new Promise((resolve) => setTimeout(resolve, 100));

          if (parseInt(value) > 59) {
            return {
              successed: false,
              data: null,
              message: "la durée de travail hebdomadaire en minutes ne peut excéder 59 minutes",
            };
          }

          return {
            successed: true,
            data: {
              dureeTravailHebdoMinutes: value,
            },
            message: null,
          };
        },
      },
    },
  };
};

export function useCerfaContrat() {
  const cerfa = useRecoilValue(cerfaAtom);
  const dossier = useRecoilValue(dossierAtom);
  const apprentiAge = useRecoilValue(cerfaApprentiAgeAtom);
  const setApprentiAge = useSetRecoilState(cerfaApprentiAgeAtom);
  const apprentiDateNaissance = useRecoilValue(cerfaApprentiDateNaissanceAtom);
  const setApprentiDateNaissance = useSetRecoilState(cerfaApprentiDateNaissanceAtom);

  //Internal
  const [partContratCompletion, setPartContratCompletion] = useRecoilState(contratAtoms.cerfaPartContratCompletionAtom);

  const [contratModeContractuel, setContratModeContractuel] = useRecoilState(
    contratAtoms.cerfaContratModeContractuelAtom
  );
  const [contratTypeContratApp, setContratTypeContratApp] = useRecoilState(contratAtoms.cerfaContratTypeContratAppAtom);
  const [contratNumeroContratPrecedent, setContratNumeroContratPrecedent] = useRecoilState(
    contratAtoms.cerfaContratNumeroContratPrecedentAtom
  );
  const [contratNumeroContratPrecedentDepartement, setContratNumeroContratPrecedentDepartement] = useRecoilState(
    contratAtoms.cerfaContratNumeroContratPrecedentDepartementAtom
  );
  const [contratNumeroContratPrecedentAnnee, setContratNumeroContratPrecedentAnnee] = useRecoilState(
    contratAtoms.cerfaContratNumeroContratPrecedentAnneeAtom
  );
  const [contratNumeroContratPrecedentMois, setContratNumeroContratPrecedentMois] = useRecoilState(
    contratAtoms.cerfaContratNumeroContratPrecedentMoisAtom
  );
  const [contratNumeroContratPrecedentNc, setContratNumeroContratPrecedentNc] = useRecoilState(
    contratAtoms.cerfaContratNumeroContratPrecedentNcAtom
  );

  const [contratNoContrat, setContratNoContrat] = useRecoilState(contratAtoms.cerfaContratNoContratAtom);
  const [contratNoAvenant, setContratNoAvenant] = useRecoilState(contratAtoms.cerfaContratNoAvenantAtom);
  const [contratDateDebutContrat, setContratDateDebutContrat] = useRecoilState(
    contratAtoms.cerfaContratDateDebutContratAtom
  );
  const [contratDureeContrat, seContratDureeContrat] = useRecoilState(contratAtoms.cerfaContratDureeContratAtom);
  const [contratDateEffetAvenant, setContratDateEffetAvenant] = useRecoilState(
    contratAtoms.cerfaContratDateEffetAvenantAtom
  );
  const [contratDateConclusion, setContratDateConclusion] = useRecoilState(contratAtoms.cerfaContratDateConclusionAtom);
  const [contratDateFinContrat, setContratDateFinContrat] = useRecoilState(contratAtoms.cerfaContratDateFinContratAtom);
  const [contratDateRupture, setContratDateRupture] = useRecoilState(contratAtoms.cerfaContratDateRuptureAtom);
  const [contratLieuSignatureContrat, setContratLieuSignatureContrat] = useRecoilState(
    contratAtoms.cerfaContratLieuSignatureContratAtom
  );
  const [contratTypeDerogation, setContratTypeDerogation] = useRecoilState(contratAtoms.cerfaContratTypeDerogationAtom);
  const [contratDureeTravailHebdoHeures, setContratDureeTravailHebdoHeures] = useRecoilState(
    contratAtoms.cerfaContratDureeTravailHebdoHeuresAtom
  );
  const [contratDureeTravailHebdoMinutes, setContratDureeTravailHebdoMinutes] = useRecoilState(
    contratAtoms.cerfaContratDureeTravailHebdoMinutesAtom
  );
  const [contratTravailRisque, setContratTravailRisque] = useRecoilState(contratAtoms.cerfaContratTravailRisqueAtom);
  const [contratCaisseRetraiteComplementaire, setContratCaisseRetraiteComplementaire] = useRecoilState(
    contratAtoms.cerfaContratCaisseRetraiteComplementaireAtom
  );
  const [contratAvantageNature, setContratAvantageNature] = useRecoilState(contratAtoms.cerfaContratAvantageNatureAtom);
  const [contratAvantageNourriture, setContratAvantageNourriture] = useRecoilState(
    contratAtoms.cerfaContratAvantageNourritureAtom
  );
  const [contratAvantageLogement, setContratAvantageLogement] = useRecoilState(
    contratAtoms.cerfaContratAvantageLogementAtom
  );
  const [contratAutreAvantageEnNature, setContratAutreAvantageEnNature] = useRecoilState(
    contratAtoms.cerfaContratAutreAvantageEnNatureAtom
  );
  const [contratSalaireEmbauche, setContratSalaireEmbauche] = useRecoilState(
    contratAtoms.cerfaContratSalaireEmbaucheAtom
  );
  const [contratSmic, setContratSmic] = useRecoilState(contratAtoms.cerfaContratSmicAtom);
  const [contratRemunerationsAnnuelles, setContratRemunerationsAnnuelles] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuellesAtom
  );

  const setRemunerations = useCallback(
    async (data) => {
      setContratRemunerationsAnnuelles(data.remunerationsAnnuelles);

      setContratSalaireEmbauche({
        ...contratSalaireEmbauche,
        value: data.salaireEmbauche.toFixed(2),
      });

      setContratSmic(data.smicObj);
    },
    [contratSalaireEmbauche, setContratRemunerationsAnnuelles, setContratSalaireEmbauche, setContratSmic]
  );

  let getTypeDerogation = (typeDerogation = null, { dateNaissance, age, contratDateDebutContratString }) => {
    if (dateNaissance === "" || !age || contratDateDebutContratString === "") {
      return typeDerogation;
    }

    const isApprentiGEQ16 = age >= 16;
    const isApprentiLOW16 = age < 16;
    const isApprentiGEQ30 = age >= 30;
    const isApprentiLOW30 = age < 30;

    // 11 not allowed if age >= 16 à la date d'execution
    // if age  à la date d'execution < 16   type 11 ||  50
    // 12 not allowed age < 30  à la date d'execution
    // if age  à la date d'execution >= 30  type 12 ||  50
    const options = [];
    let valueForbidden = false;
    for (let i = 0; i < typeDerogation.options.length; i++) {
      let option = { ...typeDerogation.options[i] };
      option.locked = false;

      if (isApprentiGEQ30) {
        if (option.value === 12 || option.value === 50) {
          option.locked = false;
        } else {
          option.locked = true;
        }
      } else if (isApprentiLOW16) {
        if (option.value === 11 || option.value === 50) {
          option.locked = false;
        } else {
          option.locked = true;
        }
      } else {
        if (isApprentiGEQ16) {
          if (option.value === 11) {
            option.locked = true;
          }
        }
        if (isApprentiLOW30) {
          if (option.value === 12) {
            option.locked = true;
          }
        }
      }

      if (convertOptionToValue(typeDerogation) === option.value && option.locked) {
        valueForbidden = true;
      }
      options.push(option);
    }

    if (!valueForbidden) {
      return { ...typeDerogation, options };
    } else {
      return { ...typeDerogation, options, value: "" };
    }
  };

  let refreshTypeDerogation = useCallback(
    ({ dateNaissance, age, contratDateDebutContratString }) => {
      const typeDerog = getTypeDerogation(contratTypeDerogation, {
        dateNaissance,
        age,
        contratDateDebutContratString,
      });
      setContratTypeDerogation({ ...typeDerog, triggerValidation: true });
    },
    [contratTypeDerogation, setContratTypeDerogation]
  );

  const onSubmittedContratDateDebutContrat = useCallback(
    async (path, data, forcedTriggered) => {
      try {
        if (path === "contrat.dateDebutContrat") {
          const newV = {
            contrat: {
              dateDebutContrat: {
                ...contratDateDebutContrat,
                value: data.dateDebutContrat,
              },
              dureeContrat: {
                ...contratDureeContrat,
                value: data.dureeContrat,
              },
            },
            apprenti: {
              age: {
                ...apprentiAge,
                value: data.apprentiAge,
              },
            },
          };
          let shouldSaveInDb = false;
          if (!forcedTriggered) {
            if (contratDateDebutContrat.value !== newV.contrat.dateDebutContrat.value) {
              if (contratDateFinContrat.value !== "")
                setContratDateFinContrat({ ...contratDateFinContrat, triggerValidation: true });

              if (!apprentiAge.value && newV.apprenti.age.value !== apprentiAge.value) {
                setApprentiAge(newV.apprenti.age);
                setApprentiDateNaissance({ ...apprentiDateNaissance, triggerValidation: true });
              }

              const typeDerog = getTypeDerogation(contratTypeDerogation, {
                dateNaissance: data.apprentiDateNaissance,
                age: data.apprentiAge,
                contratDateDebutContratString: data.dateDebutContrat,
              });
              setContratTypeDerogation({ ...typeDerog });

              setContratDateDebutContrat(newV.contrat.dateDebutContrat);
              seContratDureeContrat(newV.contrat.dureeContrat);

              shouldSaveInDb = true;
            }
          } else {
            setContratDateDebutContrat({ ...contratDateDebutContrat, triggerValidation: false });
            shouldSaveInDb = true;
          }

          if (shouldSaveInDb) {
            let dataToSave = {
              contrat: {
                dateDebutContrat: convertDateToValue(newV.contrat.dateDebutContrat),
                dureeContrat: data.dureeContrat,
              },
              apprenti: {
                age: newV.apprenti.age.value,
              },
            };
            if (data.remunerationsAnnuelles && data.remunerationsAnnuellesDbValue && data.salaireEmbauche) {
              setRemunerations(data);
              dataToSave = {
                contrat: {
                  ...dataToSave.contrat,
                  remunerationsAnnuelles: data.remunerationsAnnuellesDbValue,
                  salaireEmbauche: data.salaireEmbauche.toFixed(2),
                  smic: data.smicObj,
                },
              };
            }

            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
            setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      contratDateDebutContrat,
      contratDureeContrat,
      apprentiAge,
      contratDateFinContrat,
      setContratDateFinContrat,
      contratTypeDerogation,
      setContratTypeDerogation,
      setContratDateDebutContrat,
      seContratDureeContrat,
      setApprentiAge,
      setApprentiDateNaissance,
      apprentiDateNaissance,
      dossier?._id,
      cerfa?.id,
      setPartContratCompletion,
      setRemunerations,
    ]
  );

  const onSubmittedContratDateEffetAvenant = useCallback(
    async (path, data) => {
      try {
        if (path === "contrat.dateEffetAvenant") {
          const newV = {
            contrat: {
              dateEffetAvenant: {
                ...contratDateEffetAvenant,
                value: data.dateEffetAvenant,
              },
            },
          };
          if (contratDateEffetAvenant.value !== newV.contrat.dateEffetAvenant.value) {
            setContratDateEffetAvenant(newV.contrat.dateEffetAvenant);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                dateEffetAvenant: convertDateToValue(newV.contrat.dateEffetAvenant),
              },
            });
            setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [contratDateEffetAvenant, setContratDateEffetAvenant, dossier?._id, cerfa?.id, setPartContratCompletion]
  );

  const onSubmittedContratDateConclusion = useCallback(
    async (path, data) => {
      try {
        if (path === "contrat.dateConclusion") {
          const newV = {
            contrat: {
              dateConclusion: {
                ...contratDateConclusion,
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (contratDateConclusion.value !== newV.contrat.dateConclusion.value) {
            setContratDateConclusion(newV.contrat.dateConclusion);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                dateConclusion: convertDateToValue(newV.contrat.dateConclusion),
              },
            });
            setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [contratDateConclusion, setContratDateConclusion, dossier?._id, cerfa?.id, setPartContratCompletion]
  );

  const onSubmittedContratDateFinContrat = useCallback(
    async (path, data, forcedTriggered) => {
      try {
        if (path === "contrat.dateFinContrat") {
          const newV = {
            contrat: {
              dateFinContrat: {
                ...contratDateFinContrat,
                value: data.dateFinContrat,
              },
              dureeContrat: {
                ...contratDureeContrat,
                value: data.dureeContrat,
              },
            },
          };
          let shouldSaveInDb = false;
          if (!forcedTriggered) {
            if (contratDateFinContrat.value !== newV.contrat.dateFinContrat.value) {
              if (contratDateDebutContrat.value !== "")
                setContratDateDebutContrat({ ...contratDateDebutContrat, triggerValidation: true });

              setContratDateFinContrat(newV.contrat.dateFinContrat);
              seContratDureeContrat(newV.contrat.dureeContrat);

              shouldSaveInDb = true;
            }
          } else {
            setContratDateFinContrat({ ...contratDateFinContrat, triggerValidation: false });
            shouldSaveInDb = true;
          }
          if (shouldSaveInDb) {
            let dataToSave = {
              contrat: {
                dateFinContrat: convertDateToValue(newV.contrat.dateFinContrat),
                dureeContrat: data.dureeContrat,
              },
            };

            if (data.remunerationsAnnuelles && data.remunerationsAnnuellesDbValue && data.salaireEmbauche) {
              setRemunerations(data);
              dataToSave = {
                contrat: {
                  ...dataToSave.contrat,
                  remunerationsAnnuelles: data.remunerationsAnnuellesDbValue,
                  salaireEmbauche: data.salaireEmbauche.toFixed(2),
                  smic: data.smicObj,
                },
              };
            }

            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
            setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      contratDateFinContrat,
      contratDureeContrat,
      setContratDateDebutContrat,
      contratDateDebutContrat,
      setContratDateFinContrat,
      seContratDureeContrat,
      dossier?._id,
      cerfa?.id,
      setPartContratCompletion,
      setRemunerations,
    ]
  );

  const onSubmittedContratDateRupture = useCallback(
    async (path, data) => {
      try {
        if (path === "contrat.dateRupture") {
          const newV = {
            contrat: {
              dateRupture: {
                ...contratDateRupture,
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (contratDateRupture.value !== newV.contrat.dateRupture.value) {
            setContratDateRupture(newV.contrat.dateRupture);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                dateRupture: convertDateToValue(newV.contrat.dateRupture),
              },
            });
            setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [contratDateRupture, setContratDateRupture, dossier?._id, cerfa?.id, setPartContratCompletion]
  );

  const onSubmittedContratDureeTravailHebdoHeures = useCallback(
    async (path, data) => {
      try {
        if (path === "contrat.dureeTravailHebdoHeures") {
          const newV = {
            contrat: {
              dureeTravailHebdoHeures: {
                ...contratDureeTravailHebdoHeures,
                value: data.dureeTravailHebdoHeures,
              },
            },
          };
          if (contratDureeTravailHebdoHeures.value !== newV.contrat.dureeTravailHebdoHeures.value) {
            setContratDureeTravailHebdoHeures(newV.contrat.dureeTravailHebdoHeures);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                dureeTravailHebdoHeures: normalizeInputNumberForDb(newV.contrat.dureeTravailHebdoHeures.value),
              },
            });
            setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      contratDureeTravailHebdoHeures,
      setContratDureeTravailHebdoHeures,
      dossier?._id,
      cerfa?.id,
      setPartContratCompletion,
    ]
  );

  const onSubmittedContratDureeTravailHebdoMinutes = useCallback(
    async (path, data) => {
      try {
        if (path === "contrat.dureeTravailHebdoMinutes") {
          const newV = {
            contrat: {
              dureeTravailHebdoMinutes: {
                ...contratDureeTravailHebdoMinutes,
                value: data.dureeTravailHebdoMinutes,
              },
            },
          };
          if (contratDureeTravailHebdoMinutes.value !== newV.contrat.dureeTravailHebdoMinutes.value) {
            setContratDureeTravailHebdoMinutes(newV.contrat.dureeTravailHebdoMinutes);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                dureeTravailHebdoMinutes: normalizeInputNumberForDb(newV.contrat.dureeTravailHebdoMinutes.value),
              },
            });
            setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      contratDureeTravailHebdoMinutes,
      setContratDureeTravailHebdoMinutes,
      dossier?._id,
      cerfa?.id,
      setPartContratCompletion,
    ]
  );

  const onSubmittedContratTravailRisque = useCallback(
    async (path, data) => {
      try {
        if (path === "contrat.travailRisque") {
          const newV = {
            contrat: {
              travailRisque: {
                ...contratTravailRisque,
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (contratTravailRisque.value !== newV.contrat.travailRisque.value) {
            setContratTravailRisque(newV.contrat.travailRisque);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                travailRisque: convertOptionToValue(newV.contrat.travailRisque),
              },
            });
            setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [contratTravailRisque, setContratTravailRisque, dossier?._id, cerfa?.id, setPartContratCompletion]
  );

  const onSubmittedContratModeContractuel = useCallback(
    async (path, data) => {
      try {
        if (path === "contrat.modeContractuel") {
          const newV = {
            contrat: {
              modeContractuel: {
                ...contratModeContractuel,
                value: data,
              },
            },
          };
          if (contratModeContractuel.value !== newV.contrat.modeContractuel.value) {
            setContratModeContractuel(newV.contrat.modeContractuel);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                modeContractuel: convertOptionToValue(newV.contrat.modeContractuel),
              },
            });
            setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [contratModeContractuel, setContratModeContractuel, dossier?._id, cerfa?.id, setPartContratCompletion]
  );

  const onSubmittedContratTypeContratApp = useCallback(
    async (path, data) => {
      try {
        if (path === "contrat.typeContratApp") {
          const newV = {
            contrat: {
              typeContratApp: {
                ...contratTypeContratApp,
                value: data,
                valueDb: convertMultipleSelectOptionToValue({ ...contratTypeContratApp, value: data }),
              },
            },
          };
          if (contratTypeContratApp.value !== newV.contrat.typeContratApp.value) {
            setContratTypeContratApp(newV.contrat.typeContratApp);

            let dataToSave = {
              contrat: {
                typeContratApp: convertMultipleSelectOptionToValue(newV.contrat.typeContratApp),
              },
            };

            const contratInitial = newV.contrat.typeContratApp.valueDb === 11;
            const succession =
              newV.contrat.typeContratApp.valueDb === 21 ||
              newV.contrat.typeContratApp.valueDb === 22 ||
              newV.contrat.typeContratApp.valueDb === 23;

            if (contratInitial) {
              dataToSave = {
                contrat: {
                  ...dataToSave.contrat,
                  numeroContratPrecedent: null,
                  dateEffetAvenant: null,
                },
              };
            } else if (succession) {
              dataToSave = {
                contrat: {
                  ...dataToSave.contrat,
                  dateEffetAvenant: null,
                  numeroContratPrecedent: contratNumeroContratPrecedent?.value || null,
                },
              };
            } else {
              dataToSave = {
                contrat: {
                  ...dataToSave.contrat,
                  dateEffetAvenant: convertDateToValue(contratDateEffetAvenant),
                  numeroContratPrecedent: contratNumeroContratPrecedent?.value || null,
                },
              };
            }

            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
            setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      contratTypeContratApp,
      setContratTypeContratApp,
      dossier?._id,
      cerfa?.id,
      setPartContratCompletion,
      contratNumeroContratPrecedent?.value,
      contratDateEffetAvenant,
    ]
  );

  const onSubmittedContratTypeDerogation = useCallback(
    async (path, data, forcedTriggered) => {
      try {
        if (path === "contrat.typeDerogation") {
          const newV = {
            contrat: {
              typeDerogation: {
                ...contratTypeDerogation,
                value: data.typeDerogation,
              },
            },
          };
          let shouldSaveInDb = false;
          const typeDerog = getTypeDerogation(newV.contrat.typeDerogation, {
            dateNaissance: data.apprentiDateNaissance,
            age: data.apprentiAge,
            contratDateDebutContratString: data.dateDebutContrat,
          });

          if (!forcedTriggered) {
            if (contratTypeDerogation.value !== typeDerog.value) {
              setContratTypeDerogation(typeDerog);
              shouldSaveInDb = true;
            }
          } else {
            setContratTypeDerogation({ ...typeDerog, triggerValidation: false });
            shouldSaveInDb = true;
          }
          if (shouldSaveInDb) {
            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                typeDerogation: convertOptionToValue(typeDerog),
              },
            });
            setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [contratTypeDerogation, setContratTypeDerogation, dossier?._id, cerfa?.id, setPartContratCompletion]
  );

  const setNumeroContratPrecedentDetails = useCallback(
    async (data) => {
      if (data !== "") {
        setContratNumeroContratPrecedentDepartement(data.substr(0, 3));
        setContratNumeroContratPrecedentAnnee(data.substr(3, 4));
        setContratNumeroContratPrecedentMois(data.substr(7, 2));
        setContratNumeroContratPrecedentNc(data.substr(9, 2));
      }
    },
    [
      setContratNumeroContratPrecedentDepartement,
      setContratNumeroContratPrecedentAnnee,
      setContratNumeroContratPrecedentMois,
      setContratNumeroContratPrecedentNc,
    ]
  );

  const onSubmittedContratNumeroContratPrecedent = useCallback(
    async (path, data) => {
      try {
        if (path === "contrat.numeroContratPrecedent") {
          const newV = {
            contrat: {
              numeroContratPrecedent: {
                ...contratNumeroContratPrecedent,
                value: data,
              },
            },
          };
          if (contratNumeroContratPrecedent.value !== newV.contrat.numeroContratPrecedent.value) {
            setContratNumeroContratPrecedent(newV.contrat.numeroContratPrecedent);

            setNumeroContratPrecedentDetails(data);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                numeroContratPrecedent: newV.contrat.numeroContratPrecedent.value || null,
              },
            });
            setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      contratNumeroContratPrecedent,
      setContratNumeroContratPrecedent,
      setNumeroContratPrecedentDetails,
      dossier?._id,
      cerfa?.id,
      setPartContratCompletion,
    ]
  );

  const onSubmittedContratSalaireEmbauche = useCallback(
    async (path, data) => {
      try {
        if (path === "contrat.salaireEmbauche") {
          const newV = {
            contrat: {
              salaireEmbauche: {
                ...contratSalaireEmbauche,
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (contratSalaireEmbauche.value !== newV.contrat.salaireEmbauche.value) {
            setContratSalaireEmbauche(newV.contrat.salaireEmbauche);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                salaireEmbauche: newV.contrat.salaireEmbauche.value,
              },
            });
            setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [contratSalaireEmbauche, setContratSalaireEmbauche, dossier?._id, cerfa?.id, setPartContratCompletion]
  );

  const onSubmittedContratCaisseRetraiteComplementaire = useCallback(
    async (path, data) => {
      try {
        if (path === "contrat.caisseRetraiteComplementaire") {
          const newV = {
            contrat: {
              caisseRetraiteComplementaire: {
                ...contratCaisseRetraiteComplementaire,
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (contratCaisseRetraiteComplementaire.value !== newV.contrat.caisseRetraiteComplementaire.value) {
            setContratCaisseRetraiteComplementaire(newV.contrat.caisseRetraiteComplementaire);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                caisseRetraiteComplementaire: newV.contrat.caisseRetraiteComplementaire.value,
              },
            });
            setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      contratCaisseRetraiteComplementaire,
      setContratCaisseRetraiteComplementaire,
      dossier?._id,
      cerfa?.id,
      setPartContratCompletion,
    ]
  );

  const onSubmittedContratAvantageNature = useCallback(
    async (path, data) => {
      try {
        if (path === "contrat.avantageNature") {
          const newV = {
            contrat: {
              avantageNature: {
                ...contratAvantageNature,
                value: data,
              },
            },
          };
          if (contratAvantageNature.value !== newV.contrat.avantageNature.value) {
            setContratAvantageNature(newV.contrat.avantageNature);

            const dbValue = convertOptionToValue(newV.contrat.avantageNature);
            let dataToSave = {
              contrat: {
                avantageNature: dbValue,
              },
            };
            if (!dbValue) {
              dataToSave = {
                contrat: {
                  ...dataToSave.contrat,
                  avantageNourriture: null,
                  avantageLogement: null,
                  autreAvantageEnNature: null,
                },
              };
            } else {
              dataToSave = {
                contrat: {
                  ...dataToSave.contrat,
                  avantageNourriture: normalizeInputNumberForDb(contratAvantageNourriture?.value),
                  avantageLogement: normalizeInputNumberForDb(contratAvantageLogement?.value),
                  autreAvantageEnNature: contratAutreAvantageEnNature?.value === "true" ? true : null,
                },
              };
            }
            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
            setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      cerfa?.id,
      contratAutreAvantageEnNature?.value,
      contratAvantageLogement?.value,
      contratAvantageNature,
      contratAvantageNourriture?.value,
      dossier?._id,
      setContratAvantageNature,
      setPartContratCompletion,
    ]
  );

  const onSubmittedContratAvantageNourriture = useCallback(
    async (path, data) => {
      try {
        if (path === "contrat.avantageNourriture") {
          const newV = {
            contrat: {
              avantageNourriture: {
                ...contratAvantageNourriture,
                value: data,
              },
            },
          };
          if (contratAvantageNourriture.value !== newV.contrat.avantageNourriture.value) {
            setContratAvantageNourriture(newV.contrat.avantageNourriture);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                avantageNourriture: normalizeInputNumberForDb(data),
              },
            });
            setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [cerfa?.id, contratAvantageNourriture, dossier?._id, setContratAvantageNourriture, setPartContratCompletion]
  );

  const onSubmittedContratAvantageLogement = useCallback(
    async (path, data) => {
      try {
        if (path === "contrat.avantageLogement") {
          const newV = {
            contrat: {
              avantageLogement: {
                ...contratAvantageLogement,
                value: data,
              },
            },
          };
          if (contratAvantageLogement.value !== newV.contrat.avantageLogement.value) {
            setContratAvantageLogement(newV.contrat.avantageLogement);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                avantageLogement: normalizeInputNumberForDb(data),
              },
            });
            setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [cerfa?.id, contratAvantageLogement, dossier?._id, setContratAvantageLogement, setPartContratCompletion]
  );

  const onSubmittedContratAutreAvantageEnNature = useCallback(
    async (path, data) => {
      try {
        if (path === "contrat.autreAvantageEnNature") {
          const newV = {
            contrat: {
              autreAvantageEnNature: {
                ...contratAutreAvantageEnNature,
                value: contratAutreAvantageEnNature.value === "true" ? "" : "true",
              },
            },
          };
          if (contratAutreAvantageEnNature.value !== newV.contrat.autreAvantageEnNature.value) {
            setContratAutreAvantageEnNature(newV.contrat.autreAvantageEnNature);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                autreAvantageEnNature: newV.contrat.autreAvantageEnNature.value === "true" ? true : null,
              },
            });
            setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [cerfa?.id, contratAutreAvantageEnNature, dossier?._id, setContratAutreAvantageEnNature, setPartContratCompletion]
  );

  const onSubmittedContratRemunerationsAnnuellesTaux = useCallback(
    async (path, data, part) => {
      try {
        if (path === `contrat.remunerationsAnnuelles.${part}.taux`) {
          let newRemunerationsAnnuellesTauxPart = { ...contratRemunerationsAnnuelles[part].taux };
          newRemunerationsAnnuellesTauxPart.value = parseInt(data);
          let newRemunerationsAnnuellesSalaireBrutPart = { ...contratRemunerationsAnnuelles[part].salaireBrut };
          newRemunerationsAnnuellesSalaireBrutPart.value =
            (contratSmic?.selectedSmic * newRemunerationsAnnuellesTauxPart.value) / 100;

          const newRemunerationsAnnuellesFormValue = {
            ...contratRemunerationsAnnuelles,
            [part]: {
              ...contratRemunerationsAnnuelles[part],
              taux: newRemunerationsAnnuellesTauxPart,
              salaireBrut: newRemunerationsAnnuellesSalaireBrutPart,
            },
          };

          const { salaireEmbauche, remunerationsAnnuellesDbValue } = buildRemunerationsDbValue(
            newRemunerationsAnnuellesFormValue
          );

          setContratRemunerationsAnnuelles(newRemunerationsAnnuellesFormValue);
          setContratSalaireEmbauche({ ...contratSalaireEmbauche, value: salaireEmbauche });

          let dataToSave = {
            contrat: {
              remunerationsAnnuelles: remunerationsAnnuellesDbValue,
              salaireEmbauche: salaireEmbauche.toFixed(2),
            },
          };
          await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      cerfa?.id,
      contratRemunerationsAnnuelles,
      contratSalaireEmbauche,
      contratSmic?.selectedSmic,
      dossier?._id,
      setContratRemunerationsAnnuelles,
      setContratSalaireEmbauche,
    ]
  );

  const setAll = async (res) => {
    setContratModeContractuel(convertValueToOption(res.contrat.modeContractuel));
    setContratTypeContratApp(convertValueToMultipleSelectOption(res.contrat.typeContratApp));
    setContratNumeroContratPrecedent(res.contrat.numeroContratPrecedent);
    setNumeroContratPrecedentDetails(res.contrat.numeroContratPrecedent.value);

    setContratNoContrat(res.contrat.noContrat);
    setContratNoAvenant(res.contrat.noAvenant);
    setContratDateDebutContrat(convertValueToDate(res.contrat.dateDebutContrat));
    seContratDureeContrat(res.contrat.dureeContrat);
    setContratDateEffetAvenant(convertValueToDate(res.contrat.dateEffetAvenant));
    setContratDateConclusion(convertValueToDate(res.contrat.dateConclusion));
    setContratDateFinContrat(convertValueToDate(res.contrat.dateFinContrat));
    setContratDateRupture(convertValueToDate(res.contrat.dateRupture));

    setContratLieuSignatureContrat(res.contrat.lieuSignatureContrat);

    const typeDerog = getTypeDerogation(convertValueToOption(res.contrat.typeDerogation), {
      dateNaissance: convertValueToDate(res.apprenti.dateNaissance).value,
      age: res.apprenti.age.value,
      contratDateDebutContratString: convertValueToDate(res.contrat.dateDebutContrat).value,
    });
    setContratTypeDerogation(typeDerog);

    setContratDureeTravailHebdoHeures(res.contrat.dureeTravailHebdoHeures);
    setContratDureeTravailHebdoMinutes(res.contrat.dureeTravailHebdoMinutes);
    setContratTravailRisque(convertValueToOption(res.contrat.travailRisque));
    setContratCaisseRetraiteComplementaire(res.contrat.caisseRetraiteComplementaire);
    setContratAvantageNature(convertValueToOption(res.contrat.avantageNature));
    setContratAvantageNourriture(res.contrat.avantageNourriture);
    setContratAvantageLogement(res.contrat.avantageLogement);
    setContratAutreAvantageEnNature(convertValueToOption(res.contrat.autreAvantageEnNature));

    setContratSalaireEmbauche(res.contrat.salaireEmbauche);
    setContratSmic(res.contrat.smic.value);

    const emptyLineObj = {
      dateDebut: { ...contratAtoms.defaultDateDebut },
      dateFin: { ...contratAtoms.defaultDateFin },
      taux: { ...contratAtoms.defaultTaux },
      tauxMinimal: { ...contratAtoms.defaultTauxMinimal },
      typeSalaire: { ...contratAtoms.defaultSalaireBrut },
      salaireBrut: { ...contratAtoms.defaultTypeSalaire },
    };

    let remunerationsAnnuellesFormValue = {
      11: { ...emptyLineObj },
      12: { ...emptyLineObj },
      21: { ...emptyLineObj },
      22: { ...emptyLineObj },
      31: { ...emptyLineObj },
      32: { ...emptyLineObj },
      41: { ...emptyLineObj },
      42: { ...emptyLineObj },
    };
    const shouldBeLock = !res.draft;
    for (let index = 0; index < res.contrat.remunerationsAnnuelles.length; index++) {
      const remunerationsAnnuelles = res.contrat.remunerationsAnnuelles[index];

      const dateDebut = {
        ...convertValueToDate(remunerationsAnnuelles.dateDebut),
        locked: true,
      };
      const dateFin = {
        ...convertValueToDate(remunerationsAnnuelles.dateFin),
        locked: true,
      };
      const taux = { ...remunerationsAnnuelles.taux, locked: shouldBeLock };
      const tauxMinimal = { ...remunerationsAnnuelles.tauxMinimal, locked: shouldBeLock };
      const typeSalaire = {
        ...convertValueToOption(remunerationsAnnuelles.typeSalaire),
        locked: true,
      };
      const salaireBrut = { ...remunerationsAnnuelles.salaireBrut, locked: true };

      let part = remunerationsAnnuelles.ordre.value.replace(".", "");

      if (part) {
        remunerationsAnnuellesFormValue[part] = {
          dateDebut: { ...dateDebut },
          dateFin: { ...dateFin },
          taux: { ...taux },
          tauxMinimal: { ...tauxMinimal },
          typeSalaire: { ...typeSalaire },
          salaireBrut: { ...salaireBrut },
        };
      }
    }

    setContratRemunerationsAnnuelles(remunerationsAnnuellesFormValue);

    setPartContratCompletion(cerfaContratCompletion(res));
  };

  return {
    completion: partContratCompletion,
    get: {
      contrat: {
        modeContractuel: contratModeContractuel,
        typeContratApp: contratTypeContratApp,
        numeroContratPrecedent: contratNumeroContratPrecedent,
        numeroContratPrecedentDepartement: contratNumeroContratPrecedentDepartement,
        numeroContratPrecedentAnnee: contratNumeroContratPrecedentAnnee,
        numeroContratPrecedentMois: contratNumeroContratPrecedentMois,
        numeroContratPrecedentNc: contratNumeroContratPrecedentNc,
        noContrat: contratNoContrat,
        noAvenant: contratNoAvenant,
        dateDebutContrat: contratDateDebutContrat,
        dureeContrat: contratDureeContrat,
        dateEffetAvenant: contratDateEffetAvenant,
        dateConclusion: contratDateConclusion,
        dateFinContrat: contratDateFinContrat,
        dateRupture: contratDateRupture,
        lieuSignatureContrat: contratLieuSignatureContrat,
        typeDerogation: contratTypeDerogation,
        dureeTravailHebdoHeures: contratDureeTravailHebdoHeures,
        dureeTravailHebdoMinutes: contratDureeTravailHebdoMinutes,
        travailRisque: contratTravailRisque,
        caisseRetraiteComplementaire: contratCaisseRetraiteComplementaire,
        avantageNature: contratAvantageNature,
        avantageNourriture: contratAvantageNourriture,
        avantageLogement: contratAvantageLogement,
        autreAvantageEnNature: contratAutreAvantageEnNature,
        salaireEmbauche: contratSalaireEmbauche,
        smic: contratSmic,
        remunerationsAnnuelles: contratRemunerationsAnnuelles,
      },
    },
    setAll,
    setRemunerations,
    refreshTypeDerogation,
    onSubmit: {
      contrat: {
        modeContractuel: onSubmittedContratModeContractuel,
        typeContratApp: onSubmittedContratTypeContratApp,
        numeroContratPrecedent: onSubmittedContratNumeroContratPrecedent,
        dateDebutContrat: onSubmittedContratDateDebutContrat,
        dateEffetAvenant: onSubmittedContratDateEffetAvenant,
        dateConclusion: onSubmittedContratDateConclusion,
        dateFinContrat: onSubmittedContratDateFinContrat,
        dateRupture: onSubmittedContratDateRupture,
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
        remunerationTaux: onSubmittedContratRemunerationsAnnuellesTaux,
      },
    },
  };
}
