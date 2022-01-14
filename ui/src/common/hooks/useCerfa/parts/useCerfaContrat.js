/***
 * Multiple states on purpose to avoid full re-rendering at each modification
 */

import { useCallback } from "react";
import { DateTime } from "luxon";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  fieldCompletionPercentage,
  convertValueToDate,
  convertDateToValue,
  convertOptionToValue,
  convertValueToOption,
  convertValueToMultipleSelectOption,
  convertMultipleSelectOptionToValue,
  isAgeInValidAtDate,
  caclAgeFromStringDate,
} from "../../../utils/formUtils";
import { saveCerfa } from "../useCerfa";
import { cerfaAtom } from "../cerfaAtom";
import { dossierAtom } from "../../useDossier/dossierAtom";
// import { cerfaApprentiDateNaissanceAtom } from "./useCerfaApprentiAtoms";
import * as contratAtoms from "./useCerfaContratAtoms";

const cerfaContratCompletion = (res) => {
  let fieldsToKeep = {
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
    // contratRemunerationMajoration: res.contrat.remunerationMajoration,
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
    fieldsToKeep = {
      ...fieldsToKeep,
      contratNumeroContratPrecedent: res.contrat.numeroContratPrecedent,
    };
    countFields = countFields + 1;

    if (avenant) {
      fieldsToKeep = {
        ...fieldsToKeep,
        contratDateEffetAvenant: res.contrat.dateEffetAvenant,
      };
      countFields = countFields + 1;
    }
  }

  if (avantageNature) {
    fieldsToKeep = {
      ...fieldsToKeep,
      contratAvantageNourriture: res.contrat.avantageNourriture,
      contratAvantageLogement: res.contrat.avantageLogement,
      contratAutreAvantageEnNature: res.contrat.autreAvantageEnNature,
    };
    countFields = countFields + 3;
  }

  return fieldCompletionPercentage(fieldsToKeep, countFields);
};

export const buildRemunerations = (data) => {
  const dateDebutContrat = DateTime.fromISO(data.dateDebutContrat).setLocale("fr-FR");
  const dateFinContrat = DateTime.fromISO(data.dateFinContrat).setLocale("fr-FR");
  const apprentiDateNaissance = DateTime.fromISO(data.apprentiDateNaissance).setLocale("fr-FR");

  const dateFinA1 = dateDebutContrat.plus({ years: 1 }).minus({ days: 1 });
  const dateDebutA2 = dateDebutContrat.plus({ years: 1 });
  const dateFinA2 = dateDebutA2.plus({ years: 1 }).minus({ days: 1 });
  const dateDebutA3 = dateDebutA2.plus({ years: 1 });
  const dateFinA3 = dateDebutA3.plus({ years: 1 }).minus({ days: 1 });
  const dateDebutA4 = dateDebutA3.plus({ years: 1 });
  // const dateFinA4 = dateDebutA4.plus({ years: 1 }).minus({ days: 1 });

  const ageA1 = Math.floor(data.apprentiAge);
  const anniversaireA1 = apprentiDateNaissance.plus({ years: ageA1 + 1 });
  const ageA2 = ageA1 + 1;
  const anniversaireA2 = anniversaireA1.plus({ years: 1 });
  const ageA3 = ageA2 + 1;
  const anniversaireA3 = anniversaireA2.plus({ years: 1 });
  const ageA4 = ageA3 + 1;
  const anniversaireA4 = anniversaireA3.plus({ years: 1 });
  const ageA5 = ageA4 + 1;

  // console.table([
  //   { date: apprentiDateNaissance.toFormat("yyyy-MM-dd"), age: ageA1 },
  //   { date: anniversaireA1.toFormat("yyyy-MM-dd"), age: ageA2 },
  //   { date: anniversaireA2.toFormat("yyyy-MM-dd"), age: ageA3 },
  //   { date: anniversaireA3.toFormat("yyyy-MM-dd"), age: ageA4 },
  // ]);

  const SMIC = 1603.12; // 10.57/h    (mayotte:  7.98/h)   Pour 35h  => Mayotte 1210.30
  const seuils = [17, 18, 21, 26];
  const getSeuils = (age) => {
    if (age <= seuils[0]) return 0;
    if (age >= seuils[1] && age < seuils[2]) return 1;
    if (age >= seuils[2] && age < seuils[3]) return 2;
    if (age >= seuils[3]) return 3;
  };

  const taux = {
    a1: {
      0: 27,
      1: 43,
      2: 53,
      3: 100,
    },
    a2: {
      0: 39,
      1: 51,
      2: 61,
      3: 100,
    },
    a3: {
      0: 55,
      1: 67,
      2: 78,
      3: 100,
    },
    a4: {
      0: 55,
      1: 67,
      2: 78,
      3: 100,
    },
  };

  const isChangingTaux = (currentAge, nextAge) => {
    return getSeuils(nextAge) > getSeuils(currentAge);
  };

  let finRemuneration = false;

  let result1 = {
    11: {
      dateDebut: "",
      dateFin: "",
      taux: 0,
      typeSalaire: "SMIC",
      salaireBrut: 0,
    },
    12: {
      dateDebut: "",
      dateFin: "",
      taux: 0,
      typeSalaire: "SMIC",
      salaireBrut: 0,
    },
  };
  if (isChangingTaux(ageA1, ageA2)) {
    const dateFin11 = anniversaireA1.minus({ days: anniversaireA1.toObject().day }).plus({ months: 1 });
    const dateDebut12 = dateFin11.plus({ days: 1 });
    const taux11 = taux.a1[getSeuils(ageA1)] + data.remunerationMajoration;
    const taux12 = taux.a1[getSeuils(ageA2)] + data.remunerationMajoration;

    if (dateFin11 >= dateFinContrat) {
      finRemuneration = true;
      result1 = {
        11: {
          dateDebut: dateDebutContrat.toFormat("yyyy-MM-dd"),
          dateFin: dateFinContrat.toFormat("yyyy-MM-dd"),
          taux: taux11,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux11) / 100,
        },
        12: {
          dateDebut: "",
          dateFin: "",
          taux: 0,
          typeSalaire: "SMIC",
          salaireBrut: 0,
        },
      };
    } else if (dateFinA1 >= dateFinContrat) {
      finRemuneration = true;
      result1 = {
        11: {
          dateDebut: dateDebutContrat.toFormat("yyyy-MM-dd"),
          dateFin: dateFin11.toFormat("yyyy-MM-dd"),
          taux: taux11,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux11) / 100,
        },
        12: {
          dateDebut: dateDebut12.toFormat("yyyy-MM-dd"),
          dateFin: dateFinContrat.toFormat("yyyy-MM-dd"),
          taux: taux12,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux12) / 100,
        },
      };
    } else {
      result1 = {
        11: {
          dateDebut: dateDebutContrat.toFormat("yyyy-MM-dd"),
          dateFin: dateFin11.toFormat("yyyy-MM-dd"),
          taux: taux11,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux11) / 100,
        },
        12: {
          dateDebut: dateDebut12.toFormat("yyyy-MM-dd"),
          dateFin: dateFinA1.toFormat("yyyy-MM-dd"),
          taux: taux12,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux12) / 100,
        },
      };
    }
  } else {
    const taux11 = taux.a1[getSeuils(ageA1)] + data.remunerationMajoration;
    if (dateFinA1 >= dateFinContrat) {
      finRemuneration = true;
      result1 = {
        11: {
          dateDebut: dateDebutContrat.toFormat("yyyy-MM-dd"),
          dateFin: dateFinContrat.toFormat("yyyy-MM-dd"),
          taux: taux11,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux11) / 100,
        },
        12: {
          dateDebut: "",
          dateFin: "",
          taux: 0,
          typeSalaire: "SMIC",
          salaireBrut: 0,
        },
      };
    } else {
      result1 = {
        11: {
          dateDebut: dateDebutContrat.toFormat("yyyy-MM-dd"),
          dateFin: dateFinA1.toFormat("yyyy-MM-dd"),
          taux: taux11,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux11) / 100,
        },
        12: {
          dateDebut: "",
          dateFin: "",
          taux: 0,
          typeSalaire: "SMIC",
          salaireBrut: 0,
        },
      };
    }
  }

  let result2 = {
    21: {
      dateDebut: "",
      dateFin: "",
      taux: 0,
      typeSalaire: "SMIC",
      salaireBrut: 0,
    },
    22: {
      dateDebut: "",
      dateFin: "",
      taux: 0,
      typeSalaire: "SMIC",
      salaireBrut: 0,
    },
  };
  if (isChangingTaux(ageA2, ageA3) && !finRemuneration) {
    const dateFin21 = anniversaireA2.minus({ days: anniversaireA2.toObject().day }).plus({ months: 1 });
    const dateDebut22 = dateFin21.plus({ days: 1 });
    const taux21 = taux.a2[getSeuils(ageA2)] + data.remunerationMajoration;
    const taux22 = taux.a2[getSeuils(ageA3)] + data.remunerationMajoration;

    if (dateFin21 >= dateFinContrat) {
      finRemuneration = true;
      result2 = {
        21: {
          dateDebut: dateDebutA2.toFormat("yyyy-MM-dd"),
          dateFin: dateFinContrat.toFormat("yyyy-MM-dd"),
          taux: taux21,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux21) / 100,
        },
        22: {
          dateDebut: "",
          dateFin: "",
          taux: 0,
          typeSalaire: "SMIC",
          salaireBrut: 0,
        },
      };
    } else if (dateFinA2 >= dateFinContrat) {
      finRemuneration = true;
      result2 = {
        21: {
          dateDebut: dateDebutA2.toFormat("yyyy-MM-dd"),
          dateFin: dateFin21.toFormat("yyyy-MM-dd"),
          taux: taux21,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux21) / 100,
        },
        22: {
          dateDebut: dateDebut22.toFormat("yyyy-MM-dd"),
          dateFin: dateFinContrat.toFormat("yyyy-MM-dd"),
          taux: taux22,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux22) / 100,
        },
      };
    } else {
      result2 = {
        21: {
          dateDebut: dateDebutA2.toFormat("yyyy-MM-dd"),
          dateFin: dateFin21.toFormat("yyyy-MM-dd"),
          taux: taux21,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux21) / 100,
        },
        22: {
          dateDebut: dateDebut22.toFormat("yyyy-MM-dd"),
          dateFin: dateFinA2.toFormat("yyyy-MM-dd"),
          taux: taux22,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux22) / 100,
        },
      };
    }
  } else if (!finRemuneration) {
    const taux21 = taux.a2[getSeuils(ageA2)] + data.remunerationMajoration;

    if (dateFinA2 >= dateFinContrat) {
      finRemuneration = true;
      result2 = {
        21: {
          dateDebut: dateDebutA2.toFormat("yyyy-MM-dd"),
          dateFin: dateFinContrat.toFormat("yyyy-MM-dd"),
          taux: taux21,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux21) / 100,
        },
        22: {
          dateDebut: "",
          dateFin: "",
          taux: 0,
          typeSalaire: "SMIC",
          salaireBrut: 0,
        },
      };
    } else {
      result2 = {
        21: {
          dateDebut: dateDebutA2.toFormat("yyyy-MM-dd"),
          dateFin: dateFinA2.toFormat("yyyy-MM-dd"),
          taux: taux21,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux21) / 100,
        },
        22: {
          dateDebut: "",
          dateFin: "",
          taux: 0,
          typeSalaire: "SMIC",
          salaireBrut: 0,
        },
      };
    }
  }

  let result3 = {
    31: {
      dateDebut: "",
      dateFin: "",
      taux: 0,
      typeSalaire: "SMIC",
      salaireBrut: 0,
    },
    32: {
      dateDebut: "",
      dateFin: "",
      taux: 0,
      typeSalaire: "SMIC",
      salaireBrut: 0,
    },
  };
  if (isChangingTaux(ageA3, ageA4) && !finRemuneration) {
    const dateFin31 = anniversaireA3.minus({ days: anniversaireA3.toObject().day }).plus({ months: 1 });
    const dateDebut32 = dateFin31.plus({ days: 1 });
    const taux31 = taux.a3[getSeuils(ageA3)] + data.remunerationMajoration;
    const taux32 = taux.a3[getSeuils(ageA4)] + data.remunerationMajoration;

    if (dateFin31 >= dateFinContrat) {
      finRemuneration = true;
      result3 = {
        31: {
          dateDebut: dateDebutA3.toFormat("yyyy-MM-dd"),
          dateFin: dateFinContrat.toFormat("yyyy-MM-dd"),
          taux: taux31,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux31) / 100,
        },
        32: {
          dateDebut: "",
          dateFin: "",
          taux: 0,
          typeSalaire: "SMIC",
          salaireBrut: 0,
        },
      };
    } else if (dateFinA3 >= dateFinContrat) {
      finRemuneration = true;
      result3 = {
        31: {
          dateDebut: dateDebutA3.toFormat("yyyy-MM-dd"),
          dateFin: dateFin31.toFormat("yyyy-MM-dd"),
          taux: taux31,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux31) / 100,
        },
        32: {
          dateDebut: dateDebut32.toFormat("yyyy-MM-dd"),
          dateFin: dateFinContrat.toFormat("yyyy-MM-dd"),
          taux: taux32,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux32) / 100,
        },
      };
    } else {
      result3 = {
        31: {
          dateDebut: dateDebutA3.toFormat("yyyy-MM-dd"),
          dateFin: dateFin31.toFormat("yyyy-MM-dd"),
          taux: taux31,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux31) / 100,
        },
        32: {
          dateDebut: dateDebut32.toFormat("yyyy-MM-dd"),
          dateFin: dateFinA3.toFormat("yyyy-MM-dd"),
          taux: taux32,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux32) / 100,
        },
      };
    }
  } else if (!finRemuneration) {
    const taux31 = taux.a3[getSeuils(ageA3)] + data.remunerationMajoration;

    if (dateFinA3 >= dateFinContrat) {
      finRemuneration = true;
      result3 = {
        31: {
          dateDebut: dateDebutA3.toFormat("yyyy-MM-dd"),
          dateFin: dateFinContrat.toFormat("yyyy-MM-dd"),
          taux: taux31,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux31) / 100,
        },
        32: {
          dateDebut: "",
          dateFin: "",
          taux: 0,
          typeSalaire: "SMIC",
          salaireBrut: 0,
        },
      };
    } else {
      result3 = {
        31: {
          dateDebut: dateDebutA3.toFormat("yyyy-MM-dd"),
          dateFin: dateFinA3.toFormat("yyyy-MM-dd"),
          taux: taux31,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux31) / 100,
        },
        32: {
          dateDebut: "",
          dateFin: "",
          taux: 0,
          typeSalaire: "SMIC",
          salaireBrut: 0,
        },
      };
    }
  }

  let result4 = {
    41: {
      dateDebut: "",
      dateFin: "",
      taux: 0,
      typeSalaire: "SMIC",
      salaireBrut: 0,
    },
    42: {
      dateDebut: "",
      dateFin: "",
      taux: 0,
      typeSalaire: "SMIC",
      salaireBrut: 0,
    },
  };
  if (isChangingTaux(ageA4, ageA5) && !finRemuneration) {
    const dateFin41 = anniversaireA4.minus({ days: anniversaireA4.toObject().day }).plus({ months: 1 });
    const dateDebut42 = dateFin41.plus({ days: 1 });
    const taux41 = taux.a4[getSeuils(ageA4)] + data.remunerationMajoration;
    const taux42 = taux.a4[getSeuils(ageA5)] + data.remunerationMajoration;

    if (dateFin41 >= dateFinContrat) {
      finRemuneration = true;
      result4 = {
        41: {
          dateDebut: dateDebutA4.toFormat("yyyy-MM-dd"),
          dateFin: dateFinContrat.toFormat("yyyy-MM-dd"),
          taux: taux41,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux41) / 100,
        },
        42: {
          dateDebut: "",
          dateFin: "",
          taux: 0,
          typeSalaire: "SMIC",
          salaireBrut: 0,
        },
      };
    } else {
      result4 = {
        41: {
          dateDebut: dateDebutA4.toFormat("yyyy-MM-dd"),
          dateFin: dateFin41.toFormat("yyyy-MM-dd"),
          taux: taux41,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux41) / 100,
        },
        42: {
          dateDebut: dateDebut42.toFormat("yyyy-MM-dd"),
          dateFin: dateFinContrat.toFormat("yyyy-MM-dd"),
          taux: taux42,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux42) / 100,
        },
      };
    }
  } else if (!finRemuneration) {
    const taux41 = taux.a4[getSeuils(ageA4)] + data.remunerationMajoration;
    result4 = {
      41: {
        dateDebut: dateDebutA4.toFormat("yyyy-MM-dd"),
        dateFin: dateFinContrat.toFormat("yyyy-MM-dd"),
        taux: taux41,
        typeSalaire: "SMIC",
        salaireBrut: (SMIC * taux41) / 100,
      },
      42: {
        dateDebut: "",
        dateFin: "",
        taux: 0,
        typeSalaire: "SMIC",
        salaireBrut: 0,
      },
    };
  }

  const remunerationsAnnuelles = {
    ...result1,
    ...result2,
    ...result3,
    ...result4,
  };

  const remunerationsAnnuellesDbValue = [];
  const remKeys = Object.keys(remunerationsAnnuelles);
  for (let index = 0; index < remKeys.length; index++) {
    const remKey = remKeys[index];
    const remPart = remunerationsAnnuelles[remKey];
    if (remPart.taux > 0) {
      remunerationsAnnuellesDbValue.push({
        dateDebut: DateTime.fromISO(remPart.dateDebut).setLocale("fr-FR").ts,
        dateFin: DateTime.fromISO(remPart.dateFin).setLocale("fr-FR").ts,
        taux: remPart.taux,
        typeSalaire: remPart.typeSalaire,
        salaireBrut: remPart.salaireBrut.toFixed(2),
        ordre: `${remKey[0]}.${remKey[1]}`,
      });
    }
  }

  return {
    remunerationsAnnuelles,
    remunerationsAnnuellesDbValue,
    salaireEmbauche: remunerationsAnnuelles["11"].salaireBrut,
  };
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

          const today = DateTime.now().setLocale("fr-FR");
          if (dateDebutContrat <= today) {
            return {
              successed: false,
              data: null,
              message: "Date de début de contrat ne peut pas être antérieure à aujourd'hui",
            };
          }

          if (data.dateEffetAvenant) {
            const dateEffetAvenant = DateTime.fromISO(data.dateEffetAvenant).setLocale("fr-FR");
            if (dateDebutContrat >= dateEffetAvenant) {
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

          if (data.apprentiDateNaissance !== "") {
            const isAgeApprentiInvalidAtStart = isAgeInValidAtDate({
              dateNaissance: DateTime.fromISO(data.apprentiDateNaissance).setLocale("fr-FR"),
              age: data.apprentiAge,
              dateString: value,
              limitAge: 15,
              label: "L'apprenti(e) doit avoir au moins 15 ans à la date de début d'exécution du contrat",
            });
            if (isAgeApprentiInvalidAtStart) return isAgeApprentiInvalidAtStart;
          }

          if (data.maitre1DateNaissance !== "") {
            const { age: ageMaitre1, dateNaissance: dateNaissanceMaitre1 } = caclAgeFromStringDate(
              data.maitre1DateNaissance
            );
            const isAgeMaitre1InvalidAtStart = isAgeInValidAtDate({
              dateNaissance: dateNaissanceMaitre1,
              age: ageMaitre1,
              dateString: value,
              limitAge: 18,
              label: "Le maître d'apprentissage 1 doit avoir au moins 18 ans à la date de début d'exécution du contrat",
            });
            if (isAgeMaitre1InvalidAtStart) return isAgeMaitre1InvalidAtStart;
          }

          if (data.maitre2DateNaissance !== "") {
            const { age: ageMaitre2, dateNaissance: dateNaissanceMaitre2 } = caclAgeFromStringDate(
              data.maitre2DateNaissance
            );
            const isAgeMaitre2InvalidAtStart = isAgeInValidAtDate({
              dateNaissance: dateNaissanceMaitre2,
              age: ageMaitre2,
              dateString: value,
              limitAge: 18,
              label: "Le maître d'apprentissage 2 doit avoir au moins 18 ans à la date de début d'exécution du contrat",
            });
            if (isAgeMaitre2InvalidAtStart) return isAgeMaitre2InvalidAtStart;
          }

          if (data.apprentiDateNaissance !== "" && data.dateFinContrat !== "") {
            const { remunerationsAnnuelles, salaireEmbauche, remunerationsAnnuellesDbValue } = buildRemunerations({
              ...data,
              dateDebutContrat: value,
            });

            return {
              successed: true,
              data: {
                dateDebutContrat: value,
                remunerationsAnnuelles,
                remunerationsAnnuellesDbValue,
                salaireEmbauche,
                dureeContrat,
              },
              message: null,
            };
          }

          return {
            successed: true,
            data: {
              dateDebutContrat: value,
              dureeContrat,
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

          if (data.apprentiDateNaissance !== "" && data.dateDebutContrat !== "") {
            const { remunerationsAnnuelles, salaireEmbauche, remunerationsAnnuellesDbValue } = buildRemunerations({
              ...data,
              dateFinContrat: value,
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
      remunerationMajoration: {
        doAsyncActions: async (value, data) => {
          await new Promise((resolve) => setTimeout(resolve, 100));

          if (data.apprentiDateNaissance !== "" && data.dateFinContrat !== "") {
            const { remunerationsAnnuelles, salaireEmbauche, remunerationsAnnuellesDbValue } = buildRemunerations({
              ...data,
              remunerationMajoration: convertOptionToValue({ ...data.remunerationMajoration, value: value }),
            });

            return {
              successed: true,
              data: {
                remunerationMajoration: value,
                remunerationsAnnuelles,
                remunerationsAnnuellesDbValue,
                salaireEmbauche,
              },
              message: null,
            };
          }

          return {
            successed: true,
            data: {
              remunerationMajoration: value,
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
  // const [apprentiDateNaissance, setApprentiDateNaissance] = useRecoilState(cerfaApprentiDateNaissanceAtom);

  //Internal
  const [partContratCompletion, setPartContratCompletion] = useRecoilState(contratAtoms.cerfaPartContratCompletionAtom);

  const [contratModeContractuel, setContratModeContractuel] = useRecoilState(
    contratAtoms.cerfaContratModeContractuelAtom
  );
  const [contratTypeContratApp, setContratTypeContratApp] = useRecoilState(contratAtoms.cerfaContratTypeContratAppAtom);
  const [contratNumeroContratPrecedent, setContratNumeroContratPrecedent] = useRecoilState(
    contratAtoms.cerfaContratNumeroContratPrecedentAtom
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
  const [contratSalaireEmbauche, setContratSalaireEmbauche] = useRecoilState(
    contratAtoms.cerfaContratSalaireEmbaucheAtom
  );
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

  const [contratRemunerationMajoration, setContratRemunerationMajoration] = useRecoilState(
    contratAtoms.cerfaContratRemunerationMajorationAtom
  );
  const [contratRemunerationsAnnuelles11DateDebut, setContratRemunerationsAnnuelles11DateDebut] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles11DateDebutAtom
  );
  const [contratRemunerationsAnnuelles11DateFin, setContratRemunerationsAnnuelles11DateFin] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles11DateFinAtom
  );
  const [contratRemunerationsAnnuelles11Taux, setContratRemunerationsAnnuelles11Taux] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles11TauxAtom
  );
  const [contratRemunerationsAnnuelles11TypeSalaire, setContratRemunerationsAnnuelles11TypeSalaire] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles11TypeSalaireAtom
  );
  const [contratRemunerationsAnnuelles11SalaireBrut, setContratRemunerationsAnnuelles11SalaireBrut] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles11SalaireBrutAtom
  );

  const [contratRemunerationsAnnuelles12DateDebut, setContratRemunerationsAnnuelles12DateDebut] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles12DateDebutAtom
  );
  const [contratRemunerationsAnnuelles12DateFin, setContratRemunerationsAnnuelles12DateFin] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles12DateFinAtom
  );
  const [contratRemunerationsAnnuelles12Taux, setContratRemunerationsAnnuelles12Taux] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles12TauxAtom
  );
  const [contratRemunerationsAnnuelles12TypeSalaire, setContratRemunerationsAnnuelles12TypeSalaire] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles12TypeSalaireAtom
  );
  const [contratRemunerationsAnnuelles12SalaireBrut, setContratRemunerationsAnnuelles12SalaireBrut] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles12SalaireBrutAtom
  );
  const [contratRemunerationsAnnuelles21DateDebut, setContratRemunerationsAnnuelles21DateDebut] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles21DateDebutAtom
  );
  const [contratRemunerationsAnnuelles21DateFin, setContratRemunerationsAnnuelles21DateFin] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles21DateFinAtom
  );
  const [contratRemunerationsAnnuelles21Taux, setContratRemunerationsAnnuelles21Taux] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles21TauxAtom
  );
  const [contratRemunerationsAnnuelles21TypeSalaire, setContratRemunerationsAnnuelles21TypeSalaire] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles21TypeSalaireAtom
  );
  const [contratRemunerationsAnnuelles21SalaireBrut, setContratRemunerationsAnnuelles21SalaireBrut] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles21SalaireBrutAtom
  );
  const [contratRemunerationsAnnuelles22DateDebut, setContratRemunerationsAnnuelles22DateDebut] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles22DateDebutAtom
  );
  const [contratRemunerationsAnnuelles22DateFin, setContratRemunerationsAnnuelles22DateFin] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles22DateFinAtom
  );
  const [contratRemunerationsAnnuelles22Taux, setContratRemunerationsAnnuelles22Taux] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles22TauxAtom
  );
  const [contratRemunerationsAnnuelles22TypeSalaire, setContratRemunerationsAnnuelles22TypeSalaire] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles22TypeSalaireAtom
  );
  const [contratRemunerationsAnnuelles22SalaireBrut, setContratRemunerationsAnnuelles22SalaireBrut] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles22SalaireBrutAtom
  );
  const [contratRemunerationsAnnuelles31DateDebut, setContratRemunerationsAnnuelles31DateDebut] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles31DateDebutAtom
  );
  const [contratRemunerationsAnnuelles31DateFin, setContratRemunerationsAnnuelles31DateFin] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles31DateFinAtom
  );
  const [contratRemunerationsAnnuelles31Taux, setContratRemunerationsAnnuelles31Taux] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles31TauxAtom
  );
  const [contratRemunerationsAnnuelles31TypeSalaire, setContratRemunerationsAnnuelles31TypeSalaire] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles31TypeSalaireAtom
  );
  const [contratRemunerationsAnnuelles31SalaireBrut, setContratRemunerationsAnnuelles31SalaireBrut] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles31SalaireBrutAtom
  );
  const [contratRemunerationsAnnuelles32DateDebut, setContratRemunerationsAnnuelles32DateDebut] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles32DateDebutAtom
  );
  const [contratRemunerationsAnnuelles32DateFin, setContratRemunerationsAnnuelles32DateFin] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles32DateFinAtom
  );
  const [contratRemunerationsAnnuelles32Taux, setContratRemunerationsAnnuelles32Taux] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles32TauxAtom
  );
  const [contratRemunerationsAnnuelles32TypeSalaire, setContratRemunerationsAnnuelles32TypeSalaire] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles32TypeSalaireAtom
  );
  const [contratRemunerationsAnnuelles32SalaireBrut, setContratRemunerationsAnnuelles32SalaireBrut] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles32SalaireBrutAtom
  );
  const [contratRemunerationsAnnuelles41DateDebut, setContratRemunerationsAnnuelles41DateDebut] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles41DateDebutAtom
  );
  const [contratRemunerationsAnnuelles41DateFin, setContratRemunerationsAnnuelles41DateFin] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles41DateFinAtom
  );
  const [contratRemunerationsAnnuelles41Taux, setContratRemunerationsAnnuelles41Taux] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles41TauxAtom
  );
  const [contratRemunerationsAnnuelles41TypeSalaire, setContratRemunerationsAnnuelles41TypeSalaire] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles41TypeSalaireAtom
  );
  const [contratRemunerationsAnnuelles41SalaireBrut, setContratRemunerationsAnnuelles41SalaireBrut] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles41SalaireBrutAtom
  );
  const [contratRemunerationsAnnuelles42DateDebut, setContratRemunerationsAnnuelles42DateDebut] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles42DateDebutAtom
  );
  const [contratRemunerationsAnnuelles42DateFin, setContratRemunerationsAnnuelles42DateFin] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles42DateFinAtom
  );
  const [contratRemunerationsAnnuelles42Taux, setContratRemunerationsAnnuelles42Taux] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles42TauxAtom
  );
  const [contratRemunerationsAnnuelles42TypeSalaire, setContratRemunerationsAnnuelles42TypeSalaire] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles42TypeSalaireAtom
  );
  const [contratRemunerationsAnnuelles42SalaireBrut, setContratRemunerationsAnnuelles42SalaireBrut] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles42SalaireBrutAtom
  );

  const setRemunerations = useCallback(
    async (data) => {
      setContratSalaireEmbauche({
        ...contratSalaireEmbauche,
        value: data.salaireEmbauche.toFixed(2),
      });

      setContratRemunerationsAnnuelles11DateDebut({
        ...contratRemunerationsAnnuelles11DateDebut,
        value: data.remunerationsAnnuelles["11"].dateDebut,
      });
      setContratRemunerationsAnnuelles11DateFin({
        ...contratRemunerationsAnnuelles11DateFin,
        value: data.remunerationsAnnuelles["11"].dateFin,
      });
      setContratRemunerationsAnnuelles11Taux({
        ...contratRemunerationsAnnuelles11Taux,
        value: data.remunerationsAnnuelles["11"].taux,
      });
      setContratRemunerationsAnnuelles11TypeSalaire({
        ...contratRemunerationsAnnuelles11TypeSalaire,
        value: data.remunerationsAnnuelles["11"].typeSalaire,
      });
      setContratRemunerationsAnnuelles11SalaireBrut({
        ...contratRemunerationsAnnuelles11SalaireBrut,
        value: data.remunerationsAnnuelles["11"].salaireBrut.toFixed(2),
      });

      setContratRemunerationsAnnuelles12DateDebut({
        ...contratRemunerationsAnnuelles12DateDebut,
        value: data.remunerationsAnnuelles["12"].dateDebut,
      });
      setContratRemunerationsAnnuelles12DateFin({
        ...contratRemunerationsAnnuelles12DateFin,
        value: data.remunerationsAnnuelles["12"].dateFin,
      });
      setContratRemunerationsAnnuelles12Taux({
        ...contratRemunerationsAnnuelles12Taux,
        value: data.remunerationsAnnuelles["12"].taux,
      });
      setContratRemunerationsAnnuelles12TypeSalaire({
        ...contratRemunerationsAnnuelles12TypeSalaire,
        value: data.remunerationsAnnuelles["12"].typeSalaire,
      });
      setContratRemunerationsAnnuelles12SalaireBrut({
        ...contratRemunerationsAnnuelles12SalaireBrut,
        value: data.remunerationsAnnuelles["12"].salaireBrut.toFixed(2),
      });

      setContratRemunerationsAnnuelles21DateDebut({
        ...contratRemunerationsAnnuelles21DateDebut,
        value: data.remunerationsAnnuelles["21"].dateDebut,
      });
      setContratRemunerationsAnnuelles21DateFin({
        ...contratRemunerationsAnnuelles21DateFin,
        value: data.remunerationsAnnuelles["21"].dateFin,
      });
      setContratRemunerationsAnnuelles21Taux({
        ...contratRemunerationsAnnuelles21Taux,
        value: data.remunerationsAnnuelles["21"].taux,
      });
      setContratRemunerationsAnnuelles21TypeSalaire({
        ...contratRemunerationsAnnuelles21TypeSalaire,
        value: data.remunerationsAnnuelles["21"].typeSalaire,
      });
      setContratRemunerationsAnnuelles21SalaireBrut({
        ...contratRemunerationsAnnuelles21SalaireBrut,
        value: data.remunerationsAnnuelles["21"].salaireBrut.toFixed(2),
      });

      setContratRemunerationsAnnuelles22DateDebut({
        ...contratRemunerationsAnnuelles22DateDebut,
        value: data.remunerationsAnnuelles["22"].dateDebut,
      });
      setContratRemunerationsAnnuelles22DateFin({
        ...contratRemunerationsAnnuelles22DateFin,
        value: data.remunerationsAnnuelles["22"].dateFin,
      });
      setContratRemunerationsAnnuelles22Taux({
        ...contratRemunerationsAnnuelles22Taux,
        value: data.remunerationsAnnuelles["22"].taux,
      });
      setContratRemunerationsAnnuelles22TypeSalaire({
        ...contratRemunerationsAnnuelles22TypeSalaire,
        value: data.remunerationsAnnuelles["22"].typeSalaire,
      });
      setContratRemunerationsAnnuelles22SalaireBrut({
        ...contratRemunerationsAnnuelles22SalaireBrut,
        value: data.remunerationsAnnuelles["22"].salaireBrut.toFixed(2),
      });

      setContratRemunerationsAnnuelles31DateDebut({
        ...contratRemunerationsAnnuelles31DateDebut,
        value: data.remunerationsAnnuelles["31"].dateDebut,
      });
      setContratRemunerationsAnnuelles31DateFin({
        ...contratRemunerationsAnnuelles31DateFin,
        value: data.remunerationsAnnuelles["31"].dateFin,
      });
      setContratRemunerationsAnnuelles31Taux({
        ...contratRemunerationsAnnuelles31Taux,
        value: data.remunerationsAnnuelles["31"].taux,
      });
      setContratRemunerationsAnnuelles31TypeSalaire({
        ...contratRemunerationsAnnuelles31TypeSalaire,
        value: data.remunerationsAnnuelles["31"].typeSalaire,
      });
      setContratRemunerationsAnnuelles31SalaireBrut({
        ...contratRemunerationsAnnuelles31SalaireBrut,
        value: data.remunerationsAnnuelles["31"].salaireBrut.toFixed(2),
      });

      setContratRemunerationsAnnuelles32DateDebut({
        ...contratRemunerationsAnnuelles32DateDebut,
        value: data.remunerationsAnnuelles["32"].dateDebut,
      });
      setContratRemunerationsAnnuelles32DateFin({
        ...contratRemunerationsAnnuelles32DateFin,
        value: data.remunerationsAnnuelles["32"].dateFin,
      });
      setContratRemunerationsAnnuelles32Taux({
        ...contratRemunerationsAnnuelles32Taux,
        value: data.remunerationsAnnuelles["32"].taux,
      });
      setContratRemunerationsAnnuelles32TypeSalaire({
        ...contratRemunerationsAnnuelles32TypeSalaire,
        value: data.remunerationsAnnuelles["32"].typeSalaire,
      });
      setContratRemunerationsAnnuelles32SalaireBrut({
        ...contratRemunerationsAnnuelles32SalaireBrut,
        value: data.remunerationsAnnuelles["32"].salaireBrut.toFixed(2),
      });

      setContratRemunerationsAnnuelles41DateDebut({
        ...contratRemunerationsAnnuelles41DateDebut,
        value: data.remunerationsAnnuelles["41"].dateDebut,
      });
      setContratRemunerationsAnnuelles41DateFin({
        ...contratRemunerationsAnnuelles41DateFin,
        value: data.remunerationsAnnuelles["41"].dateFin,
      });
      setContratRemunerationsAnnuelles41Taux({
        ...contratRemunerationsAnnuelles41Taux,
        value: data.remunerationsAnnuelles["41"].taux,
      });
      setContratRemunerationsAnnuelles41TypeSalaire({
        ...contratRemunerationsAnnuelles41TypeSalaire,
        value: data.remunerationsAnnuelles["41"].typeSalaire,
      });
      setContratRemunerationsAnnuelles41SalaireBrut({
        ...contratRemunerationsAnnuelles41SalaireBrut,
        value: data.remunerationsAnnuelles["41"].salaireBrut.toFixed(2),
      });

      setContratRemunerationsAnnuelles42DateDebut({
        ...contratRemunerationsAnnuelles42DateDebut,
        value: data.remunerationsAnnuelles["42"].dateDebut,
      });
      setContratRemunerationsAnnuelles42DateFin({
        ...contratRemunerationsAnnuelles42DateFin,
        value: data.remunerationsAnnuelles["42"].dateFin,
      });
      setContratRemunerationsAnnuelles42Taux({
        ...contratRemunerationsAnnuelles42Taux,
        value: data.remunerationsAnnuelles["42"].taux,
      });
      setContratRemunerationsAnnuelles42TypeSalaire({
        ...contratRemunerationsAnnuelles42TypeSalaire,
        value: data.remunerationsAnnuelles["42"].typeSalaire,
      });
      setContratRemunerationsAnnuelles42SalaireBrut({
        ...contratRemunerationsAnnuelles42SalaireBrut,
        value: data.remunerationsAnnuelles["42"].salaireBrut.toFixed(2),
      });
    },
    [
      contratRemunerationsAnnuelles11DateDebut,
      contratRemunerationsAnnuelles11DateFin,
      contratRemunerationsAnnuelles11SalaireBrut,
      contratRemunerationsAnnuelles11Taux,
      contratRemunerationsAnnuelles11TypeSalaire,
      contratRemunerationsAnnuelles12DateDebut,
      contratRemunerationsAnnuelles12DateFin,
      contratRemunerationsAnnuelles12SalaireBrut,
      contratRemunerationsAnnuelles12Taux,
      contratRemunerationsAnnuelles12TypeSalaire,
      contratRemunerationsAnnuelles21DateDebut,
      contratRemunerationsAnnuelles21DateFin,
      contratRemunerationsAnnuelles21SalaireBrut,
      contratRemunerationsAnnuelles21Taux,
      contratRemunerationsAnnuelles21TypeSalaire,
      contratRemunerationsAnnuelles22DateDebut,
      contratRemunerationsAnnuelles22DateFin,
      contratRemunerationsAnnuelles22SalaireBrut,
      contratRemunerationsAnnuelles22Taux,
      contratRemunerationsAnnuelles22TypeSalaire,
      contratRemunerationsAnnuelles31DateDebut,
      contratRemunerationsAnnuelles31DateFin,
      contratRemunerationsAnnuelles31SalaireBrut,
      contratRemunerationsAnnuelles31Taux,
      contratRemunerationsAnnuelles31TypeSalaire,
      contratRemunerationsAnnuelles32DateDebut,
      contratRemunerationsAnnuelles32DateFin,
      contratRemunerationsAnnuelles32SalaireBrut,
      contratRemunerationsAnnuelles32Taux,
      contratRemunerationsAnnuelles32TypeSalaire,
      contratRemunerationsAnnuelles41DateDebut,
      contratRemunerationsAnnuelles41DateFin,
      contratRemunerationsAnnuelles41SalaireBrut,
      contratRemunerationsAnnuelles41Taux,
      contratRemunerationsAnnuelles41TypeSalaire,
      contratRemunerationsAnnuelles42DateDebut,
      contratRemunerationsAnnuelles42DateFin,
      contratRemunerationsAnnuelles42SalaireBrut,
      contratRemunerationsAnnuelles42Taux,
      contratRemunerationsAnnuelles42TypeSalaire,
      contratSalaireEmbauche,
      setContratRemunerationsAnnuelles11DateDebut,
      setContratRemunerationsAnnuelles11DateFin,
      setContratRemunerationsAnnuelles11SalaireBrut,
      setContratRemunerationsAnnuelles11Taux,
      setContratRemunerationsAnnuelles11TypeSalaire,
      setContratRemunerationsAnnuelles12DateDebut,
      setContratRemunerationsAnnuelles12DateFin,
      setContratRemunerationsAnnuelles12SalaireBrut,
      setContratRemunerationsAnnuelles12Taux,
      setContratRemunerationsAnnuelles12TypeSalaire,
      setContratRemunerationsAnnuelles21DateDebut,
      setContratRemunerationsAnnuelles21DateFin,
      setContratRemunerationsAnnuelles21SalaireBrut,
      setContratRemunerationsAnnuelles21Taux,
      setContratRemunerationsAnnuelles21TypeSalaire,
      setContratRemunerationsAnnuelles22DateDebut,
      setContratRemunerationsAnnuelles22DateFin,
      setContratRemunerationsAnnuelles22SalaireBrut,
      setContratRemunerationsAnnuelles22Taux,
      setContratRemunerationsAnnuelles22TypeSalaire,
      setContratRemunerationsAnnuelles31DateDebut,
      setContratRemunerationsAnnuelles31DateFin,
      setContratRemunerationsAnnuelles31SalaireBrut,
      setContratRemunerationsAnnuelles31Taux,
      setContratRemunerationsAnnuelles31TypeSalaire,
      setContratRemunerationsAnnuelles32DateDebut,
      setContratRemunerationsAnnuelles32DateFin,
      setContratRemunerationsAnnuelles32SalaireBrut,
      setContratRemunerationsAnnuelles32Taux,
      setContratRemunerationsAnnuelles32TypeSalaire,
      setContratRemunerationsAnnuelles41DateDebut,
      setContratRemunerationsAnnuelles41DateFin,
      setContratRemunerationsAnnuelles41SalaireBrut,
      setContratRemunerationsAnnuelles41Taux,
      setContratRemunerationsAnnuelles41TypeSalaire,
      setContratRemunerationsAnnuelles42DateDebut,
      setContratRemunerationsAnnuelles42DateFin,
      setContratRemunerationsAnnuelles42SalaireBrut,
      setContratRemunerationsAnnuelles42Taux,
      setContratRemunerationsAnnuelles42TypeSalaire,
      setContratSalaireEmbauche,
    ]
  );

  const onSubmittedContratDateDebutContrat = useCallback(
    async (path, data) => {
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
          };
          if (contratDateDebutContrat.value !== newV.contrat.dateDebutContrat.value) {
            // setContratDateFinContrat({ ...contratDateFinContrat, value: "" });

            setContratDateDebutContrat(newV.contrat.dateDebutContrat);

            seContratDureeContrat(newV.contrat.dureeContrat);

            let dataToSave = {
              contrat: {
                dateDebutContrat: convertDateToValue(newV.contrat.dateDebutContrat),
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
                },
              };
            }

            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
            setPartContratCompletion(cerfaContratCompletion(res));

            // if (res.contrat.dateFinContrat === "") {
            //   // TODO if there is a value in DB AND live change has been made, the live value will be replace by db value
            //   setContratDateFinContrat({ ...contratDateFinContrat, triggerValidation: true });
            // }
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      contratDateDebutContrat,
      contratDureeContrat,
      setContratDateDebutContrat,
      seContratDureeContrat,
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
    async (path, data) => {
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
          if (contratDateFinContrat.value !== newV.contrat.dateFinContrat.value) {
            // setContratDateDebutContrat({ ...contratDateDebutContrat, value: "" });

            setContratDateFinContrat(newV.contrat.dateFinContrat);
            seContratDureeContrat(newV.contrat.dureeContrat);

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
                },
              };
            }

            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
            setPartContratCompletion(cerfaContratCompletion(res));

            // if (res.contrat.dateDebutContrat === "") {
            //   // TODO if there is a value in DB AND live change has been made, the live value will be replace by db value
            //   setContratDateDebutContrat({ ...contratDateDebutContrat, triggerValidation: true });
            // }
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      contratDateFinContrat,
      contratDureeContrat,
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
                value: data,
              },
            },
          };
          if (contratDureeTravailHebdoHeures.value !== newV.contrat.dureeTravailHebdoHeures.value) {
            setContratDureeTravailHebdoHeures(newV.contrat.dureeTravailHebdoHeures);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                dureeTravailHebdoHeures: data && parseInt(data) !== 0 ? data : null,
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
                value: data,
              },
            },
          };
          if (contratDureeTravailHebdoMinutes.value !== newV.contrat.dureeTravailHebdoMinutes.value) {
            setContratDureeTravailHebdoMinutes(newV.contrat.dureeTravailHebdoMinutes);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                dureeTravailHebdoMinutes: data && parseInt(data) !== 0 ? data : null,
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

  const onSubmittedContratLieuSignatureContrat = useCallback(
    async (path, data) => {
      try {
        if (path === "contrat.lieuSignatureContrat") {
          const newV = {
            contrat: {
              lieuSignatureContrat: {
                ...contratLieuSignatureContrat,
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (contratLieuSignatureContrat.value !== newV.contrat.lieuSignatureContrat.value) {
            setContratLieuSignatureContrat(newV.contrat.lieuSignatureContrat);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                lieuSignatureContrat: newV.contrat.lieuSignatureContrat.value,
              },
            });
            setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [contratLieuSignatureContrat, setContratLieuSignatureContrat, dossier?._id, cerfa?.id, setPartContratCompletion]
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
                // forceUpdate: false, // IF data = "" true
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
            if (newV.contrat.typeContratApp.valueDb === 11) {
              setContratNumeroContratPrecedent({ ...contratNumeroContratPrecedent, value: "" });
              setContratDateEffetAvenant({ ...contratDateEffetAvenant, value: "" });
              dataToSave = {
                contrat: {
                  ...dataToSave.contrat,
                  numeroContratPrecedent: null,
                  dateEffetAvenant: null,
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
      setContratNumeroContratPrecedent,
      contratNumeroContratPrecedent,
      setContratDateEffetAvenant,
      contratDateEffetAvenant,
    ]
  );

  const onSubmittedContratTypeDerogation = useCallback(
    async (path, data) => {
      try {
        if (path === "contrat.typeDerogation") {
          const newV = {
            contrat: {
              typeDerogation: {
                ...contratTypeDerogation,
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (contratTypeDerogation.value !== newV.contrat.typeDerogation.value) {
            setContratTypeDerogation(newV.contrat.typeDerogation);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                typeDerogation: convertOptionToValue(newV.contrat.typeDerogation),
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

  const onSubmittedContratNumeroContratPrecedent = useCallback(
    async (path, data) => {
      try {
        if (path === "contrat.numeroContratPrecedent") {
          const newV = {
            contrat: {
              numeroContratPrecedent: {
                ...contratNumeroContratPrecedent,
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (contratNumeroContratPrecedent.value !== newV.contrat.numeroContratPrecedent.value) {
            setContratNumeroContratPrecedent(newV.contrat.numeroContratPrecedent);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                numeroContratPrecedent: newV.contrat.numeroContratPrecedent.value,
              },
            });
            setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [contratNumeroContratPrecedent, setContratNumeroContratPrecedent, dossier?._id, cerfa?.id, setPartContratCompletion]
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
            }
            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
            setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [cerfa?.id, contratAvantageNature, dossier?._id, setContratAvantageNature, setPartContratCompletion]
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
                avantageNourriture: data && parseInt(data) !== 0 ? data : null,
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
                avantageLogement: data && parseInt(data) !== 0 ? data : null,
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

  const onSubmittedContratRemunerationMajoration = useCallback(
    async (path, data) => {
      try {
        if (path === "contrat.remunerationMajoration") {
          const newV = {
            contrat: {
              remunerationMajoration: {
                ...contratRemunerationMajoration,
                value: data.remunerationMajoration,
                valueDb: convertOptionToValue({ ...contratRemunerationMajoration, value: data.remunerationMajoration }),
              },
            },
          };
          if (contratRemunerationMajoration.value !== newV.contrat.remunerationMajoration.value) {
            setContratRemunerationMajoration(newV.contrat.remunerationMajoration);

            let dataToSave = {
              contrat: {
                remunerationMajoration: convertOptionToValue(newV.contrat.remunerationMajoration),
              },
            };
            if (data.remunerationsAnnuelles && data.remunerationsAnnuellesDbValue && data.salaireEmbauche) {
              setRemunerations(data);
              dataToSave = {
                contrat: {
                  ...dataToSave.contrat,
                  remunerationsAnnuelles: data.remunerationsAnnuellesDbValue,
                  salaireEmbauche: data.salaireEmbauche.toFixed(2),
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
      contratRemunerationMajoration,
      dossier?._id,
      setContratRemunerationMajoration,
      setPartContratCompletion,
      setRemunerations,
    ]
  );

  const setAll = async (res) => {
    setContratModeContractuel(convertValueToOption(res.contrat.modeContractuel));
    setContratTypeContratApp(convertValueToMultipleSelectOption(res.contrat.typeContratApp));
    setContratNumeroContratPrecedent(res.contrat.numeroContratPrecedent);
    setContratNoContrat(res.contrat.noContrat);
    setContratNoAvenant(res.contrat.noAvenant);
    setContratDateDebutContrat(convertValueToDate(res.contrat.dateDebutContrat));
    seContratDureeContrat(res.contrat.dureeContrat);
    setContratDateEffetAvenant(convertValueToDate(res.contrat.dateEffetAvenant));
    setContratDateConclusion(convertValueToDate(res.contrat.dateConclusion));
    setContratDateFinContrat(convertValueToDate(res.contrat.dateFinContrat));
    setContratDateRupture(convertValueToDate(res.contrat.dateRupture));
    setContratLieuSignatureContrat(res.contrat.lieuSignatureContrat);
    setContratTypeDerogation(convertValueToOption(res.contrat.typeDerogation));
    setContratDureeTravailHebdoHeures(res.contrat.dureeTravailHebdoHeures);
    setContratDureeTravailHebdoMinutes(res.contrat.dureeTravailHebdoMinutes);
    setContratTravailRisque(convertValueToOption(res.contrat.travailRisque));
    setContratSalaireEmbauche(res.contrat.salaireEmbauche);
    setContratCaisseRetraiteComplementaire(res.contrat.caisseRetraiteComplementaire);
    setContratAvantageNature(convertValueToOption(res.contrat.avantageNature));
    setContratAvantageNourriture(res.contrat.avantageNourriture);
    setContratAvantageLogement(res.contrat.avantageLogement);
    setContratAutreAvantageEnNature(convertValueToOption(res.contrat.autreAvantageEnNature));

    setContratRemunerationMajoration(convertValueToOption(res.contrat.remunerationMajoration));

    for (let index = 0; index < res.contrat.remunerationsAnnuelles.length; index++) {
      const remunerationsAnnuelles = res.contrat.remunerationsAnnuelles[index];

      switch (remunerationsAnnuelles.ordre.value) {
        case "1.1":
          setContratRemunerationsAnnuelles11DateDebut({
            ...convertValueToDate(remunerationsAnnuelles.dateDebut),
            locked: true,
          });
          setContratRemunerationsAnnuelles11DateFin({
            ...convertValueToDate(remunerationsAnnuelles.dateFin),
            locked: true,
          });
          setContratRemunerationsAnnuelles11Taux({ ...remunerationsAnnuelles.taux, locked: true });
          setContratRemunerationsAnnuelles11TypeSalaire({
            ...convertValueToOption(remunerationsAnnuelles.typeSalaire),
            locked: true,
          });
          setContratRemunerationsAnnuelles11SalaireBrut({ ...remunerationsAnnuelles.salaireBrut, locked: true });
          break;
        case "1.2":
          setContratRemunerationsAnnuelles12DateDebut({
            ...convertValueToDate(remunerationsAnnuelles.dateDebut),
            locked: true,
          });
          setContratRemunerationsAnnuelles12DateFin({
            ...convertValueToDate(remunerationsAnnuelles.dateFin),
            locked: true,
          });
          setContratRemunerationsAnnuelles12Taux({ ...remunerationsAnnuelles.taux, locked: true });
          setContratRemunerationsAnnuelles12TypeSalaire({
            ...convertValueToOption(remunerationsAnnuelles.typeSalaire),
            locked: true,
          });
          setContratRemunerationsAnnuelles12SalaireBrut({ ...remunerationsAnnuelles.salaireBrut, locked: true });
          break;

        case "2.1":
          setContratRemunerationsAnnuelles21DateDebut({
            ...convertValueToDate(remunerationsAnnuelles.dateDebut),
            locked: true,
          });
          setContratRemunerationsAnnuelles21DateFin({
            ...convertValueToDate(remunerationsAnnuelles.dateFin),
            locked: true,
          });
          setContratRemunerationsAnnuelles21Taux({ ...remunerationsAnnuelles.taux, locked: true });
          setContratRemunerationsAnnuelles21TypeSalaire({
            ...convertValueToOption(remunerationsAnnuelles.typeSalaire),
            locked: true,
          });
          setContratRemunerationsAnnuelles21SalaireBrut({ ...remunerationsAnnuelles.salaireBrut, locked: true });
          break;
        case "2.2":
          setContratRemunerationsAnnuelles22DateDebut({
            ...convertValueToDate(remunerationsAnnuelles.dateDebut),
            locked: true,
          });
          setContratRemunerationsAnnuelles22DateFin({
            ...convertValueToDate(remunerationsAnnuelles.dateFin),
            locked: true,
          });
          setContratRemunerationsAnnuelles22Taux({ ...remunerationsAnnuelles.taux, locked: true });
          setContratRemunerationsAnnuelles22TypeSalaire({
            ...convertValueToOption(remunerationsAnnuelles.typeSalaire),
            locked: true,
          });
          setContratRemunerationsAnnuelles22SalaireBrut({ ...remunerationsAnnuelles.salaireBrut, locked: true });
          break;

        case "3.1":
          setContratRemunerationsAnnuelles31DateDebut({
            ...convertValueToDate(remunerationsAnnuelles.dateDebut),
            locked: true,
          });
          setContratRemunerationsAnnuelles31DateFin({
            ...convertValueToDate(remunerationsAnnuelles.dateFin),
            locked: true,
          });
          setContratRemunerationsAnnuelles31Taux({ ...remunerationsAnnuelles.taux, locked: true });
          setContratRemunerationsAnnuelles31TypeSalaire({
            ...convertValueToOption(remunerationsAnnuelles.typeSalaire),
            locked: true,
          });
          setContratRemunerationsAnnuelles31SalaireBrut({ ...remunerationsAnnuelles.salaireBrut, locked: true });
          break;
        case "3.2":
          setContratRemunerationsAnnuelles32DateDebut({
            ...convertValueToDate(remunerationsAnnuelles.dateDebut),
            locked: true,
          });
          setContratRemunerationsAnnuelles32DateFin({
            ...convertValueToDate(remunerationsAnnuelles.dateFin),
            locked: true,
          });
          setContratRemunerationsAnnuelles32Taux({ ...remunerationsAnnuelles.taux, locked: true });
          setContratRemunerationsAnnuelles32TypeSalaire({
            ...convertValueToOption(remunerationsAnnuelles.typeSalaire),
            locked: true,
          });
          setContratRemunerationsAnnuelles32SalaireBrut({ ...remunerationsAnnuelles.salaireBrut, locked: true });
          break;

        case "4.1":
          setContratRemunerationsAnnuelles41DateDebut({
            ...convertValueToDate(remunerationsAnnuelles.dateDebut),
            locked: true,
          });
          setContratRemunerationsAnnuelles41DateFin({
            ...convertValueToDate(remunerationsAnnuelles.dateFin),
            locked: true,
          });
          setContratRemunerationsAnnuelles41Taux({ ...remunerationsAnnuelles.taux, locked: true });
          setContratRemunerationsAnnuelles41TypeSalaire({
            ...convertValueToOption(remunerationsAnnuelles.typeSalaire),
            locked: true,
          });
          setContratRemunerationsAnnuelles41SalaireBrut({ ...remunerationsAnnuelles.salaireBrut, locked: true });
          break;
        case "4.2":
          setContratRemunerationsAnnuelles42DateDebut({
            ...convertValueToDate(remunerationsAnnuelles.dateDebut),
            locked: true,
          });
          setContratRemunerationsAnnuelles42DateFin({
            ...convertValueToDate(remunerationsAnnuelles.dateFin),
            locked: true,
          });
          setContratRemunerationsAnnuelles42Taux({ ...remunerationsAnnuelles.taux, locked: true });
          setContratRemunerationsAnnuelles42TypeSalaire({
            ...convertValueToOption(remunerationsAnnuelles.typeSalaire),
            locked: true,
          });
          setContratRemunerationsAnnuelles42SalaireBrut({ ...remunerationsAnnuelles.salaireBrut, locked: true });
          break;

        default:
          break;
      }
    }

    setPartContratCompletion(cerfaContratCompletion(res));
  };

  return {
    completion: partContratCompletion,
    get: {
      contrat: {
        modeContractuel: contratModeContractuel,
        typeContratApp: contratTypeContratApp,
        numeroContratPrecedent: contratNumeroContratPrecedent,
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
        salaireEmbauche: contratSalaireEmbauche,
        caisseRetraiteComplementaire: contratCaisseRetraiteComplementaire,
        avantageNature: contratAvantageNature,
        avantageNourriture: contratAvantageNourriture,
        avantageLogement: contratAvantageLogement,
        autreAvantageEnNature: contratAutreAvantageEnNature,
        remunerationMajoration: contratRemunerationMajoration,
        remunerationsAnnuelles: [
          {
            dateDebut: contratRemunerationsAnnuelles11DateDebut,
            dateFin: contratRemunerationsAnnuelles11DateFin,
            taux: contratRemunerationsAnnuelles11Taux,
            typeSalaire: contratRemunerationsAnnuelles11TypeSalaire,
            salaireBrut: contratRemunerationsAnnuelles11SalaireBrut,
          },
          {
            dateDebut: contratRemunerationsAnnuelles12DateDebut,
            dateFin: contratRemunerationsAnnuelles12DateFin,
            taux: contratRemunerationsAnnuelles12Taux,
            typeSalaire: contratRemunerationsAnnuelles12TypeSalaire,
            salaireBrut: contratRemunerationsAnnuelles12SalaireBrut,
          },
          {
            dateDebut: contratRemunerationsAnnuelles21DateDebut,
            dateFin: contratRemunerationsAnnuelles21DateFin,
            taux: contratRemunerationsAnnuelles21Taux,
            typeSalaire: contratRemunerationsAnnuelles21TypeSalaire,
            salaireBrut: contratRemunerationsAnnuelles21SalaireBrut,
          },
          {
            dateDebut: contratRemunerationsAnnuelles22DateDebut,
            dateFin: contratRemunerationsAnnuelles22DateFin,
            taux: contratRemunerationsAnnuelles22Taux,
            typeSalaire: contratRemunerationsAnnuelles22TypeSalaire,
            salaireBrut: contratRemunerationsAnnuelles22SalaireBrut,
          },
          {
            dateDebut: contratRemunerationsAnnuelles31DateDebut,
            dateFin: contratRemunerationsAnnuelles31DateFin,
            taux: contratRemunerationsAnnuelles31Taux,
            typeSalaire: contratRemunerationsAnnuelles31TypeSalaire,
            salaireBrut: contratRemunerationsAnnuelles31SalaireBrut,
          },
          {
            dateDebut: contratRemunerationsAnnuelles32DateDebut,
            dateFin: contratRemunerationsAnnuelles32DateFin,
            taux: contratRemunerationsAnnuelles32Taux,
            typeSalaire: contratRemunerationsAnnuelles32TypeSalaire,
            salaireBrut: contratRemunerationsAnnuelles32SalaireBrut,
          },
          {
            dateDebut: contratRemunerationsAnnuelles41DateDebut,
            dateFin: contratRemunerationsAnnuelles41DateFin,
            taux: contratRemunerationsAnnuelles41Taux,
            typeSalaire: contratRemunerationsAnnuelles41TypeSalaire,
            salaireBrut: contratRemunerationsAnnuelles41SalaireBrut,
          },
          {
            dateDebut: contratRemunerationsAnnuelles42DateDebut,
            dateFin: contratRemunerationsAnnuelles42DateFin,
            taux: contratRemunerationsAnnuelles42Taux,
            typeSalaire: contratRemunerationsAnnuelles42TypeSalaire,
            salaireBrut: contratRemunerationsAnnuelles42SalaireBrut,
          },
        ],
      },
    },
    setAll,
    setRemunerations,
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
        lieuSignatureContrat: onSubmittedContratLieuSignatureContrat,
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
  };
}
