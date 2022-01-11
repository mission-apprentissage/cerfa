/***
 * Multiple states on purpose to avoid full re-rendering at each modification
 */

import { useCallback } from "react";
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
    // contratModeContractuel: res.contrat.modeContractuel,
    contratTypeContratApp: res.contrat.typeContratApp,
    contratNumeroContratPrecedent: res.contrat.numeroContratPrecedent,
    // contratNoContrat: res.contrat.noContrat,
    // contratNoAvenant: res.contrat.noAvenant,
    contratDateDebutContrat: res.contrat.dateDebutContrat,
    contratDateEffetAvenant: res.contrat.dateEffetAvenant,
    contratDateConclusion: res.contrat.dateConclusion,
    contratDateFinContrat: res.contrat.dateFinContrat,
    // contratDateRupture: res.contrat.dateRupture,
    contratLieuSignatureContrat: res.contrat.lieuSignatureContrat,
    contratTypeDerogation: res.contrat.typeDerogation,
    contratDureeTravailHebdoHeures: res.contrat.dureeTravailHebdoHeures,
    contratDureeTravailHebdoMinutes: res.contrat.dureeTravailHebdoMinutes,
    contratTravailRisque: res.contrat.travailRisque,
    contratSalaireEmbauche: res.contrat.salaireEmbauche,
    contratCaisseRetraiteComplementaire: res.contrat.caisseRetraiteComplementaire,
    contratAvantageNature: res.contrat.avantageNature,
    contratAvantageNourriture: res.contrat.avantageNourriture,
    contratAvantageLogement: res.contrat.avantageLogement,
    contratAutreAvantageEnNature: res.contrat.autreAvantageEnNature,
  };
  return fieldCompletionPercentage(fieldsToKeep, res.contrat.avantageNature.value ? 17 : 14);
};

export const CerfaContratController = async (dossier) => {
  return {
    contrat: {},
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
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (contratDateDebutContrat.value !== newV.contrat.dateDebutContrat.value) {
            setContratDateDebutContrat(newV.contrat.dateDebutContrat);

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
    [contratDateDebutContrat, setContratDateDebutContrat, dossier?._id, cerfa?.id, setPartContratCompletion]
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

    for (let index = 0; index < res.contrat.remunerationsAnnuelles.length; index++) {
      const remunerationsAnnuelles = res.contrat.remunerationsAnnuelles[index];
      switch (remunerationsAnnuelles.ordre.value) {
        case "1.1":
          setContratRemunerationsAnnuelles11DateDebut(remunerationsAnnuelles.dateDebut);
          setContratRemunerationsAnnuelles11DateFin(remunerationsAnnuelles.dateFin);
          setContratRemunerationsAnnuelles11Taux(remunerationsAnnuelles.taux);
          setContratRemunerationsAnnuelles11TypeSalaire(remunerationsAnnuelles.typeSalaire);
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
      },
    },
  };
}
