/***
 * Multiple states on purpose to avoid full re-rendering at each modification
 */

import { useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  fieldCompletionPercentage,
  convertValueToDate,
  convertDateToValue,
  convertValueToOption,
  isAgeInValidAtDate,
  caclAgeFromStringDate,
} from "../../../utils/formUtils";
import { saveCerfa } from "../useCerfa";
import { cerfaAtom } from "../cerfaAtom";
import { dossierAtom } from "../../useDossier/dossierAtom";
import * as maitresAtoms from "./useCerfaMaitresAtoms";

const cerfaMaitresCompletion = (res) => {
  let fieldsToKeep = {
    maitre1Nom: res.maitre1.nom,
    maitre1Prenom: res.maitre1.prenom,
    maitre1DateNaissance: res.maitre1.dateNaissance,

    employeurAttestationEligibilite: res.employeur.attestationEligibilite,
  };
  let countFields = 4;
  if (res.maitre2.nom.value !== "" || res.maitre2.prenom.value !== "" || res.maitre2.dateNaissance.value !== "") {
    fieldsToKeep = {
      ...fieldsToKeep,
      maitre2Nom: res.maitre2.nom,
      maitre2Prenom: res.maitre2.prenom,
      maitre2DateNaissance: res.maitre2.dateNaissance,
    };
    countFields = countFields + 3;
  }

  return fieldCompletionPercentage(fieldsToKeep, countFields);
};

export const CerfaMaitresController = async (dossier) => {
  return {
    maitre1: {
      dateNaissance: {
        doAsyncActions: async (value, data) => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          const { age, dateNaissance } = caclAgeFromStringDate(value);

          if (age === 0) {
            return {
              successed: false,
              data: null,
              message: "La date de naissance de peut pas être dans le futur",
            };
          }

          const isAgeMaitreInvalidAtStart = isAgeInValidAtDate({
            dateNaissance,
            age,
            dateString: data.dateDebutContrat,
            limitAge: 18,
            label: "Le maître d'apprentissage doit avoir au moins 18 ans à la date de début d'exécution du contrat",
          });
          if (isAgeMaitreInvalidAtStart) return isAgeMaitreInvalidAtStart;

          return {
            successed: true,
            data: {
              dateNaissance: value,
            },
            message: null,
          };
        },
      },
    },
    maitre2: {
      dateNaissance: {
        doAsyncActions: async (value, data) => {
          await new Promise((resolve) => setTimeout(resolve, 100));

          const { age, dateNaissance } = caclAgeFromStringDate(value);

          if (age === 0) {
            return {
              successed: false,
              data: null,
              message: "La date de naissance de peut pas être dans le futur",
            };
          }

          const isAgeMaitreInvalidAtStart = isAgeInValidAtDate({
            dateNaissance,
            age,
            dateString: data.dateDebutContrat,
            limitAge: 18,
            label: "Le maître d'apprentissage doit avoir au moins 18 ans à la date de début d'exécution du contrat",
          });
          if (isAgeMaitreInvalidAtStart) return isAgeMaitreInvalidAtStart;

          return {
            successed: true,
            data: {
              dateNaissance: value,
            },
            message: null,
          };
        },
      },
    },
  };
};

export function useCerfaMaitres() {
  const cerfa = useRecoilValue(cerfaAtom);
  const dossier = useRecoilValue(dossierAtom);

  const [partMaitresCompletion, setPartMaitresCompletion] = useRecoilState(maitresAtoms.cerfaPartMaitresCompletionAtom);

  const [maitre1Nom, setMaitre1Nom] = useRecoilState(maitresAtoms.cerfaMaitre1NomAtom);
  const [maitre1Prenom, setMaitre1Prenom] = useRecoilState(maitresAtoms.cerfaMaitre1PrenomAtom);
  const [maitre1DateNaissance, setMaitre1DateNaissance] = useRecoilState(maitresAtoms.cerfaMaitre1DateNaissanceAtom);

  const [maitre2Nom, setMaitre2Nom] = useRecoilState(maitresAtoms.cerfaMaitre2NomAtom);
  const [maitre2Prenom, setMaitre2Prenom] = useRecoilState(maitresAtoms.cerfaMaitre2PrenomAtom);
  const [maitre2DateNaissance, setMaitre2DateNaissance] = useRecoilState(maitresAtoms.cerfaMaitre2DateNaissanceAtom);

  const [employeurAttestationEligibilite, setEmployeurAttestationEligibilite] = useRecoilState(
    maitresAtoms.cerfaEmployeurAttestationEligibiliteAtom
  );

  const onSubmittedMaitre1Nom = useCallback(
    async (path, data) => {
      try {
        if (path === "maitre1.nom") {
          const newV = {
            maitre1: {
              nom: {
                ...maitre1Nom,
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (maitre1Nom.value !== newV.maitre1.nom.value) {
            setMaitre1Nom(newV.maitre1.nom);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              maitre1: {
                nom: newV.maitre1.nom.value,
              },
            });
            setPartMaitresCompletion(cerfaMaitresCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [cerfa?.id, dossier?._id, maitre1Nom, setMaitre1Nom, setPartMaitresCompletion]
  );

  const onSubmittedMaitre1Prenom = useCallback(
    async (path, data) => {
      try {
        if (path === "maitre1.prenom") {
          const newV = {
            maitre1: {
              prenom: {
                ...maitre1Prenom,
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (maitre1Prenom.value !== newV.maitre1.prenom.value) {
            setMaitre1Prenom(newV.maitre1.prenom);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              maitre1: {
                prenom: newV.maitre1.prenom.value,
              },
            });
            setPartMaitresCompletion(cerfaMaitresCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [cerfa?.id, dossier?._id, maitre1Prenom, setMaitre1Prenom, setPartMaitresCompletion]
  );

  const onSubmittedMaitre1DateNaissance = useCallback(
    async (path, data) => {
      try {
        if (path === "maitre1.dateNaissance") {
          const newV = {
            maitre1: {
              dateNaissance: {
                ...maitre1DateNaissance,
                value: data.dateNaissance,
              },
            },
          };
          if (maitre1DateNaissance.value !== newV.maitre1.dateNaissance.value) {
            setMaitre1DateNaissance(newV.maitre1.dateNaissance);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              maitre1: {
                dateNaissance: convertDateToValue(newV.maitre1.dateNaissance),
              },
            });
            setPartMaitresCompletion(cerfaMaitresCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [cerfa?.id, dossier?._id, maitre1DateNaissance, setMaitre1DateNaissance, setPartMaitresCompletion]
  );

  const onSubmittedMaitre2Nom = useCallback(
    async (path, data) => {
      try {
        if (path === "maitre2.nom") {
          const newV = {
            maitre2: {
              nom: {
                ...maitre2Nom,
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (maitre2Nom.value !== newV.maitre2.nom.value) {
            setMaitre2Nom(newV.maitre2.nom);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              maitre2: {
                nom: newV.maitre2.nom.value || null,
              },
            });
            setPartMaitresCompletion(cerfaMaitresCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [cerfa?.id, dossier?._id, maitre2Nom, setMaitre2Nom, setPartMaitresCompletion]
  );

  const onSubmittedMaitre2Prenom = useCallback(
    async (path, data) => {
      try {
        if (path === "maitre2.prenom") {
          const newV = {
            maitre2: {
              prenom: {
                ...maitre2Prenom,
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (maitre2Prenom.value !== newV.maitre2.prenom.value) {
            setMaitre2Prenom(newV.maitre2.prenom);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              maitre2: {
                prenom: newV.maitre2.prenom.value || null,
              },
            });
            setPartMaitresCompletion(cerfaMaitresCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [cerfa?.id, dossier?._id, maitre2Prenom, setMaitre2Prenom, setPartMaitresCompletion]
  );

  const onSubmittedMaitre2DateNaissance = useCallback(
    async (path, data) => {
      try {
        if (path === "maitre2.dateNaissance") {
          const newV = {
            maitre2: {
              dateNaissance: {
                ...maitre2DateNaissance,
                value: data.dateNaissance,
              },
            },
          };
          if (maitre2DateNaissance.value !== newV.maitre2.dateNaissance.value) {
            setMaitre2DateNaissance(newV.maitre2.dateNaissance);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              maitre2: {
                dateNaissance: data.dateNaissance !== "" ? convertDateToValue(newV.maitre2.dateNaissance) : null,
              },
            });
            setPartMaitresCompletion(cerfaMaitresCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [cerfa?.id, dossier?._id, maitre2DateNaissance, setMaitre2DateNaissance, setPartMaitresCompletion]
  );

  const onSubmittedEmployeurAttestationEligibilite = useCallback(
    async (path, data) => {
      try {
        if (path === "employeur.attestationEligibilite") {
          const newV = {
            employeur: {
              attestationEligibilite: {
                ...employeurAttestationEligibilite,
                value: employeurAttestationEligibilite.value === "true" ? "" : "true",
              },
            },
          };
          if (employeurAttestationEligibilite.value !== newV.employeur.attestationEligibilite.value) {
            setEmployeurAttestationEligibilite(newV.employeur.attestationEligibilite);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                attestationEligibilite: newV.employeur.attestationEligibilite.value === "true" ? true : null,
              },
            });
            setPartMaitresCompletion(cerfaMaitresCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      cerfa?.id,
      dossier?._id,
      employeurAttestationEligibilite,
      setEmployeurAttestationEligibilite,
      setPartMaitresCompletion,
    ]
  );

  const setAll = async (res) => {
    setMaitre1Nom(res.maitre1.nom);
    setMaitre1Prenom(res.maitre1.prenom);
    setMaitre1DateNaissance(convertValueToDate(res.maitre1.dateNaissance));

    setMaitre2Nom(res.maitre2.nom);
    setMaitre2Prenom(res.maitre2.prenom);
    setMaitre2DateNaissance(convertValueToDate(res.maitre2.dateNaissance));

    setEmployeurAttestationEligibilite(convertValueToOption(res.employeur.attestationEligibilite));

    setPartMaitresCompletion(cerfaMaitresCompletion(res));
  };

  return {
    completion: partMaitresCompletion,
    get: {
      maitre1: {
        nom: maitre1Nom,
        prenom: maitre1Prenom,
        dateNaissance: maitre1DateNaissance,
      },
      maitre2: {
        nom: maitre2Nom,
        prenom: maitre2Prenom,
        dateNaissance: maitre2DateNaissance,
      },
      employeur: {
        attestationEligibilite: employeurAttestationEligibilite,
      },
    },
    setAll,
    onSubmit: {
      maitre1: {
        nom: onSubmittedMaitre1Nom,
        prenom: onSubmittedMaitre1Prenom,
        dateNaissance: onSubmittedMaitre1DateNaissance,
      },
      maitre2: {
        nom: onSubmittedMaitre2Nom,
        prenom: onSubmittedMaitre2Prenom,
        dateNaissance: onSubmittedMaitre2DateNaissance,
      },
      employeur: {
        attestationEligibilite: onSubmittedEmployeurAttestationEligibilite,
      },
    },
  };
}
