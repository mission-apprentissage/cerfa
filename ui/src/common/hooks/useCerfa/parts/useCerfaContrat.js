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
} from "../../../utils/formUtils";
import { saveCerfa } from "../useCerfa";
import { cerfaAtom } from "../cerfaAtom";
import { dossierAtom } from "../../useDossier/dossierAtom";
import * as contratAtoms from "./useCerfaContratAtoms";

const cerfaContratCompletion = (res) => {
  let fieldsToKeep = {
    contratTypeContratApp: res.contrat.typeContratApp,
    contratDateDebutContrat: res.contrat.dateDebutContrat,
    // contratDateConclusion: res.contrat.dateConclusion,
    contratDateFinContrat: res.contrat.dateFinContrat,
    // contratLieuSignatureContrat: res.contrat.lieuSignatureContrat,
    contratTypeDerogation: res.contrat.typeDerogation,
    contratDureeTravailHebdoHeures: res.contrat.dureeTravailHebdoHeures,
    contratDureeTravailHebdoMinutes: res.contrat.dureeTravailHebdoMinutes,
    contratTravailRisque: res.contrat.travailRisque,
    // contratSalaireEmbauche: res.contrat.salaireEmbauche,
    contratCaisseRetraiteComplementaire: res.contrat.caisseRetraiteComplementaire,
    contratAvantageNature: res.contrat.avantageNature,
    contratRemunerationMajoration: res.contrat.remunerationMajoration,
  };
  let countFields = 10;
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

export const CerfaContratController = async (dossier) => {
  return {
    contrat: {
      dateDebutContrat: {
        doAsyncActions: async (value, data) => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          const dateDebutContrat = DateTime.fromISO(value).setLocale("fr-FR");
          const apprentiDateNaissance = DateTime.fromISO(data.apprentiDateNaissance).setLocale("fr-FR");

          const dateFinA1 = dateDebutContrat.plus({ years: 1 }).minus({ days: 1 });
          const dateDebutA2 = dateDebutContrat.plus({ years: 1 });
          const dateFinA2 = dateDebutA2.plus({ years: 1 }).minus({ days: 1 });
          const dateDebutA3 = dateDebutA2.plus({ years: 1 });
          const dateFinA3 = dateDebutA3.plus({ years: 1 }).minus({ days: 1 });
          const dateDebutA4 = dateDebutA3.plus({ years: 1 });
          const dateFinA4 = dateDebutA4.plus({ years: 1 }).minus({ days: 1 });

          const ageA1 = Math.floor(data.apprentiAge);
          const anniversaireA1 = apprentiDateNaissance.plus({ years: Math.round(data.apprentiAge) });
          const ageA2 = ageA1 + 1;
          const anniversaireA2 = anniversaireA1.plus({ years: 1 });
          const ageA3 = ageA2 + 1;
          const anniversaireA3 = anniversaireA2.plus({ years: 1 });
          const ageA4 = ageA3 + 1;
          const anniversaireA4 = anniversaireA3.plus({ years: 1 });
          const ageA5 = ageA4 + 1;

          const SMIC = 1603.12; // 10.57/h    (mayotte:  7.98/h)   Pour 35h
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

          let result1 = {};
          if (isChangingTaux(ageA1, ageA2)) {
            const dateFin11 = anniversaireA1.minus({ days: anniversaireA1.toObject().day }).plus({ months: 1 });
            const dateDebut12 = dateFin11.plus({ days: 1 });
            result1 = {
              11: {
                dateDebut: dateDebutContrat.toFormat("yyyy-MM-dd"),
                dateFin: dateFin11.toFormat("yyyy-MM-dd"),
                taux: taux.a1[getSeuils(ageA1)],
                typeSalaire: "SMIC",
                salaireBrut: (SMIC * (taux.a1[getSeuils(ageA1)] + data.remunerationMajoration)) / 100,
              },
              12: {
                dateDebut: dateDebut12.toFormat("yyyy-MM-dd"),
                dateFin: dateFinA1.toFormat("yyyy-MM-dd"),
                taux: taux.a1[getSeuils(ageA2)],
                typeSalaire: "SMIC",
                salaireBrut: (SMIC * (taux.a1[getSeuils(ageA2)] + data.remunerationMajoration)) / 100,
              },
            };
          } else {
            result1 = {
              11: {
                dateDebut: dateDebutContrat.toFormat("yyyy-MM-dd"),
                dateFin: dateFinA1.toFormat("yyyy-MM-dd"),
                taux: taux.a1[getSeuils(ageA1)],
                typeSalaire: "SMIC",
                salaireBrut: (SMIC * (taux.a1[getSeuils(ageA1)] + data.remunerationMajoration)) / 100,
              },
              12: {
                dateDebut: "",
                dateFin: "",
                taux: 0,
                typeSalaire: "SMIC",
              },
            };
          }

          let result2 = {};
          if (isChangingTaux(ageA2, ageA3)) {
            const dateFin21 = anniversaireA2.minus({ days: anniversaireA2.toObject().day }).plus({ months: 1 });
            const dateDebut22 = dateFin21.plus({ days: 1 });
            result2 = {
              21: {
                dateDebut: dateDebutA2.toFormat("yyyy-MM-dd"),
                dateFin: dateFin21.toFormat("yyyy-MM-dd"),
                taux: taux.a2[getSeuils(ageA2)],
                typeSalaire: "SMIC",
              },
              22: {
                dateDebut: dateDebut22.toFormat("yyyy-MM-dd"),
                dateFin: dateFinA2.toFormat("yyyy-MM-dd"),
                taux: taux.a2[getSeuils(ageA3)],
                typeSalaire: "SMIC",
              },
            };
          } else {
            result2 = {
              21: {
                dateDebut: dateDebutA2.toFormat("yyyy-MM-dd"),
                dateFin: dateFinA2.toFormat("yyyy-MM-dd"),
                taux: taux.a2[getSeuils(ageA2)],
                typeSalaire: "SMIC",
              },
              22: {
                dateDebut: "",
                dateFin: "",
                taux: 0,
                typeSalaire: "SMIC",
              },
            };
          }

          let result3 = {};
          if (isChangingTaux(ageA3, ageA4)) {
            const dateFin31 = anniversaireA3.minus({ days: anniversaireA3.toObject().day }).plus({ months: 1 });
            const dateDebut32 = dateFin31.plus({ days: 1 });
            result3 = {
              31: {
                dateDebut: dateDebutA3.toFormat("yyyy-MM-dd"),
                dateFin: dateFin31.toFormat("yyyy-MM-dd"),
                taux: taux.a3[getSeuils(ageA3)],
                typeSalaire: "SMIC",
              },
              32: {
                dateDebut: dateDebut32.toFormat("yyyy-MM-dd"),
                dateFin: dateFinA3.toFormat("yyyy-MM-dd"),
                taux: taux.a3[getSeuils(ageA4)],
                typeSalaire: "SMIC",
              },
            };
          } else {
            result3 = {
              31: {
                dateDebut: dateDebutA3.toFormat("yyyy-MM-dd"),
                dateFin: dateFinA3.toFormat("yyyy-MM-dd"),
                taux: taux.a3[getSeuils(ageA3)],
                typeSalaire: "SMIC",
              },
              32: {
                dateDebut: "",
                dateFin: "",
                taux: 0,
                typeSalaire: "SMIC",
              },
            };
          }

          let result4 = {};
          if (isChangingTaux(ageA4, ageA5)) {
            const dateFin41 = anniversaireA4.minus({ days: anniversaireA4.toObject().day }).plus({ months: 1 });
            const dateDebut42 = dateFin41.plus({ days: 1 });
            result4 = {
              41: {
                dateDebut: dateDebutA4.toFormat("yyyy-MM-dd"),
                dateFin: dateFin41.toFormat("yyyy-MM-dd"),
                taux: taux.a4[getSeuils(ageA4)],
                typeSalaire: "SMIC",
              },
              42: {
                dateDebut: dateDebut42.toFormat("yyyy-MM-dd"),
                dateFin: dateFinA4.toFormat("yyyy-MM-dd"),
                taux: taux.a4[getSeuils(ageA5)],
                typeSalaire: "SMIC",
              },
            };
          } else {
            result4 = {
              41: {
                dateDebut: dateDebutA4.toFormat("yyyy-MM-dd"),
                dateFin: dateFinA4.toFormat("yyyy-MM-dd"),
                taux: taux.a4[getSeuils(ageA4)],
                typeSalaire: "SMIC",
              },
              42: {
                dateDebut: "",
                dateFin: "",
                taux: 0,
                typeSalaire: "SMIC",
              },
            };
          }

          const remunerationsAnnuelles = {
            ...result1,
            ...result2,
            ...result3,
            ...result4,
          };

          return {
            successed: true,
            data: {
              dateDebutContrat: value,
              remunerationsAnnuelles,
              salaireEmbauche: remunerationsAnnuelles["11"].salaireBrut,
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

  const onSubmittedContratDateDebutContrat = useCallback(
    async (path, data) => {
      try {
        if (path === "contrat.dateDebutContrat") {
          const newV = {
            contrat: {
              dateDebutContrat: {
                ...contratDateDebutContrat,
                value: data.dateDebutContrat,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (contratDateDebutContrat.value !== newV.contrat.dateDebutContrat.value) {
            setContratDateDebutContrat(newV.contrat.dateDebutContrat);
            //
            setContratSalaireEmbauche({
              ...contratSalaireEmbauche,
              value: data.salaireEmbauche.toFixed(4),
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

            //
            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                dateDebutContrat: convertDateToValue(newV.contrat.dateDebutContrat),
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
      contratDateDebutContrat,
      setContratDateDebutContrat,
      setContratSalaireEmbauche,
      contratSalaireEmbauche,
      setContratRemunerationsAnnuelles11DateDebut,
      contratRemunerationsAnnuelles11DateDebut,
      setContratRemunerationsAnnuelles11DateFin,
      contratRemunerationsAnnuelles11DateFin,
      setContratRemunerationsAnnuelles11Taux,
      contratRemunerationsAnnuelles11Taux,
      setContratRemunerationsAnnuelles11TypeSalaire,
      contratRemunerationsAnnuelles11TypeSalaire,
      setContratRemunerationsAnnuelles12DateDebut,
      contratRemunerationsAnnuelles12DateDebut,
      setContratRemunerationsAnnuelles12DateFin,
      contratRemunerationsAnnuelles12DateFin,
      setContratRemunerationsAnnuelles12Taux,
      contratRemunerationsAnnuelles12Taux,
      setContratRemunerationsAnnuelles12TypeSalaire,
      contratRemunerationsAnnuelles12TypeSalaire,
      setContratRemunerationsAnnuelles21DateDebut,
      contratRemunerationsAnnuelles21DateDebut,
      setContratRemunerationsAnnuelles21DateFin,
      contratRemunerationsAnnuelles21DateFin,
      setContratRemunerationsAnnuelles21Taux,
      contratRemunerationsAnnuelles21Taux,
      setContratRemunerationsAnnuelles21TypeSalaire,
      contratRemunerationsAnnuelles21TypeSalaire,
      setContratRemunerationsAnnuelles22DateDebut,
      contratRemunerationsAnnuelles22DateDebut,
      setContratRemunerationsAnnuelles22DateFin,
      contratRemunerationsAnnuelles22DateFin,
      setContratRemunerationsAnnuelles22Taux,
      contratRemunerationsAnnuelles22Taux,
      setContratRemunerationsAnnuelles22TypeSalaire,
      contratRemunerationsAnnuelles22TypeSalaire,
      setContratRemunerationsAnnuelles31DateDebut,
      contratRemunerationsAnnuelles31DateDebut,
      setContratRemunerationsAnnuelles31DateFin,
      contratRemunerationsAnnuelles31DateFin,
      setContratRemunerationsAnnuelles31Taux,
      contratRemunerationsAnnuelles31Taux,
      setContratRemunerationsAnnuelles31TypeSalaire,
      contratRemunerationsAnnuelles31TypeSalaire,
      setContratRemunerationsAnnuelles32DateDebut,
      contratRemunerationsAnnuelles32DateDebut,
      setContratRemunerationsAnnuelles32DateFin,
      contratRemunerationsAnnuelles32DateFin,
      setContratRemunerationsAnnuelles32Taux,
      contratRemunerationsAnnuelles32Taux,
      setContratRemunerationsAnnuelles32TypeSalaire,
      contratRemunerationsAnnuelles32TypeSalaire,
      setContratRemunerationsAnnuelles41DateDebut,
      contratRemunerationsAnnuelles41DateDebut,
      setContratRemunerationsAnnuelles41DateFin,
      contratRemunerationsAnnuelles41DateFin,
      setContratRemunerationsAnnuelles41Taux,
      contratRemunerationsAnnuelles41Taux,
      setContratRemunerationsAnnuelles41TypeSalaire,
      contratRemunerationsAnnuelles41TypeSalaire,
      setContratRemunerationsAnnuelles42DateDebut,
      contratRemunerationsAnnuelles42DateDebut,
      setContratRemunerationsAnnuelles42DateFin,
      contratRemunerationsAnnuelles42DateFin,
      setContratRemunerationsAnnuelles42Taux,
      contratRemunerationsAnnuelles42Taux,
      setContratRemunerationsAnnuelles42TypeSalaire,
      contratRemunerationsAnnuelles42TypeSalaire,
      dossier?._id,
      cerfa?.id,
      setPartContratCompletion,
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
                value: data,
                // forceUpdate: false, // IF data = "" true
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
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (contratDateFinContrat.value !== newV.contrat.dateFinContrat.value) {
            setContratDateFinContrat(newV.contrat.dateFinContrat);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                dateFinContrat: convertDateToValue(newV.contrat.dateFinContrat),
              },
            });
            setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [contratDateFinContrat, setContratDateFinContrat, dossier?._id, cerfa?.id, setPartContratCompletion]
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
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (contratDureeTravailHebdoHeures.value !== newV.contrat.dureeTravailHebdoHeures.value) {
            setContratDureeTravailHebdoHeures(newV.contrat.dureeTravailHebdoHeures);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                dureeTravailHebdoHeures: newV.contrat.dureeTravailHebdoHeures.value,
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
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (contratDureeTravailHebdoMinutes.value !== newV.contrat.dureeTravailHebdoMinutes.value) {
            setContratDureeTravailHebdoMinutes(newV.contrat.dureeTravailHebdoMinutes);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                dureeTravailHebdoMinutes: newV.contrat.dureeTravailHebdoMinutes.value,
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
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (contratTypeContratApp.value !== newV.contrat.typeContratApp.value) {
            setContratTypeContratApp(newV.contrat.typeContratApp);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                typeContratApp: convertMultipleSelectOptionToValue(newV.contrat.typeContratApp),
              },
            });
            setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [contratTypeContratApp, setContratTypeContratApp, dossier?._id, cerfa?.id, setPartContratCompletion]
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

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                avantageNature: convertOptionToValue(newV.contrat.avantageNature),
              },
            });
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
                avantageNourriture: newV.contrat.avantageNourriture.value,
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
                avantageLogement: newV.contrat.avantageLogement.value,
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
                value: data,
              },
            },
          };
          if (contratAutreAvantageEnNature.value !== newV.contrat.autreAvantageEnNature.value) {
            setContratAutreAvantageEnNature(newV.contrat.autreAvantageEnNature);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                autreAvantageEnNature: convertOptionToValue(newV.contrat.autreAvantageEnNature),
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
                value: data,
                valueDb: convertOptionToValue({ ...contratRemunerationMajoration, value: data }),
              },
            },
          };
          if (contratRemunerationMajoration.value !== newV.contrat.remunerationMajoration.value) {
            setContratRemunerationMajoration(newV.contrat.remunerationMajoration);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              contrat: {
                remunerationMajoration: convertOptionToValue(newV.contrat.remunerationMajoration),
              },
            });
            setPartContratCompletion(cerfaContratCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [cerfa?.id, contratRemunerationMajoration, dossier?._id, setContratRemunerationMajoration, setPartContratCompletion]
  );

  const setAll = async (res) => {
    setContratModeContractuel(convertValueToOption(res.contrat.modeContractuel));
    setContratTypeContratApp(convertValueToMultipleSelectOption(res.contrat.typeContratApp));
    setContratNumeroContratPrecedent(res.contrat.numeroContratPrecedent);
    setContratNoContrat(res.contrat.noContrat);
    setContratNoAvenant(res.contrat.noAvenant);
    setContratDateDebutContrat(convertValueToDate(res.contrat.dateDebutContrat));
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
          setContratRemunerationsAnnuelles11DateDebut(convertValueToDate(remunerationsAnnuelles.dateDebut));
          setContratRemunerationsAnnuelles11DateFin(convertValueToDate(remunerationsAnnuelles.dateFin));
          setContratRemunerationsAnnuelles11Taux(remunerationsAnnuelles.taux);
          setContratRemunerationsAnnuelles11TypeSalaire(convertValueToOption(remunerationsAnnuelles.typeSalaire));
          break;
        case "1.2":
          setContratRemunerationsAnnuelles12DateDebut(remunerationsAnnuelles.dateDebut);
          setContratRemunerationsAnnuelles12DateFin(remunerationsAnnuelles.dateFin);
          setContratRemunerationsAnnuelles12Taux(remunerationsAnnuelles.taux);
          setContratRemunerationsAnnuelles12TypeSalaire(remunerationsAnnuelles.typeSalaire);
          break;

        case "2.1":
          setContratRemunerationsAnnuelles21DateDebut(remunerationsAnnuelles.dateDebut);
          setContratRemunerationsAnnuelles21DateFin(remunerationsAnnuelles.dateFin);
          setContratRemunerationsAnnuelles21Taux(remunerationsAnnuelles.taux);
          setContratRemunerationsAnnuelles21TypeSalaire(remunerationsAnnuelles.typeSalaire);
          break;
        case "2.2":
          setContratRemunerationsAnnuelles22DateDebut(remunerationsAnnuelles.dateDebut);
          setContratRemunerationsAnnuelles22DateFin(remunerationsAnnuelles.dateFin);
          setContratRemunerationsAnnuelles22Taux(remunerationsAnnuelles.taux);
          setContratRemunerationsAnnuelles22TypeSalaire(remunerationsAnnuelles.typeSalaire);
          break;

        case "3.1":
          setContratRemunerationsAnnuelles31DateDebut(remunerationsAnnuelles.dateDebut);
          setContratRemunerationsAnnuelles31DateFin(remunerationsAnnuelles.dateFin);
          setContratRemunerationsAnnuelles31Taux(remunerationsAnnuelles.taux);
          setContratRemunerationsAnnuelles31TypeSalaire(remunerationsAnnuelles.typeSalaire);
          break;
        case "3.2":
          setContratRemunerationsAnnuelles32DateDebut(remunerationsAnnuelles.dateDebut);
          setContratRemunerationsAnnuelles32DateFin(remunerationsAnnuelles.dateFin);
          setContratRemunerationsAnnuelles32Taux(remunerationsAnnuelles.taux);
          setContratRemunerationsAnnuelles32TypeSalaire(remunerationsAnnuelles.typeSalaire);
          break;

        case "4.1":
          setContratRemunerationsAnnuelles41DateDebut(remunerationsAnnuelles.dateDebut);
          setContratRemunerationsAnnuelles41DateFin(remunerationsAnnuelles.dateFin);
          setContratRemunerationsAnnuelles41Taux(remunerationsAnnuelles.taux);
          setContratRemunerationsAnnuelles41TypeSalaire(remunerationsAnnuelles.typeSalaire);
          break;
        case "4.2":
          setContratRemunerationsAnnuelles42DateDebut(remunerationsAnnuelles.dateDebut);
          setContratRemunerationsAnnuelles42DateFin(remunerationsAnnuelles.dateFin);
          setContratRemunerationsAnnuelles42Taux(remunerationsAnnuelles.taux);
          setContratRemunerationsAnnuelles42TypeSalaire(remunerationsAnnuelles.typeSalaire);
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
          },
          {
            dateDebut: contratRemunerationsAnnuelles12DateDebut,
            dateFin: contratRemunerationsAnnuelles12DateFin,
            taux: contratRemunerationsAnnuelles12Taux,
            typeSalaire: contratRemunerationsAnnuelles12TypeSalaire,
          },
          {
            dateDebut: contratRemunerationsAnnuelles21DateDebut,
            dateFin: contratRemunerationsAnnuelles21DateFin,
            taux: contratRemunerationsAnnuelles21Taux,
            typeSalaire: contratRemunerationsAnnuelles21TypeSalaire,
          },
          {
            dateDebut: contratRemunerationsAnnuelles22DateDebut,
            dateFin: contratRemunerationsAnnuelles22DateFin,
            taux: contratRemunerationsAnnuelles22Taux,
            typeSalaire: contratRemunerationsAnnuelles22TypeSalaire,
          },
          {
            dateDebut: contratRemunerationsAnnuelles31DateDebut,
            dateFin: contratRemunerationsAnnuelles31DateFin,
            taux: contratRemunerationsAnnuelles31Taux,
            typeSalaire: contratRemunerationsAnnuelles31TypeSalaire,
          },
          {
            dateDebut: contratRemunerationsAnnuelles32DateDebut,
            dateFin: contratRemunerationsAnnuelles32DateFin,
            taux: contratRemunerationsAnnuelles32Taux,
            typeSalaire: contratRemunerationsAnnuelles32TypeSalaire,
          },
          {
            dateDebut: contratRemunerationsAnnuelles41DateDebut,
            dateFin: contratRemunerationsAnnuelles41DateFin,
            taux: contratRemunerationsAnnuelles41Taux,
            typeSalaire: contratRemunerationsAnnuelles41TypeSalaire,
          },
          {
            dateDebut: contratRemunerationsAnnuelles42DateDebut,
            dateFin: contratRemunerationsAnnuelles42DateFin,
            taux: contratRemunerationsAnnuelles42Taux,
            typeSalaire: contratRemunerationsAnnuelles42TypeSalaire,
          },
        ],
      },
    },
    setAll,
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
